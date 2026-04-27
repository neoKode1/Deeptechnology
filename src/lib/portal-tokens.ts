import { d1First, d1Exec } from '@/lib/d1';

/**
 * D1-backed customer-portal magic-link tokens.
 * Tokens are single-use and expire after 1 hour.
 */
const TOKEN_TTL_MS = 60 * 60 * 1000;

/** Create and persist a token bound to an email address. */
export async function createPortalToken(token: string, email: string): Promise<void> {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  await d1Exec(
    'INSERT INTO portal_tokens (token, email, expires_at) VALUES (?, ?, ?)',
    [token, email.toLowerCase().trim(), expiresAt],
  );
}

/**
 * Atomically consume a token. Returns the email it was bound to (if any),
 * and removes the token so it can't be reused. Expired tokens return null.
 */
export async function consumePortalToken(token: string): Promise<string | null> {
  const row = await d1First<{ email: string; expires_at: number }>(
    'SELECT email, expires_at FROM portal_tokens WHERE token = ?',
    [token],
  );
  // Always delete (single-use), even if expired — clean up
  await d1Exec('DELETE FROM portal_tokens WHERE token = ?', [token]);
  if (!row) return null;
  if (row.expires_at < Date.now()) return null;
  return row.email;
}
