import { NextResponse } from 'next/server';
import { destroyAdminSession } from '@/lib/admin-auth';

/**
 * POST /api/admin/logout
 * Destroys the Redis session and clears the admin_token cookie.
 */
export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;

  if (token) {
    await destroyAdminSession(token);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}
