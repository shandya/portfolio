import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/cms/login' || pathname.startsWith('/cms/login/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.redirect(new URL('/cms/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cms/:path*'],
};
