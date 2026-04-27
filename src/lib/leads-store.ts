import { d1Query, d1Exec } from '@/lib/d1';

/**
 * D1-backed lead capture (ROI calculator + comparison-page unlock).
 * Each row stores the source ('roi' | 'compare' | 'chat'), the captured
 * email, and the full payload as JSON for downstream readback.
 */

export type LeadSource = 'roi_calculator' | 'compare_unlock';

export interface LeadRecord {
  id: string;
  source: LeadSource;
  email: string;
  data: Record<string, unknown>;
  createdAt: string;
}

const LEAD_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

/** Persist a captured lead. */
export async function saveLead(
  source: LeadSource,
  id: string,
  email: string,
  data: Record<string, unknown>,
): Promise<void> {
  const now = Date.now();
  const expiresAt = now + LEAD_TTL_MS;
  await d1Exec(
    `INSERT INTO leads (id, source, email, data, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, source, email.toLowerCase().trim(), JSON.stringify(data), now, expiresAt],
  );
}

/** List all currently-valid leads of a given source, newest first. */
export async function listLeads(source: LeadSource): Promise<LeadRecord[]> {
  const rows = await d1Query<{
    id: string; source: string; email: string; data: string; created_at: number;
  }>(
    `SELECT id, source, email, data, created_at FROM leads
     WHERE source = ? AND expires_at > ?
     ORDER BY created_at DESC`,
    [source, Date.now()],
  );
  return rows.map((r) => {
    let parsed: Record<string, unknown> = {};
    try { parsed = JSON.parse(r.data); } catch { /* ignore */ }
    return {
      id: r.id,
      source: r.source as LeadSource,
      email: r.email,
      data: parsed,
      createdAt: new Date(r.created_at).toISOString(),
    };
  });
}
