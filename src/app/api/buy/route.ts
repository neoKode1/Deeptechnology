import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { VENDORS } from '@/data/vendors';
import { toSlug } from '@/lib/utils';
import { resolveBuy } from '@/lib/buy/resolve';
import { rateLimit, limiters } from '@/lib/ratelimit';
import { createQuote } from '@/lib/quotes/store';

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

  // Pre-create a draft Quote so the in-app purchase shares the existing
  // /admin/quotes lifecycle and the customer can /orders/[id] track from the
  // success page. Customer details are filled in by the webhook on completion.
  const vendorCost = action.fullPriceCents
    ? action.fullPriceCents / 100
    : action.amountCents / 100;
  const billingCycle = action.mode === 'subscription' ? 'monthly' : 'one_time';
  const inquiryType = action.kind === 'subscribe'
    ? 'Robot-as-a-Service'
    : isDeposit ? 'Reservation' : 'Direct Purchase';
  const summary = `${vendor.name} ${product.name} — ${action.kind}` +
    (isDeposit && action.fullPriceCents
      ? ` (deposit $${(action.amountCents / 100).toFixed(0)} of $${(action.fullPriceCents / 100).toFixed(0)})`
      : '');

  let quoteId: string | undefined;
  try {
    const draft = await createQuote({
      requestId: `public-buy-${Date.now()}`,
      customerName: 'Pending (Stripe Checkout)',
      customerEmail: '',
      inquiryType,
      summary,
      lineItems: [{
        description: product.name,
        vendor: vendor.name,
        vendorUrl: product.orderUrl,
        vendorCost,
        markup: 0,
        billingCycle,
        notes: `Public buy via /api/buy. Buy path: ${vendor.buyPath} · ${action.kind}.`,
      }],
      notes: `In-app ${action.kind} for ${vendor.name} ${product.name}. Customer details captured at Stripe completion.`,
    });
    quoteId = draft.id;
  } catch (e) {
    // D1 unavailable shouldn't block payment — the webhook will create the
    // quote at completion time as a fallback.
    console.warn('[buy] Pre-create quote failed (will fall back to webhook):', e instanceof Error ? e.message : e);
  }

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
  if (quoteId) metadata.quoteId = quoteId;

  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
    price_data: {
      currency: 'usd',
      product_data: { name: action.isDeposit ? `${product.name} \u2014 Reservation Deposit` : product.name, description },
      unit_amount: action.amountCents,
      ...(action.mode === 'subscription' && { recurring: { interval: 'month' } }),
    },
    quantity: 1,
  };

  // success_url carries quote_id when we have one so the success page can
  // surface a "Track Your Order" link without a server round-trip.
  const successUrl = quoteId
    ? `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&quote_id=${quoteId}`
    : `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: action.mode,
      line_items: [lineItem],
      metadata,
      ...(action.mode === 'subscription' && { subscription_data: { metadata } }),
      // Stripe Checkout collects email by default; surface it to webhook via session.customer_details
      billing_address_collection: 'required',
      success_url: successUrl,
      cancel_url: `${productPageUrl}?canceled=1`,
    });

    console.log(`[buy] ${action.kind} session ${session.id} \u2014 ${vendor.name} ${product.name} \u2014 $${(action.amountCents/100).toFixed(0)}${quoteId ? ` \u2014 quote ${quoteId}` : ''}`);
    return NextResponse.json({ success: true, url: session.url, sessionId: session.id, quoteId });
  } catch (err) {
    console.error('[buy] Stripe error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to create checkout session.';
    return NextResponse.json({ success: false, message: msg }, { status: 502 });
  }
}
