import { d1First, d1Exec, d1Query } from '@/lib/d1';

/**
 * D1-backed chat history + per-session daily cap + lead-email capture.
 * Replaces the previous Redis-keyed implementation.
 */

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

const HISTORY_TTL_MS  = 7  * 24 * 60 * 60 * 1000; // 7 days
const LEAD_TTL_MS     = 7  * 24 * 60 * 60 * 1000;
const CAP_TTL_MS      = 25 * 60 * 60 * 1000;      // slightly > 24h

/** Build the canonical history key for a thread. */
export function historyKey(orderId?: string | null, sessionId?: string | null): string | null {
  if (orderId)   return `chat:${orderId}:history`;
  if (sessionId) return `chat:anon:${sessionId}:history`;
  return null;
}

/** Load stored conversation history (returns [] if missing/expired). */
export async function getChatHistory(key: string): Promise<ChatMessage[]> {
  const row = await d1First<{ messages: string; expires_at: number }>(
    'SELECT messages, expires_at FROM chat_history WHERE key = ?',
    [key],
  );
  if (!row) return [];
  if (row.expires_at < Date.now()) return [];
  try {
    const parsed = JSON.parse(row.messages);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Save (replace) conversation history for a thread. */
export async function saveChatHistory(key: string, messages: ChatMessage[]): Promise<void> {
  const expiresAt = Date.now() + HISTORY_TTL_MS;
  await d1Exec(
    `INSERT INTO chat_history (key, messages, expires_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET messages = excluded.messages, expires_at = excluded.expires_at`,
    [key, JSON.stringify(messages), expiresAt],
  );
}

/**
 * Increment + check the per-session daily message cap.
 * Returns the new count after this call.
 */
export async function incrementSessionCap(sessionId: string): Promise<number> {
  const day = new Date().toISOString().slice(0, 10);
  const expiresAt = Date.now() + CAP_TTL_MS;

  await d1Exec(
    `INSERT INTO chat_session_caps (session_id, day, count, expires_at)
     VALUES (?, ?, 1, ?)
     ON CONFLICT(session_id, day) DO UPDATE SET
       count = count + 1,
       expires_at = excluded.expires_at`,
    [sessionId, day, expiresAt],
  );

  const row = await d1First<{ count: number }>(
    'SELECT count FROM chat_session_caps WHERE session_id = ? AND day = ?',
    [sessionId, day],
  );
  return row?.count ?? 0;
}

/** Save (or replace) the lead email captured for an anonymous session. */
export async function saveChatLead(sessionId: string, email: string): Promise<void> {
  const now = Date.now();
  const expiresAt = now + LEAD_TTL_MS;
  await d1Exec(
    `INSERT INTO chat_leads (session_id, email, captured_at, expires_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(session_id) DO UPDATE SET
       email       = excluded.email,
       captured_at = excluded.captured_at,
       expires_at  = excluded.expires_at`,
    [sessionId, email.toLowerCase().trim(), now, expiresAt],
  );
}

export interface ChatLeadRow {
  sessionId: string;
  email: string;
  capturedAt: string | null;
}

/** List all currently-valid chat leads, newest first (admin dashboard). */
export async function listChatLeads(): Promise<ChatLeadRow[]> {
  const data = await d1Query<{
    session_id: string; email: string; captured_at: number;
  }>(
    'SELECT session_id, email, captured_at FROM chat_leads WHERE expires_at > ? ORDER BY captured_at DESC',
    [Date.now()],
  );
  return data.map((r) => ({
    sessionId: r.session_id,
    email: r.email,
    capturedAt: new Date(r.captured_at).toISOString(),
  }));
}
