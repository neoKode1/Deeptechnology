import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { VENDORS } from '@/data/vendors';
import { toSlug } from '@/lib/utils';
import { resolveBuy } from '@/lib/buy/resolve';
import { rateLimit, limiters } from '@/lib/ratelimit';

/**
 * POST /api/buy
 *
 * Public-facing in-app purchase route. Body:
 *   { vendorId: string, productSlug: string }
 *
 * Resolves the canonical buy action via `resolveBuy()` (same logic the page
 * uses to render the button) and creates a Stripe Checkout session for
 * Buy Now / Reserve / Subscribe paths. Request and Unavailable paths return
 * a 200 with `{ redirect: <fallback href> }` so the client can navigate.
 *
 * The Stripe session metadata captures everything the Step 5 webhook needs to
 * route fulfillment: vendor id/name, product name/slug, buy kind, price, and
 * whether this was a deposit (so the webhook fires the procurement email at
 * the right time).
 */
export async function POST(request: NextRequest) {
  const limited = await rateLimit(limiters.checkout, request);
  if (limited) return limited;

  let body: { vendorId?: string; productSlug?: string };
  try {
    body = (await request.json()) as { vendorId?: string; productSlug?: string };
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON.' }, { status: 400 });
  }

  const { vendorId, productSlug } = body;
  if (!vendorId || !productSlug) {
    return NextResponse.json({ success: false, message: 'vendorId and productSlug are required.' }, { status: 400 });
  }

  const vendor = VENDORS.find(v => v.id === vendorId);
  if (!vendor) {
    return NextResponse.json({ success: false, message: `Unknown vendor: ${vendorId}` }, { status: 404 });
  }
  const product = vendor.products.find(p => toSlug(p.name) === productSlug);
  if (!product) {
    return NextResponse.json({ success: false, message: `Unknown product: ${productSlug}` }, { status: 404 });
  }

  const action = resolveBuy(vendor, product);

  // Non-Stripe flows: client redirects to /contact
  if (action.kind === 'request' || action.kind === 'unavailable') {
    return NextResponse.json({ success: true, redirect: action.fallbackHref });
  }

  if (!action.amountCents || !action.mode) {
    return NextResponse.json({ success: false, message: 'Buy action is misconfigured (missing amount/mode).' }, { status: 500 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error('[buy] STRIPE_SECRET_KEY not configured');
    return NextResponse.json({ success: false, message: 'Payments are not configured.' }, { status: 503 });
  }
  const stripe = new Stripe(stripeKey);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const isDeposit = !!action.isDeposit;
  const description = action.isDeposit
    ? `Refundable deposit toward ${product.name} by ${vendor.name}`
    : action.isSubscription
      ? `${product.name} \u2014 RaaS by ${vendor.name}`
      : `${product.name} by ${vendor.name}`;

  const productPageUrl = `${baseUrl}/robotics/${vendor.id}/${productSlug}`;

  const metadata: Record<string, string> = {
    source: 'public_buy',
    vendorId: vendor.id,
    vendorName: vendor.name,
    productSlug,
    productName: product.name,
    buyKind: action.kind,
    buyPath: vendor.buyPath,
    amountCents: String(action.amountCents),
    isDeposit: isDeposit ? '1' : '0',
    productPageUrl,
  };
  if (action.fullPriceCents) metadata.fullPriceCents = String(action.fullPriceCents);

  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
    price_data: {
      currency: 'usd',
      product_data: { name: action.isDeposit ? `${product.name} \u2014 Reservation Deposit` : product.name, description },
      unit_amount: action.amountCents,
      ...(action.mode === 'subscription' && { recurring: { interval: 'month' } }),
    },
    quantity: 1,
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: action.mode,
      line_items: [lineItem],
      metadata,
      ...(action.mode === 'subscription' && { subscription_data: { metadata } }),
      // Stripe Checkout collects email by default; surface it to webhook via session.customer_details
      billing_address_collection: 'required',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${productPageUrl}?canceled=1`,
    });

    console.log(`[buy] ${action.kind} session ${session.id} \u2014 ${vendor.name} ${product.name} \u2014 $${(action.amountCents/100).toFixed(0)}`);
    return NextResponse.json({ success: true, url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('[buy] Stripe error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to create checkout session.';
    return NextResponse.json({ success: false, message: msg }, { status: 502 });
  }
}
