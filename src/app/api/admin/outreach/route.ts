import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isAuthorizedRequest, unauthorizedResponse } from '@/lib/admin-auth';
import { rateLimit, limiters } from '@/lib/ratelimit';
import { VENDORS } from '@/data/vendors';
import { renderTemplate, type TemplateId, TEMPLATE_LABELS } from '@/lib/outreach/templates';
import {
  SOURCING_FROM,
  SOURCING_REPLY_TO,
  SOURCING_SIGNATURE_HTML,
  SOURCING_SIGNATURE_TEXT,
} from '@/lib/outreach/identity';
import { recordOutreach, listOutreach } from '@/lib/outreach/history';

const ALLOWED_TEMPLATES: TemplateId[] = [
  'spec_request', 'quote_request', 'availability_check', 'demo_request',
];

interface OutreachRequest {
  vendorId: string;
  templateId: TemplateId;
  productName?: string;
  quantity?: number;
  region?: string;
  timeline?: string;
  useCase?: string;
  /** Optional override; otherwise the first vendor mailto: contact wins. */
  toEmail?: string;
}

function bodyToHtml(plain: string): string {
  const escaped = plain
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Light markdown-ish: **bold**
  const bolded = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#222;line-height:1.6;font-size:14px;white-space:pre-wrap;">${bolded}</div>`;
}

function resolveVendorEmail(vendorId: string): { email: string | null; vendor: ReturnType<typeof findVendor> } {
  const vendor = findVendor(vendorId);
  if (!vendor) return { email: null, vendor };
  const mailto = vendor.contacts.find(c => c.href?.startsWith('mailto:'));
  return { email: mailto?.value ?? null, vendor };
}

function findVendor(vendorId: string) {
  return VENDORS.find(v => v.id === vendorId) ?? null;
}

/**
 * GET /api/admin/outreach?vendorId=...
 * Returns recent outreach records (most recent first), optionally filtered.
 */
export async function GET(request: NextRequest) {
  if (!(await isAuthorizedRequest(request))) return unauthorizedResponse();

  const vendorId = request.nextUrl.searchParams.get('vendorId') ?? undefined;
  const limit = Number(request.nextUrl.searchParams.get('limit') ?? '100');

  try {
    const records = await listOutreach({ vendorId, limit });
    return NextResponse.json({ records });
  } catch (err) {
    console.error('[admin/outreach] list failed:', err);
    return NextResponse.json({ error: 'Failed to fetch outreach history.' }, { status: 500 });
  }
}

/**
 * POST /api/admin/outreach
 * Sends a templated blind-first-contact inquiry to a vendor and records the
 * result in the vendor_outreach D1 table.
 */
export async function POST(request: NextRequest) {
  if (!(await isAuthorizedRequest(request))) return unauthorizedResponse();

  const limited = await rateLimit(limiters.outreach, request);
  if (limited) return limited;

  let payload: OutreachRequest;
  try {
    payload = (await request.json()) as OutreachRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { vendorId, templateId } = payload;
  if (!vendorId || !templateId) {
    return NextResponse.json({ error: 'vendorId and templateId are required.' }, { status: 400 });
  }
  if (!ALLOWED_TEMPLATES.includes(templateId)) {
    return NextResponse.json({ error: `Unknown templateId: ${templateId}` }, { status: 400 });
  }

  const { vendor, email: vendorEmail } = resolveVendorEmail(vendorId);
  if (!vendor) return NextResponse.json({ error: `Unknown vendorId: ${vendorId}` }, { status: 404 });

  const toEmail = payload.toEmail?.trim() || vendorEmail;
  if (!toEmail) {
    return NextResponse.json(
      { error: `No mailto contact on file for ${vendor.name}. Provide toEmail explicitly.` },
      { status: 400 },
    );
  }

  const rendered = renderTemplate(templateId, {
    vendor,
    productName: payload.productName,
    quantity: payload.quantity,
    region: payload.region,
    timeline: payload.timeline,
    useCase: payload.useCase,
  });

  const id = (globalThis.crypto?.randomUUID?.() ?? `out_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Resend not configured (missing RESEND_API_KEY).' }, { status: 500 });
  }
  const resend = new Resend(apiKey);

  const fullText = rendered.body + SOURCING_SIGNATURE_TEXT;
  const fullHtml = bodyToHtml(rendered.body) + SOURCING_SIGNATURE_HTML;

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

    const record = await recordOutreach({
      id, vendorId, template: templateId, toEmail,
      subject: rendered.subject, body: fullText, status: 'sent',
      resendId: data?.id,
      metadata: {
        productName: payload.productName, quantity: payload.quantity,
        region: payload.region, timeline: payload.timeline, useCase: payload.useCase,
        templateLabel: TEMPLATE_LABELS[templateId],
      },
    });
    return NextResponse.json({ success: true, record });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[admin/outreach] send to ${toEmail} failed:`, msg);
    await recordOutreach({
      id, vendorId, template: templateId, toEmail,
      subject: rendered.subject, body: fullText, status: 'failed', error: msg,
      metadata: { productName: payload.productName, quantity: payload.quantity, region: payload.region },
    }).catch(() => undefined);
    return NextResponse.json({ error: `Send failed: ${msg}` }, { status: 502 });
  }
}
