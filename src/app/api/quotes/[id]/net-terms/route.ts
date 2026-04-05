import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getQuote, addMessage } from '@/lib/quotes/store';
import { Redis } from '@upstash/redis';

/**
 * POST /api/quotes/[id]/net-terms
 *
 * Customer submits a Net Terms (Net-30/60) request alongside a quote.
 * - Marks the quote as pending_net_terms
 * - Logs a system message on the quote thread
 * - Emails admin with PO/company details
 *
 * Body: { email: string; companyName: string; poNumber?: string; terms: 'net30' | 'net60'; notes?: string }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { email, companyName, poNumber, terms, notes } = body as {
    email: string;
    companyName: string;
    poNumber?: string;
    terms: 'net30' | 'net60';
    notes?: string;
  };

  if (!email || !companyName || !terms) {
    return NextResponse.json({ error: 'email, companyName, and terms are required' }, { status: 400 });
  }

  const quote = await getQuote(id);
  if (!quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  if (email.toLowerCase() !== quote.customerEmail.toLowerCase()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cancellable = ['sent', 'accepted'];
  if (!cancellable.includes(quote.status)) {
    return NextResponse.json(
      { error: `Cannot request net terms — quote is "${quote.status}"` },
      { status: 400 }
    );
  }

  const termsLabel = terms === 'net30' ? 'Net-30' : 'Net-60';

  // Update quote status
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  const now = new Date().toISOString();
  const updated = { ...quote, status: 'pending_net_terms' as const, updatedAt: now };
  await redis.set(`quote:${id}`, JSON.stringify(updated));

  // Log system message
  await addMessage(id, {
    from: 'system',
    to: quote.customerEmail,
    subject: `${termsLabel} Payment Terms Requested`,
    body: `${termsLabel} payment terms requested by ${companyName}${poNumber ? ` (PO: ${poNumber})` : ''}. Our team will review and respond within 1 business day.`,
  });

  // Email admin
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_EMAIL || 'info@deeptechnologies.dev';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deeptechnologies.dev';

    await resend.emails.send({
      from: 'Deep Tech <info@deeptechnologies.dev>',
      to: adminEmail,
      subject: `📄 ${termsLabel} Request — ${companyName} · ${quote.summary}`,
      html: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#ccc;border-radius:8px;border:1px solid #222;">
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#f59e0b;margin:0 0 16px;">Net Terms Request</p>
        <h2 style="color:#fff;margin:0 0 8px;font-size:20px;">📄 ${termsLabel} Payment Terms</h2>
        <p style="font-size:14px;color:#eee;margin:0 0 20px;"><strong>${companyName}</strong> has requested ${termsLabel} payment terms on quote <strong>${id}</strong>.</p>
        <table style="width:100%;font-size:13px;color:#aaa;margin:16px 0;">
          <tr><td style="padding:6px 0;color:#666;">Company</td><td style="padding:6px 0;color:#eee;">${companyName}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Contact</td><td style="padding:6px 0;color:#eee;">${quote.customerName} (${email})</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Quote</td><td style="padding:6px 0;color:#eee;">${quote.summary}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Amount</td><td style="padding:6px 0;color:#22c55e;font-family:monospace;">$${quote.total.toFixed(2)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Terms Requested</td><td style="padding:6px 0;color:#f59e0b;font-weight:bold;">${termsLabel}</td></tr>
          ${poNumber ? `<tr><td style="padding:6px 0;color:#666;">PO Number</td><td style="padding:6px 0;color:#eee;font-family:monospace;">${poNumber}</td></tr>` : ''}
          ${notes ? `<tr><td style="padding:6px 0;color:#666;">Notes</td><td style="padding:6px 0;color:#eee;">${notes}</td></tr>` : ''}
        </table>
        <a href="${baseUrl}/admin/quotes" style="display:inline-block;background:#f59e0b;color:#000;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;margin-top:8px;">Review in Admin →</a>
      </div>`,
      text: `${termsLabel} Request\n\nCompany: ${companyName}\nContact: ${quote.customerName} (${email})\nQuote: ${id} — ${quote.summary}\nAmount: $${quote.total.toFixed(2)}\nTerms: ${termsLabel}${poNumber ? `\nPO: ${poNumber}` : ''}${notes ? `\nNotes: ${notes}` : ''}\n\nReview at ${baseUrl}/admin/quotes`,
    });
  } catch (emailErr) {
    console.error('[net-terms] Failed to send admin notification:', emailErr);
  }

  console.log(`[net-terms] Quote ${id} → pending_net_terms (${termsLabel}, ${companyName})`);

  return NextResponse.json({ success: true, status: 'pending_net_terms' });
}

