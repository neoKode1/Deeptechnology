/**
 * Admin authentication — two-layer strategy:
 *
 * 1. API clients: `Authorization: Bearer <ADMIN_SECRET>` header (unchanged)
 * 2. Browser UI:  UUID session token stored in Cloudflare D1, sent as `admin_token` cookie
 *
 * The cookie value is NEVER the secret itself — it's a random UUID that maps
 * to a session row in D1. Stealing the cookie gives at most 24 hours of access,
 * and sessions can be invalidated instantly by deleting the row.
 */

import { d1Exec, d1First } from '@/lib/d1';

const SESSION_TTL_MS = 60 * 60 * 24 * 1000; // 24 hours

/** Create a new admin session in D1. Returns the UUID token to set as a cookie. */
export async function createAdminSession(): Promise<string> {
  const { randomUUID } = await import('crypto');
  const token = randomUUID();
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;
  await d1Exec(
    'INSERT INTO admin_sessions (token, created_at, expires_at) VALUES (?, ?, ?)',
    [token, now, expiresAt],
  );
  return token;
}

/** Destroy an admin session (logout). */
export async function destroyAdminSession(token: string): Promise<void> {
  await d1Exec('DELETE FROM admin_sessions WHERE token = ?', [token]);
}

/** Verify a session UUID exists in D1 and has not expired. */
async function isValidSession(token: string): Promise<boolean> {
  try {
    const row = await d1First<{ token: string }>(
      'SELECT token FROM admin_sessions WHERE token = ? AND expires_at > ?',
      [token, Date.now()],
    );
    return row !== null;
  } catch {
    return false;
  }
}

/** Extract cookie value by name from a request. */
function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie') || '';
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Check if the request is authorized for admin access.
 * Accepts:
 *   - `Authorization: Bearer <ADMIN_SECRET>` header (programmatic API access)
 *   - `admin_token=<UUID>` cookie (browser admin UI — UUID validated against D1)
 */
export async function isAuthorizedRequest(request: Request): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') return false;
    return true; // dev: open
  }

  // 1. Bearer header — programmatic clients (Nimbus, curl, admin scripts)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    if (authHeader.slice(7) === secret) return true;
  }

  // 2. Session cookie — browser admin UI
  const sessionToken = getCookie(request, 'admin_token');
  if (sessionToken) {
    return isValidSession(sessionToken);
  }

  return false;
}

/** Return a 401 JSON response */
export function unauthorizedResponse() {
  return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
