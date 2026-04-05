/**
 * Admin authentication — two-layer strategy:
 *
 * 1. API clients: `Authorization: Bearer <ADMIN_SECRET>` header (unchanged)
 * 2. Browser UI:  UUID session token stored in Redis, sent as `admin_token` cookie
 *
 * The cookie value is NEVER the secret itself — it's a random UUID that maps
 * to a session record in Redis. Stealing the cookie gives at most 24 hours of
 * access, and sessions can be invalidated instantly by deleting the Redis key.
 */

import { Redis } from '@upstash/redis';

const SESSION_TTL = 60 * 60 * 24; // 24 hours
const SESSION_PREFIX = 'admin:session:';

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

/** Create a new admin session in Redis. Returns the UUID token to set as a cookie. */
export async function createAdminSession(): Promise<string> {
  const { randomUUID } = await import('crypto');
  const token = randomUUID();
  const redis = getRedis();
  await redis.set(`${SESSION_PREFIX}${token}`, '1', { ex: SESSION_TTL });
  return token;
}

/** Destroy an admin session (logout). */
export async function destroyAdminSession(token: string): Promise<void> {
  const redis = getRedis();
  await redis.del(`${SESSION_PREFIX}${token}`);
}

/** Verify a session UUID exists in Redis. */
async function isValidSession(token: string): Promise<boolean> {
  try {
    const redis = getRedis();
    const val = await redis.get(`${SESSION_PREFIX}${token}`);
    return val === '1';
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
 *   - `admin_token=<UUID>` cookie (browser admin UI — UUID validated against Redis)
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

