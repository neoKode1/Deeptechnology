import { d1Exec, d1Query } from '@/lib/d1';
import type { TemplateId } from './templates';

/**
 * D1-backed audit log for admin → vendor outreach.
 * Stores the rendered subject/body, the result (sent/failed), and any
 * structured metadata the operator filled in (region, quantity, productName).
 */

export interface OutreachRecord {
  id: string;
  vendorId: string;
  template: TemplateId;
  toEmail: string;
  subject: string;
  body: string;
  status: 'sent' | 'failed';
  resendId?: string;
  error?: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
}

interface OutreachRow {
  id: string;
  vendor_id: string;
  template: string;
  to_email: string;
  subject: string;
  body: string;
  status: string;
  resend_id: string | null;
  error: string | null;
  metadata: string | null;
  created_at: number;
}

function rowToRecord(row: OutreachRow): OutreachRecord {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    template: row.template as TemplateId,
    toEmail: row.to_email,
    subject: row.subject,
    body: row.body,
    status: row.status as 'sent' | 'failed',
    resendId: row.resend_id ?? undefined,
    error: row.error ?? undefined,
    metadata: row.metadata ? safeParse(row.metadata) : undefined,
    createdAt: row.created_at,
  };
}

function safeParse(s: string): Record<string, unknown> | undefined {
  try { return JSON.parse(s) as Record<string, unknown>; } catch { return undefined; }
}

export async function recordOutreach(rec: Omit<OutreachRecord, 'createdAt'> & { createdAt?: number }): Promise<OutreachRecord> {
  const createdAt = rec.createdAt ?? Date.now();
  await d1Exec(
    `INSERT INTO vendor_outreach
       (id, vendor_id, template, to_email, subject, body, status, resend_id, error, metadata, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      rec.id,
      rec.vendorId,
      rec.template,
      rec.toEmail,
      rec.subject,
      rec.body,
      rec.status,
      rec.resendId ?? null,
      rec.error ?? null,
      rec.metadata ? JSON.stringify(rec.metadata) : null,
      createdAt,
    ],
  );
  return { ...rec, createdAt };
}

export async function listOutreach(opts: { vendorId?: string; limit?: number } = {}): Promise<OutreachRecord[]> {
  const limit = Math.min(opts.limit ?? 100, 500);
  const rows = opts.vendorId
    ? await d1Query<OutreachRow>(
        'SELECT * FROM vendor_outreach WHERE vendor_id = ? ORDER BY created_at DESC LIMIT ?',
        [opts.vendorId, limit],
      )
    : await d1Query<OutreachRow>(
        'SELECT * FROM vendor_outreach ORDER BY created_at DESC LIMIT ?',
        [limit],
      );
  return rows.map(rowToRecord);
}
