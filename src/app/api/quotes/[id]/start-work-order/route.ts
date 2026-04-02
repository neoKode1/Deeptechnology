import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import { getQuote, updateQuote, addMessage } from '@/lib/quotes/store';

/**
 * POST /api/quotes/[id]/start-work-order
 *
 * Admin action: advance a paid quote from "ordered" to "procurement".
 * 1. Updates quote status + timestamps in Redis
 * 2. Creates a structured work order task in Redis (workorder:{id})
 * 3. Sends admin a detailed work order email with line items
 * 4. Logs a system message in the quote thread
 *
 * The work order task in Redis serves as the automation dispatch:
 * Claude Code or any agent can poll `workorder:*` keys to pick up new work.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const secret = cookieStore.get('admin_secret')?.value;
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const quote = await getQuote(id);
  if (!quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  if (quote.status !== 'ordered') {
    return NextResponse.json(
      { error: `Cannot start work order — quote is "${quote.status}" (must be "ordered")` },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  // 1. Advance quote to procurement
  await updateQuote(id, {
    status: 'procurement',
    notes: `${quote.notes ? quote.notes + '\n' : ''}Work order started at ${now}`,
  });

  const updated = await getQuote(id);
  if (updated) {
    updated.workOrderStartedAt = now;
    await redis.set(`quote:${id}`, JSON.stringify(updated));
  }

  // 2. Create structured work order task in Redis
  const workOrder = {
    id: `wo-${id}`,
    quoteId: id,
    status: 'pending',
    customer: { name: quote.customerName, email: quote.customerEmail },
    inquiryType: quote.inquiryType,
    summary: quote.summary,
    routing: quote.routing || { destination: 'manual' },
    lineItems: quote.lineItems.map(li => ({
      description: li.description,
      vendor: li.vendor,
      vendorUrl: li.vendorUrl,
      vendorCost: li.vendorCost,
      clientPrice: li.clientPrice,
      notes: li.notes,
    })),
    total: quote.total,
    stripePaymentIntent: quote.stripePaymentIntent,
    createdAt: now,
    updatedAt: now,
  };

  await redis.set(`workorder:${id}`, JSON.stringify(workOrder));
  await redis.zadd('workorders:index', { score: Date.now(), member: id });
  console.log(`[work-order] Created work order task workorder:${id}`);

  // 3. Log system message
  await addMessage(id, {
    from: 'system',
    to: quote.customerEmail,
    subject: 'Work Order Started',
    body: `Work order initiated for quote ${id}. Procurement phase has begun. Routing: ${quote.routing?.destination || 'manual'}.`,
  });

  // 4. Send admin work order email with full details
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_EMAIL || '1deeptechnology@gmail.com';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deeptech.varyai.link';
    const itemsHtml = quote.lineItems.map(li =>
      `<tr><td style="padding:8px;border-bottom:1px solid #222;color:#ccc;">${li.description}</td>` +
      `<td style="padding:8px;border-bottom:1px solid #222;color:#aaa;">${li.vendor}</td>` +
      `<td style="padding:8px;border-bottom:1px solid #222;color:#eee;text-align:right;font-family:monospace;">$${li.clientPrice.toFixed(2)}</td></tr>`
    ).join('');

    await resend.emails.send({
      from: 'Deep Tech <info@varyai.link>',
      to: adminEmail,
      subject: `🔧 Work Order Started — ${quote.customerName} ($${quote.total.toFixed(2)})`,
      html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#ccc;border-radius:8px;border:1px solid #222;">
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#a855f7;margin:0 0 16px;">Work Order — Procurement Started</p>
        <h2 style="color:#fff;margin:0 0 4px;font-size:20px;">${quote.customerName}</h2>
        <p style="font-size:13px;color:#888;margin:0 0 20px;">${quote.summary}</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
          <thead><tr><th style="text-align:left;padding:8px;border-bottom:1px solid #333;color:#666;">Item</th><th style="text-align:left;padding:8px;border-bottom:1px solid #333;color:#666;">Vendor</th><th style="text-align:right;padding:8px;border-bottom:1px solid #333;color:#666;">Price</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot><tr><td colspan="2" style="padding:10px 8px;font-weight:bold;color:#fff;">Total</td><td style="padding:10px 8px;font-weight:bold;color:#fff;text-align:right;font-family:monospace;font-size:16px;">$${quote.total.toFixed(2)}</td></tr></tfoot>
        </table>
        <table style="width:100%;font-size:12px;color:#888;"><tr><td>Routing</td><td style="color:#a855f7;">${quote.routing?.destination || 'manual'}</td></tr><tr><td>Stripe PI</td><td style="font-family:monospace;font-size:11px;">${quote.stripePaymentIntent || 'N/A'}</td></tr><tr><td>Quote ID</td><td>${id}</td></tr></table>
        <div style="margin-top:24px;"><a href="${baseUrl}/admin/quotes" style="display:inline-block;background:#a855f7;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">Manage Work Orders →</a></div>
      </div>`,
    });
    console.log(`[work-order] Admin email sent for ${id}`);
  } catch (emailErr) {
    console.error('[work-order] Failed to send admin email:', emailErr);
  }

  return NextResponse.json({
    success: true,
    quoteId: id,
    status: 'procurement',
    workOrderId: `wo-${id}`,
    workOrderStartedAt: now,
    message: 'Work order started — procurement phase initiated, automation task created',
  });
}

