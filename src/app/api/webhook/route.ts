import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getQuote, updateQuote } from '@/lib/quotes/store';

/**
 * POST /api/webhook
 *
 * Stripe webhook endpoint. Verifies signature, then processes events.
 *
 * Handled events:
 *   checkout.session.completed → marks quote as "accepted" + "ordered"
 *
 * Environment variables required:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET — whsec_... from Stripe Dashboard or CLI
 */
export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.error('[webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`[webhook] Received event: ${event.type} (${event.id})`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const quoteId = session.metadata?.quoteId;

      if (!quoteId) {
        console.warn('[webhook] checkout.session.completed without quoteId metadata');
        break;
      }

      const quote = getQuote(quoteId);
      if (!quote) {
        console.warn(`[webhook] Quote ${quoteId} not found`);
        break;
      }

      // Mark as accepted, then ordered (payment received = order confirmed)
      updateQuote(quoteId, {
        status: 'accepted',
        notes: `${quote.notes ? quote.notes + '\n' : ''}Stripe payment received: ${session.payment_intent} (${session.amount_total ? '$' + (session.amount_total / 100).toFixed(2) : 'N/A'})`,
      });
      updateQuote(quoteId, { status: 'ordered' });

      console.log(`[webhook] Quote ${quoteId} → ordered (payment: ${session.payment_intent})`);
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const quoteId = session.metadata?.quoteId;
      if (quoteId) {
        console.log(`[webhook] Checkout expired for quote ${quoteId}`);
      }
      break;
    }

    default:
      console.log(`[webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

