import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import Stripe from 'stripe';
import { getQuote, addMessage } from '@/lib/quotes/store';
import { isAuthorizedRequest } from '@/lib/admin-auth';
import type { CancellationRecord } from '@/lib/quotes/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POST /api/quotes/[id]/cancel
 *
 * Cancel a work order. Supports both admin and customer-initiated cancellations.
 * Deep Tech retains the service fee (markup) and refunds the vendor cost portion
 * to the customer via Stripe.
 *
 * Admin: authenticated via admin_secret cookie
 * Customer: authenticated by knowing the quote ID + providing matching email
 *
 * Body: { reason: string, email?: string }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { reason, email } = body;

  // Determine if this is admin (session cookie or Bearer header) or customer (email match)
  const isAdmin = await isAuthorizedRequest(request);

  const quote = await getQuote(id);
  if (!quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  // Customer auth: must provide matching email
  if (!isAdmin) {
    if (!email || email.toLowerCase() !== quote.customerEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Can only cancel paid orders that aren't already cancelled/deployed
  const cancellable = ['ordered', 'procurement', 'shipped', 'in_transit', 'delivered'];
  if (!cancellable.includes(quote.status)) {
    return NextResponse.json(
      { error: `Cannot cancel — quote is "${quote.status}"` },
      { status: 400 }
    );
  }

  // Customer cancellation window: 72 hours from payment (admin can cancel anytime)
  const CANCEL_WINDOW_MS = 72 * 60 * 60 * 1000; // 72 hours
  if (!isAdmin && quote.paidAt) {
    const elapsed = Date.now() - new Date(quote.paidAt).getTime();
    if (elapsed > CANCEL_WINDOW_MS) {
      return NextResponse.json(
        { error: 'The 72-hour cancellation window has passed. Please contact us directly to discuss your options.' },
        { status: 400 }
      );
    }
  }

  if (!reason) {
    return NextResponse.json({ error: 'Cancellation reason is required' }, { status: 400 });
  }

  // Calculate refund breakdown
  const vendorCostTotal = Math.round(
    quote.lineItems.reduce((sum, li) => sum + li.vendorCost, 0) * 100
  ) / 100;
  const serviceFee = Math.round((quote.total - vendorCostTotal) * 100) / 100;
  // Use Stripe's snapshotted amount_total as the refund ceiling to prevent over-refunding
  // if line items were edited post-payment. Falls back to recalculated vendorCost if unavailable.
  const rawRefundCents = Math.round(vendorCostTotal * 100);
  const maxRefundCents = quote.stripeAmountTotal ?? null;
  const refundAmountCents = maxRefundCents
    ? Math.min(rawRefundCents, maxRefundCents)
    : rawRefundCents;

  const now = new Date().toISOString();
  const cancellation: CancellationRecord = {
    reason,
    serviceFeeRetained: serviceFee,
    vendorCostRefunded: vendorCostTotal,
    refundTotal: vendorCostTotal,
    cancelledBy: isAdmin ? 'admin' : 'customer',
  };

  // Issue Stripe refund if we have a payment intent
  if (quote.stripePaymentIntent && refundAmountCents > 0) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: quote.stripePaymentIntent,
        amount: refundAmountCents,
        reason: 'requested_by_customer',
      });
      cancellation.stripeRefundId = refund.id;
      console.log(`[cancel] Stripe refund ${refund.id} — $${vendorCostTotal} for quote ${id}`);
    } catch (stripeErr) {
      console.error('[cancel] Stripe refund failed:', stripeErr);
      return NextResponse.json(
        { error: 'Stripe refund failed. Contact Stripe support or refund manually.' },
        { status: 500 }
      );
    }
  }

  // Update quote in Redis
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  quote.status = 'cancelled';
  quote.cancelledAt = now;
  quote.cancellation = cancellation;
  quote.updatedAt = now;
  await redis.set(`quote:${id}`, JSON.stringify(quote));

  // Remove from work orders index if exists
  await redis.del(`workorder:${id}`);
  await redis.zrem('workorders:index', id);

  // Log system message
  await addMessage(id, {
    from: 'system',
    to: quote.customerEmail,
    subject: 'Work Order Cancelled',
    body: `Order cancelled. Reason: ${reason}. Vendor costs ($${vendorCostTotal.toFixed(2)}) refunded. Service fee ($${serviceFee.toFixed(2)}) retained.`,
  });

  // Send customer cancellation email + admin notification
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_EMAIL || 'info@deeptechnologies.dev';

    // Customer email
    await resend.emails.send({
      from: 'Deep Tech <info@deeptechnologies.dev>',
      to: quote.customerEmail,
      replyTo: adminEmail,
      subject: `Order Cancelled — ${quote.summary}`,
      html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#ccc;border-radius:8px;border:1px solid #222;">
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#ef4444;margin:0 0 16px;">Order Cancelled</p>
        <h2 style="color:#fff;margin:0 0 4px;font-size:20px;">Hi ${quote.customerName},</h2>
        <p style="font-size:14px;color:#aaa;line-height:1.7;margin:16px 0;">Your order for <strong style="color:#fff;">${quote.summary}</strong> has been cancelled.</p>
        <div style="background:#111;border:1px solid #333;border-radius:6px;padding:16px;margin:20px 0;">
          <p style="font-size:13px;color:#aaa;margin:0 0 8px;"><strong style="color:#ccc;">Reason:</strong> ${reason}</p>
          <hr style="border:none;border-top:1px solid #333;margin:12px 0;" />
          <table style="width:100%;font-size:13px;"><tr><td style="color:#888;padding:4px 0;">Vendor costs refunded</td><td style="color:#22c55e;text-align:right;font-family:monospace;">$${vendorCostTotal.toFixed(2)}</td></tr><tr><td style="color:#888;padding:4px 0;">Service fee (non-refundable)</td><td style="color:#f59e0b;text-align:right;font-family:monospace;">$${serviceFee.toFixed(2)}</td></tr></table>
        </div>
        <p style="font-size:13px;color:#888;line-height:1.7;">The refund of <strong style="color:#22c55e;">$${vendorCostTotal.toFixed(2)}</strong> will appear on your statement within 5–10 business days. The service fee of <strong style="color:#f59e0b;">$${serviceFee.toFixed(2)}</strong> is non-refundable.</p>
        <p style="font-size:13px;color:#888;margin-top:16px;">Questions? Reply to this email and we'll help.</p>
      </div>`,
    });

    // Admin notification (especially important for customer-initiated cancellations)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deeptechnologies.dev';
    await resend.emails.send({
      from: 'Deep Tech <info@deeptechnologies.dev>',
      to: adminEmail,
      subject: `🚫 Order Cancelled ${!isAdmin ? '(Customer-Initiated)' : ''} — ${quote.customerName}`,
      html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#ccc;border-radius:8px;border:1px solid #222;">
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#ef4444;margin:0 0 16px;">Cancellation Alert</p>
        <h2 style="color:#fff;margin:0 0 8px;font-size:20px;">Order Cancelled${!isAdmin ? ' by Customer' : ' by Admin'}</h2>
        <table style="width:100%;font-size:13px;color:#aaa;margin:16px 0;">
          <tr><td style="padding:6px 0;color:#666;">Customer</td><td style="padding:6px 0;color:#eee;">${quote.customerName} (${quote.customerEmail})</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Quote</td><td style="padding:6px 0;color:#eee;">${quote.summary}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Reason</td><td style="padding:6px 0;color:#eee;">${reason}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Refunded</td><td style="padding:6px 0;color:#22c55e;">$${vendorCostTotal.toFixed(2)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Fee Retained</td><td style="padding:6px 0;color:#f59e0b;">$${serviceFee.toFixed(2)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Stripe Refund</td><td style="padding:6px 0;color:#eee;font-family:monospace;font-size:11px;">${cancellation.stripeRefundId || 'N/A'}</td></tr>
        </table>
        <a href="${baseUrl}/admin/quotes" style="display:inline-block;background:#ef4444;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">View Dashboard →</a>
      </div>`,
    });
  } catch (emailErr) {
    console.error('[cancel] Failed to send cancellation email:', emailErr);
  }

  console.log(`[cancel] Quote ${id} cancelled — refund $${vendorCostTotal.toFixed(2)}, kept $${serviceFee.toFixed(2)}`);

  return NextResponse.json({
    success: true,
    quoteId: id,
    status: 'cancelled',
    cancellation,
  });
}

