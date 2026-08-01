import { NextResponse } from 'next/server';
import { CATALOG_PROFILE_COOKIE } from '@/lib/catalogProfile';

export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const response = NextResponse.redirect(new URL('/', requestUrl.origin));

  response.cookies.set(CATALOG_PROFILE_COOKIE, 'revendedores', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });

  return response;
}
