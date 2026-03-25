import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/cms/login' || pathname.startsWith('/cms/login/')) {
    return NextResponse.next();
  }

  const session = request.cookies.get('cms_session');
  if (!session?.value) {
    const loginUrl = new URL('/cms/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cms/:path*'],
};
