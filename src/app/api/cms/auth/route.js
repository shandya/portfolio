import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'cms_session';
const MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST(request) {
  const { password } = await request.json();

  if (!password || password !== process.env.CMS_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
  return response;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('logout') === 'true') {
    const response = NextResponse.redirect(new URL('/cms/login', request.url));
    response.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
    return response;
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
