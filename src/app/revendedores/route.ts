import { NextResponse } from 'next/server';
import { buildResellerAuthToken, CATALOG_PROFILE_COOKIE, RESELLER_AUTH_COOKIE } from '@/lib/catalogProfile';

export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const keyFromLink = (requestUrl.searchParams.get('key') || '').trim();
  const expectedKey = (process.env.RESELLER_ACCESS_KEY || '').trim();

  if (!expectedKey) {
    return NextResponse.json(
      { ok: false, message: 'RESELLER_ACCESS_KEY no esta configurada en el entorno.' },
      { status: 500 }
    );
  }

  if (!keyFromLink || keyFromLink !== expectedKey) {
    return NextResponse.redirect(new URL('/?revendedores=acceso-denegado', requestUrl.origin));
  }

  const authSecret = (process.env.RESELLER_AUTH_SECRET || expectedKey).trim();
  const authToken = buildResellerAuthToken(authSecret);
  const response = NextResponse.redirect(new URL('/', requestUrl.origin));

  response.cookies.set(CATALOG_PROFILE_COOKIE, 'revendedores', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });

  response.cookies.set(RESELLER_AUTH_COOKIE, authToken, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
