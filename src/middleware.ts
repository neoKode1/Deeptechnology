import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware — protects all /admin/* routes.
 *
 * Edge-compatible: only checks cookie presence here.
 * Redis session validity is enforced by each API route via isAuthorizedRequest().
 *
 * Unauthenticated → redirect to /admin/login
 * Authenticated   → pass through
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only gate admin UI pages — not the login page or API routes
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/api/')
  ) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
