import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_PATHS = ['/password', '/api/auth', '/favicon.ico'];
const AUTH_COOKIE = 'soarx-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/auth') ||
    ALLOWED_PATHS.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (authCookie === 'authenticated') {
    return NextResponse.next();
  }

  const loginUrl = new URL('/password', request.url);
  return NextResponse.redirect(loginUrl);
}
