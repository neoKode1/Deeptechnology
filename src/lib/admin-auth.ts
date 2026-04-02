/**
 * Simple admin authentication via a shared secret.
 *
 * Set ADMIN_SECRET in your environment variables.
 * Clients must send `Authorization: Bearer <secret>` header.
 *
 * For the admin UI (browser), we use a cookie set after initial auth.
 */

/** Check if the request has a valid admin secret in the Authorization header */
export function isAuthorizedRequest(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    // If no secret is configured, block all admin access in production
    if (process.env.NODE_ENV === 'production') return false;
    // In development, allow all requests
    return true;
  }

  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (token === secret) return true;
  }

  // Check cookie (for browser-based admin UI)
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(/admin_token=([^;]+)/);
  if (match && match[1] === secret) return true;

  return false;
}

/** Return a 401 JSON response */
export function unauthorizedResponse() {
  return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

