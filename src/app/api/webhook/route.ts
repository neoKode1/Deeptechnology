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

      // Detect whether this was a subscription or one-time checkout
      const isSubscription = session.mode === 'subscription';
      // session.subscription is a string ID when not expanded
      const subId = typeof session.subscription === 'string'
        ? session.subscription
        : (session.subscription as Stripe.Subscription | null)?.id ?? null;

      const paymentAmount = session.amount_total
        ? '$' + (session.amount_total / 100).toFixed(2)
        : isSubscription ? `$${quote.monthlyTotal ?? '?'}/mo` : 'N/A';

      const paymentRef = isSubscription ? subId : (session.payment_intent as string | null);
      const noteLabel = isSubscription ? 'Stripe subscription activated' : 'Stripe payment received';

      // Mark as accepted, then ordered (payment / subscription confirmed)
      await updateQuote(quoteId, {
        status: 'accepted',
        notes: `${quote.notes ? quote.notes + '\n' : ''}${noteLabel}: ${paymentRef} (${paymentAmount})`,
      });
      await updateQuote(quoteId, { status: 'ordered' });

      // Store payment/subscription metadata directly on the quote record
      try {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });
        const updated = await getQuote(quoteId);
        if (updated) {
          updated.paidAt = new Date().toISOString();
          // Snapshot the Stripe-confirmed charge total as the safe refund ceiling
          if (session.amount_total != null) {
            updated.stripeAmountTotal = session.amount_total;
          }
          if (isSubscription && subId) {
            updated.stripeSubscriptionId = subId;
          } else {
            updated.stripePaymentIntent = session.payment_intent as string;
          }
          await redis.set(`quote:${quoteId}`, JSON.stringify(updated));
        }
      } catch (e) {
        console.error('[webhook] Failed to store payment metadata:', e);
      }

      // Log system message on the quote thread
      await addMessage(quoteId, {
        from: 'system',
        to: quote.customerEmail,
        subject: isSubscription ? 'Subscription Activated' : 'Payment Received',
        body: isSubscription
          ? `RaaS subscription activated (${subId}) at ${paymentAmount}. Quote is now a confirmed order. Billing renews monthly.`
          : `Payment of ${paymentAmount} received via Stripe (${session.payment_intent}). Quote is now a confirmed order.`,
      });

      // Send admin notification email
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmail = process.env.ADMIN_EMAIL || 'info@deeptechnologies.dev';
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deeptechnologies.dev';
        const emailSubject = isSubscription
          ? `🔄 RaaS Subscription Started — ${quote.customerName} (${paymentAmount})`
          : `💰 Payment Received — ${quote.customerName} (${paymentAmount})`;
        const stripeRefRow = isSubscription
          ? `<tr><td style="padding:6px 0;color:#666;">Subscription ID</td><td style="padding:6px 0;color:#22d3ee;font-family:monospace;font-size:11px;">${subId}</td></tr>`
          : `<tr><td style="padding:6px 0;color:#666;">Stripe PI</td><td style="padding:6px 0;color:#eee;font-family:monospace;font-size:11px;">${session.payment_intent}</td></tr>`;
        const billingNote = isSubscription
          ? '<p style="font-size:12px;color:#22d3ee;margin:12px 0 0;">⟳ Recurring — billed monthly. Subscription can be managed in the Stripe Dashboard.</p>'
          : '';

        await resend.emails.send({
          from: 'Deep Tech <info@deeptechnologies.dev>',
          to: adminEmail,
          subject: emailSubject,
          html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#ccc;border-radius:8px;border:1px solid #222;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#666;margin:0 0 16px;">${isSubscription ? 'RaaS Subscription' : 'Work Order Notification'}</p>
            <h2 style="color:#22c55e;margin:0 0 8px;font-size:20px;">${isSubscription ? '🔄 Subscription Activated' : '✅ Payment Confirmed'}</h2>
            <p style="font-size:14px;color:#eee;margin:0 0 20px;">${quote.customerName} has ${isSubscription ? 'started a monthly RaaS subscription for' : 'paid'} <strong>${paymentAmount}</strong>.</p>
            <table style="width:100%;font-size:13px;color:#aaa;">
              <tr><td style="padding:6px 0;color:#666;">Quote ID</td><td style="padding:6px 0;color:#eee;">${quoteId}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Customer</td><td style="padding:6px 0;color:#eee;">${quote.customerName} (${quote.customerEmail})</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Type</td><td style="padding:6px 0;color:#eee;">${quote.inquiryType}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Summary</td><td style="padding:6px 0;color:#eee;">${quote.summary}</td></tr>
              ${stripeRefRow}
            </table>
            ${billingNote}
            <div style="margin-top:24px;">
              <a href="${baseUrl}/admin/quotes" style="display:inline-block;background:#22c55e;color:#000;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">
                View Work Orders →
              </a>
            </div>
            <p style="font-size:12px;color:#555;margin-top:20px;">This work order is ready to start. Visit the admin dashboard to manage it.</p>
          </div>`,
          text: `${isSubscription ? 'RaaS Subscription Started' : 'Payment Received'}!\n\n${quote.customerName} — ${paymentAmount}\nQuote: ${quoteId}\nType: ${quote.inquiryType}\nSummary: ${quote.summary}\n${isSubscription ? `Subscription: ${subId}` : `Stripe PI: ${session.payment_intent}`}\n\nVisit ${baseUrl}/admin/quotes to manage work orders.`,
        });
        console.log(`[webhook] Admin notification sent for quote ${quoteId}`);
      } catch (emailErr) {
        console.error('[webhook] Failed to send admin notification:', emailErr);
      }

      processedEvents.add(event.id);
      console.log(`[webhook] Quote ${quoteId} → ordered (${isSubscription ? `subscription: ${subId}` : `payment: ${session.payment_intent}`})`);
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

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const pi = charge.payment_intent as string;
      console.log(`[webhook] Refund processed for charge ${charge.id} (PI: ${pi}) — $${((charge.amount_refunded || 0) / 100).toFixed(2)} refunded`);

      // Send admin notification for any refund we didn't initiate through our cancel flow
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmail = process.env.ADMIN_EMAIL || 'info@deeptechnologies.dev';
        await resend.emails.send({
          from: 'Deep Tech <info@deeptechnologies.dev>',
          to: adminEmail,
          subject: `💸 Refund Processed — ${charge.id}`,
          html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#ccc;border-radius:8px;border:1px solid #222;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#f59e0b;margin:0 0 16px;">Refund Notification</p>
            <h2 style="color:#fff;margin:0 0 8px;font-size:20px;">Refund Processed</h2>
            <table style="width:100%;font-size:13px;color:#aaa;margin:16px 0;">
              <tr><td style="padding:6px 0;color:#666;">Charge</td><td style="padding:6px 0;color:#eee;font-family:monospace;">${charge.id}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Payment Intent</td><td style="padding:6px 0;color:#eee;font-family:monospace;">${pi}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Amount Refunded</td><td style="padding:6px 0;color:#22c55e;">$${((charge.amount_refunded || 0) / 100).toFixed(2)}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Customer</td><td style="padding:6px 0;color:#eee;">${charge.billing_details?.name || 'N/A'} (${charge.billing_details?.email || 'N/A'})</td></tr>
            </table>
          </div>`,
        });
      } catch (e) {
        console.error('[webhook] Failed to send refund notification:', e);
      }
      break;
    }

    case 'charge.dispute.created': {
      const dispute = event.data.object as Stripe.Dispute;
      console.error(`[webhook] ⚠️ DISPUTE CREATED: ${dispute.id} — $${(dispute.amount / 100).toFixed(2)} — reason: ${dispute.reason}`);

      // Critical: notify admin immediately
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmail = process.env.ADMIN_EMAIL || 'info@deeptechnologies.dev';
        await resend.emails.send({
          from: 'Deep Tech <info@deeptechnologies.dev>',
          to: adminEmail,
          subject: `🚨 DISPUTE FILED — $${(dispute.amount / 100).toFixed(2)} — Action Required`,
          html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#ccc;border-radius:8px;border:1px solid #ef4444;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#ef4444;margin:0 0 16px;">⚠️ Urgent — Dispute Filed</p>
            <h2 style="color:#ef4444;margin:0 0 8px;font-size:20px;">Payment Dispute Received</h2>
            <p style="font-size:14px;color:#eee;margin:0 0 20px;">A customer has filed a dispute. You must respond within the deadline or the funds will be lost.</p>
            <table style="width:100%;font-size:13px;color:#aaa;margin:16px 0;">
              <tr><td style="padding:6px 0;color:#666;">Dispute ID</td><td style="padding:6px 0;color:#eee;font-family:monospace;">${dispute.id}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Amount</td><td style="padding:6px 0;color:#ef4444;font-weight:bold;">$${(dispute.amount / 100).toFixed(2)}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Reason</td><td style="padding:6px 0;color:#eee;">${dispute.reason}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Charge</td><td style="padding:6px 0;color:#eee;font-family:monospace;">${dispute.charge}</td></tr>
            </table>
            <a href="https://dashboard.stripe.com/disputes/${dispute.id}" style="display:inline-block;background:#ef4444;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;margin-top:8px;">Respond in Stripe →</a>
          </div>`,
        });
      } catch (e) {
        console.error('[webhook] Failed to send dispute notification:', e);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      // Fires when a RaaS subscription is cancelled (by customer, admin, or non-payment).
      const subscription = event.data.object as Stripe.Subscription;
      const quoteId = subscription.metadata?.quoteId;

      if (!quoteId) {
        console.warn('[webhook] customer.subscription.deleted without quoteId metadata — skipping');
        break;
      }

      const quote = await getQuote(quoteId);
      if (!quote) {
        console.warn(`[webhook] customer.subscription.deleted: quote ${quoteId} not found`);
        break;
      }

      // Only act if the quote isn't already in a terminal state
      if (['cancelled', 'rejected'].includes(quote.status)) {
        console.log(`[webhook] Quote ${quoteId} already "${quote.status}" — skipping subscription.deleted`);
        break;
      }

      // Mark the quote as cancelled
      await updateQuote(quoteId, {
        status: 'cancelled',
        notes: `${quote.notes ? quote.notes + '\n' : ''}RaaS subscription cancelled by Stripe event (sub: ${subscription.id}). Reason: ${subscription.cancellation_details?.reason ?? 'not specified'}.`,
      });

      await addMessage(quoteId, {
        from: 'system',
        to: quote.customerEmail,
        subject: 'RaaS Subscription Cancelled',
        body: `Your Robot-as-a-Service subscription (${subscription.id}) has been cancelled. If this was unexpected, please contact us at info@deeptechnologies.dev. Any hardware retrieval logistics will be coordinated separately.`,
      });

      // Alert admin
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmail = process.env.ADMIN_EMAIL || 'info@deeptechnologies.dev';
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deeptechnologies.dev';
        const cancellationReason = subscription.cancellation_details?.reason ?? 'not specified';

        await resend.emails.send({
          from: 'Deep Tech <info@deeptechnologies.dev>',
          to: adminEmail,
          subject: `⚠️ RaaS Subscription Cancelled — ${quote.customerName}`,
          html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#ccc;border-radius:8px;border:1px solid #f59e0b;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#f59e0b;margin:0 0 16px;">RaaS Cancellation</p>
            <h2 style="color:#f59e0b;margin:0 0 8px;font-size:20px;">⚠️ Subscription Cancelled</h2>
            <p style="font-size:14px;color:#eee;margin:0 0 20px;">A RaaS subscription for <strong>${quote.customerName}</strong> has been cancelled. Hardware retrieval may be required.</p>
            <table style="width:100%;font-size:13px;color:#aaa;">
              <tr><td style="padding:6px 0;color:#666;">Quote ID</td><td style="padding:6px 0;color:#eee;">${quoteId}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Customer</td><td style="padding:6px 0;color:#eee;">${quote.customerName} (${quote.customerEmail})</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Summary</td><td style="padding:6px 0;color:#eee;">${quote.summary}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Subscription ID</td><td style="padding:6px 0;color:#eee;font-family:monospace;font-size:11px;">${subscription.id}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Cancellation Reason</td><td style="padding:6px 0;color:#f59e0b;">${cancellationReason}</td></tr>
            </table>
            <div style="margin-top:24px;">
              <a href="${baseUrl}/admin/quotes" style="display:inline-block;background:#f59e0b;color:#000;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">
                Review in Admin →
              </a>
            </div>
          </div>`,
          text: `RaaS Subscription Cancelled\n\nCustomer: ${quote.customerName} (${quote.customerEmail})\nQuote: ${quoteId}\nSubscription: ${subscription.id}\nReason: ${cancellationReason}\n\nReview at ${baseUrl}/admin/quotes`,
        });
      } catch (emailErr) {
        console.error('[webhook] Failed to send subscription cancellation notification:', emailErr);
      }

      console.log(`[webhook] Quote ${quoteId} → cancelled (subscription deleted: ${subscription.id})`);
      break;
    }

    case 'invoice.payment_succeeded': {
      // Fires every billing cycle for RaaS subscriptions — log a paper-trail message on the quote.
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null };
      const invoiceSubId = typeof invoice.subscription === 'string'
        ? invoice.subscription
        : (invoice.subscription as Stripe.Subscription | null)?.id ?? null;

      if (!invoiceSubId) {
        console.log('[webhook] invoice.payment_succeeded — no subscription, skipping');
        break;
      }

      // Avoid logging the activation invoice (already handled by checkout.session.completed)
      if (invoice.billing_reason === 'subscription_create') {
        console.log('[webhook] invoice.payment_succeeded — subscription_create billing_reason, skipping (handled by checkout.session.completed)');
        break;
      }

      try {
        // Retrieve the subscription to pull the quoteId from metadata
        const sub = await stripe.subscriptions.retrieve(invoiceSubId);
        const quoteId = sub.metadata?.quoteId;

        if (!quoteId) {
          console.warn('[webhook] invoice.payment_succeeded — subscription has no quoteId metadata');
          break;
        }

        const quote = await getQuote(quoteId);
        if (!quote) {
          console.warn(`[webhook] invoice.payment_succeeded — quote ${quoteId} not found`);
          break;
        }

        const amountPaid = invoice.amount_paid
          ? '$' + (invoice.amount_paid / 100).toFixed(2)
          : '?';
        const periodEnd = invoice.period_end
          ? new Date(invoice.period_end * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          : null;

        await addMessage(quoteId, {
          from: 'system',
          to: quote.customerEmail,
          subject: 'RaaS Monthly Billing — Payment Received',
          body: `Monthly RaaS subscription payment of ${amountPaid} received (sub: ${invoiceSubId})${periodEnd ? '. Next billing period ends ' + periodEnd : ''}. Your service remains active.`,
        });

        console.log(`[webhook] RaaS invoice.payment_succeeded — quote ${quoteId}, ${amountPaid}`);
      } catch (e) {
        console.error('[webhook] invoice.payment_succeeded — failed to log billing event:', e);
      }
      break;
    }

    default:
      console.log(`[webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

