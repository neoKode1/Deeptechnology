import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { getQuote, updateQuote, addMessage } from '@/lib/quotes/store';

/**
 * In-memory set of processed Stripe event IDs to prevent double-processing.
 * This survives within a single serverless instance's lifetime.
 * Combined with the status check below, this provides sufficient idempotency.
 */
const processedEvents = new Set<string>();

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
      // Idempotency: skip if we've already processed this event
      if (processedEvents.has(event.id)) {
        console.log(`[webhook] Skipping duplicate event ${event.id}`);
        break;
      }

      const session = event.data.object as Stripe.Checkout.Session;
      const quoteId = session.metadata?.quoteId;

      if (!quoteId) {
        console.warn('[webhook] checkout.session.completed without quoteId metadata');
        break;
      }

      const quote = await getQuote(quoteId);
      if (!quote) {
        console.warn(`[webhook] Quote ${quoteId} not found`);
        break;
      }

      // Status-based idempotency: if already ordered or beyond, skip
      if (['ordered', 'procurement', 'shipped', 'in_transit', 'delivered', 'deployed'].includes(quote.status)) {
        console.log(`[webhook] Quote ${quoteId} already in status "${quote.status}" — skipping`);
        processedEvents.add(event.id);
        break;
      }

      // Mark as accepted, then ordered (payment received = order confirmed)
      const paymentAmount = session.amount_total ? '$' + (session.amount_total / 100).toFixed(2) : 'N/A';
      await updateQuote(quoteId, {
        status: 'accepted',
        notes: `${quote.notes ? quote.notes + '\n' : ''}Stripe payment received: ${session.payment_intent} (${paymentAmount})`,
      });
      await updateQuote(quoteId, { status: 'ordered' });

      // Store payment metadata directly on the quote
      try {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });
        const updated = await getQuote(quoteId);
        if (updated) {
          updated.paidAt = new Date().toISOString();
          updated.stripePaymentIntent = session.payment_intent as string;
          await redis.set(`quote:${quoteId}`, JSON.stringify(updated));
        }
      } catch (e) {
        console.error('[webhook] Failed to store payment metadata:', e);
      }

      // Log system message
      await addMessage(quoteId, {
        from: 'system',
        to: quote.customerEmail,
        subject: 'Payment Received',
        body: `Payment of ${paymentAmount} received via Stripe (${session.payment_intent}). Quote is now a confirmed order.`,
      });

      // Send admin notification email
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmail = process.env.ADMIN_EMAIL || '1deeptechnology@gmail.com';
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deeptech.varyai.link';

        await resend.emails.send({
          from: 'Deep Tech <info@varyai.link>',
          to: adminEmail,
          subject: `💰 Payment Received — ${quote.customerName} (${paymentAmount})`,
          html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#ccc;border-radius:8px;border:1px solid #222;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#666;margin:0 0 16px;">Work Order Notification</p>
            <h2 style="color:#22c55e;margin:0 0 8px;font-size:20px;">✅ Payment Confirmed</h2>
            <p style="font-size:14px;color:#eee;margin:0 0 20px;">${quote.customerName} has paid <strong>${paymentAmount}</strong> for their quote.</p>
            <table style="width:100%;font-size:13px;color:#aaa;">
              <tr><td style="padding:6px 0;color:#666;">Quote ID</td><td style="padding:6px 0;color:#eee;">${quoteId}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Customer</td><td style="padding:6px 0;color:#eee;">${quote.customerName} (${quote.customerEmail})</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Type</td><td style="padding:6px 0;color:#eee;">${quote.inquiryType}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Summary</td><td style="padding:6px 0;color:#eee;">${quote.summary}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Stripe PI</td><td style="padding:6px 0;color:#eee;font-family:monospace;font-size:11px;">${session.payment_intent}</td></tr>
            </table>
            <div style="margin-top:24px;">
              <a href="${baseUrl}/admin/quotes" style="display:inline-block;background:#22c55e;color:#000;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">
                View Work Orders →
              </a>
            </div>
            <p style="font-size:12px;color:#555;margin-top:20px;">This work order is ready to start. Visit the admin dashboard to reply to the customer or start the work order.</p>
          </div>`,
          text: `Payment Received!\n\n${quote.customerName} paid ${paymentAmount} for quote ${quoteId}.\nType: ${quote.inquiryType}\nSummary: ${quote.summary}\nStripe PI: ${session.payment_intent}\n\nVisit ${baseUrl}/admin/quotes to manage work orders.`,
        });
        console.log(`[webhook] Admin notification sent for quote ${quoteId}`);
      } catch (emailErr) {
        console.error('[webhook] Failed to send admin notification:', emailErr);
      }

      processedEvents.add(event.id);
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

