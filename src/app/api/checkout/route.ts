import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getQuote, updateQuote } from '@/lib/quotes/store';
import { rateLimit, limiters } from '@/lib/ratelimit';

/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout session for a given quote.
 * Body: { quoteId: string }
 * Returns: { url: string } — the Stripe-hosted checkout page URL.
 *
 * Environment variables required:
 *   STRIPE_SECRET_KEY — Stripe secret key (sk_live_... or sk_test_...)
 *   NEXT_PUBLIC_BASE_URL — e.g. https://deeptech.com or http://localhost:3000
 */
export async function POST(request: Request) {
  const limited = await rateLimit(limiters.checkout, request);
  if (limited) return limited;

  try {
    const { quoteId } = (await request.json()) as { quoteId?: string };

    if (!quoteId) {
      return NextResponse.json(
        { success: false, message: 'quoteId is required.' },
        { status: 400 }
      );
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      console.error('[checkout] STRIPE_SECRET_KEY not configured');
      return NextResponse.json(
        { success: false, message: 'Payments are not configured.' },
        { status: 503 }
      );
    }

    const quote = await getQuote(quoteId);
    if (!quote) {
      return NextResponse.json(
        { success: false, message: 'Quote not found.' },
        { status: 404 }
      );
    }

    if (quote.status !== 'sent') {
      return NextResponse.json(
        { success: false, message: `Quote cannot be paid — current status: ${quote.status}` },
        { status: 400 }
      );
    }

    // Check expiration
    if (new Date(quote.expiresAt) < new Date()) {
      await updateQuote(quoteId, { status: 'expired' });
      return NextResponse.json(
        { success: false, message: 'This quote has expired. Please request a new one.' },
        { status: 410 }
      );
    }

    const stripe = new Stripe(stripeKey);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const isRecurring = quote.billingCycle === 'monthly';
    const sharedMeta = {
      quoteId: quote.id,
      requestId: quote.requestId,
      customerName: quote.customerName,
      inquiryType: quote.inquiryType,
    };

    let session: Stripe.Checkout.Session;

    if (isRecurring) {
      // ── RaaS / subscription mode ──────────────────────────────────────────
      // Each monthly line item maps to a recurring price_data.
      // One-time items (deposits, setup fees) are not charged here — they
      // should be invoiced separately or added as a setup_intent.
      const monthlyLineItems = quote.lineItems
        .filter((li) => li.billingCycle === 'monthly')
        .map((li): Stripe.Checkout.SessionCreateParams.LineItem => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: li.description,
              description: `via ${li.vendor}${li.notes ? ' — ' + li.notes : ''}`,
            },
            unit_amount: Math.round(li.clientPrice * 100),
            recurring: { interval: 'month' },
          },
          quantity: 1,
        }));

      if (monthlyLineItems.length === 0) {
        return NextResponse.json(
          { success: false, message: 'No monthly line items found for subscription checkout.' },
          { status: 400 }
        );
      }

      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: monthlyLineItems,
        customer_email: quote.customerEmail,
        metadata: sharedMeta,
        subscription_data: { metadata: sharedMeta },
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&quote_id=${quote.id}`,
        cancel_url: `${baseUrl}/quote/${quote.id}?canceled=1`,
      });

      console.log(`[checkout] Created Stripe subscription session ${session.id} for quote ${quote.id} ($${quote.monthlyTotal}/mo)`);
    } else {
      // ── One-time payment mode ─────────────────────────────────────────────
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = quote.lineItems.map((li) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: li.description,
            description: `via ${li.vendor}${li.notes ? ' — ' + li.notes : ''}`,
          },
          unit_amount: Math.round(li.clientPrice * 100),
        },
        quantity: 1,
      }));

      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        customer_email: quote.customerEmail,
        metadata: sharedMeta,
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&quote_id=${quote.id}`,
        cancel_url: `${baseUrl}/quote/${quote.id}?canceled=1`,
      });

      console.log(`[checkout] Created Stripe payment session ${session.id} for quote ${quote.id} ($${quote.total})`);
    }

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    console.error('[checkout] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to create checkout session.' },
      { status: 500 }
    );
  }
}

