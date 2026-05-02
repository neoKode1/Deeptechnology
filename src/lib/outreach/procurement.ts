/**
 * Auto-procurement: fired by the Stripe webhook when a public_buy session
 * (Buy Now / Reserve / Subscribe from /api/buy) completes. Sends a
 * blind-first-contact procurement email to the vendor's mailto contact and
 * logs it to the vendor_outreach audit table.
 *
 * Pulled out of route.ts so the webhook stays readable and so the same
 * function can be invoked from a future "resend procurement email" admin
 * action without duplicating logic.
 */
import { Resend } from 'resend';
import { VENDORS } from '@/data/vendors';
import { renderTemplate, TEMPLATE_LABELS } from './templates';
import {
  SOURCING_FROM,
  SOURCING_REPLY_TO,
  SOURCING_SIGNATURE_HTML,
  SOURCING_SIGNATURE_TEXT,
} from './identity';
import { recordOutreach, findOutreachBySessionId } from './history';

export interface PublicBuyMetadata {
  vendorId: string;
  vendorName?: string;
  productSlug?: string;
  productName?: string;
  buyKind?: string;       // 'buy_now' | 'reserve' | 'subscribe'
  buyPath?: string;       // 'direct_online' | 'email_required' | ...
  amountCents?: string;
  fullPriceCents?: string;
  isDeposit?: string;     // '1' | '0'
}

export interface ProcurementResult {
  ok: boolean;
  skipped?: 'no_vendor' | 'no_email' | 'resend_unconfigured' | 'duplicate';
  error?: string;
  toEmail?: string;
  resendId?: string;
  /** Set when skipped='duplicate' — id of the existing vendor_outreach row */
  existingOutreachId?: string;
}

function bodyToHtml(plain: string): string {
  const escaped = plain.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const bolded = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#222;line-height:1.6;font-size:14px;white-space:pre-wrap;">${bolded}</div>`;
}

function fmtUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/**
 * Fire the procurement_order template to the vendor's mailto contact and
 * log the outcome. Returns a structured result so the caller can decide
 * whether to alert admin separately.
 *
 * Idempotency is the caller's responsibility (Stripe webhook uses its
 * processedEvents Set + status-based checks).
 */
export async function fireProcurementOrder(args: {
  metadata: PublicBuyMetadata;
  sessionId: string;
  paymentIntentId?: string | null;
  customerEmail?: string | null;
  region?: string;
}): Promise<ProcurementResult> {
  const { metadata, sessionId, paymentIntentId, customerEmail, region } = args;

  const vendor = VENDORS.find(v => v.id === metadata.vendorId);
  if (!vendor) {
    console.warn(`[procurement] Unknown vendorId in metadata: ${metadata.vendorId}`);
    return { ok: false, skipped: 'no_vendor' };
  }

  // Cross-instance idempotency: if a prior procurement_order send for this
  // Stripe session is already on file, skip — the in-memory event Set won't
  // catch retries that land on a fresh serverless instance.
  try {
    const existing = await findOutreachBySessionId(sessionId, 'procurement_order');
    if (existing) {
      console.log(`[procurement] Duplicate session ${sessionId} — existing outreach ${existing.id}, skipping send`);
      return { ok: true, skipped: 'duplicate', toEmail: existing.toEmail, existingOutreachId: existing.id };
    }
  } catch (e) {
    // D1 lookup failure should not block legitimate sends; log + proceed
    console.warn(`[procurement] Idempotency lookup failed for session ${sessionId}:`, e instanceof Error ? e.message : e);
  }

  const mailto = vendor.contacts.find(c => c.href?.startsWith('mailto:'));
  const toEmail = mailto?.value;
  if (!toEmail) {
    console.warn(`[procurement] No mailto contact for ${vendor.name} — cannot auto-fire procurement email.`);
    return { ok: false, skipped: 'no_email' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[procurement] RESEND_API_KEY not configured — skipping send.');
    return { ok: false, skipped: 'resend_unconfigured' };
  }

  const isDeposit = metadata.isDeposit === '1';
  const amountCents = metadata.amountCents ? Number(metadata.amountCents) : null;
  const depositPaid = isDeposit && amountCents ? fmtUsd(amountCents) : undefined;
  const orderRef = paymentIntentId ?? sessionId;

  const rendered = renderTemplate('procurement_order', {
    vendor,
    productName: metadata.productName,
    quantity: 1,
    region,
    orderRef,
    depositPaid,
  });

  const fullText = rendered.body + SOURCING_SIGNATURE_TEXT;
  const fullHtml = bodyToHtml(rendered.body) + SOURCING_SIGNATURE_HTML;
  const id = (globalThis.crypto?.randomUUID?.() ?? `proc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);

  const resend = new Resend(apiKey);
  try {
    const { data, error } = await resend.emails.send({
      from: SOURCING_FROM,
      to: toEmail,
      replyTo: SOURCING_REPLY_TO,
      subject: rendered.subject,
      html: fullHtml,
      text: fullText,
    });
    if (error) throw new Error(error.message ?? 'Resend send failed');

    await recordOutreach({
      id, vendorId: vendor.id, template: 'procurement_order',
      toEmail, subject: rendered.subject, body: fullText, status: 'sent',
      resendId: data?.id,
      metadata: {
        productName: metadata.productName,
        productSlug: metadata.productSlug,
        buyKind: metadata.buyKind,
        buyPath: metadata.buyPath,
        amountCents: metadata.amountCents,
        fullPriceCents: metadata.fullPriceCents,
        isDeposit,
        sessionId,
        paymentIntentId: paymentIntentId ?? undefined,
        customerEmail: customerEmail ?? undefined,
        templateLabel: TEMPLATE_LABELS.procurement_order,
        source: 'webhook_auto',
      },
    });
    console.log(`[procurement] Sent to ${vendor.name} <${toEmail}> for session ${sessionId}`);
    return { ok: true, toEmail, resendId: data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[procurement] Send to ${toEmail} failed:`, msg);
    await recordOutreach({
      id, vendorId: vendor.id, template: 'procurement_order',
      toEmail, subject: rendered.subject, body: fullText, status: 'failed', error: msg,
      metadata: { sessionId, paymentIntentId: paymentIntentId ?? undefined, source: 'webhook_auto' },
    }).catch(() => undefined);
    return { ok: false, error: msg, toEmail };
  }
}
