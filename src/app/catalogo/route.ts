import { NextResponse } from 'next/server';
import { CATALOG_PROFILE_COOKIE, RESELLER_AUTH_COOKIE } from '@/lib/catalogProfile';

export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const response = NextResponse.redirect(new URL('/', requestUrl.origin));

  response.cookies.set(CATALOG_PROFILE_COOKIE, 'publico', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });

  response.cookies.set(RESELLER_AUTH_COOKIE, '', {
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
