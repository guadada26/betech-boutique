import { createHmac, timingSafeEqual } from 'crypto';

export type CatalogProfile = 'publico' | 'revendedores';

export type PriceMode = 'public' | 'reseller';

export const CATALOG_PROFILE_COOKIE = 'betech_profile';
export const RESELLER_AUTH_COOKIE = 'betech_reseller_auth';

export function parseCatalogProfile(value?: string): CatalogProfile {
  const normalized = (value || '').trim().toLowerCase();
  if (normalized === 'revendedores' || normalized === 'revendedor') {
    return 'revendedores';
  }
  return 'publico';
}

export function resolvePriceMode(profile: CatalogProfile): PriceMode {
  return profile === 'revendedores' ? 'reseller' : 'public';
}

export function buildResellerAuthToken(secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac('sha256', secret).update(timestamp).digest('hex');
  return `${timestamp}.${signature}`;
}

export function isValidResellerAuthToken(
  token: string | undefined,
  secret: string,
  maxAgeSeconds: number = 60 * 60 * 24 * 30
): boolean {
  if (!token || !secret) return false;

  const [timestampRaw, signatureRaw] = token.split('.');
  if (!timestampRaw || !signatureRaw) return false;

  const timestamp = Number(timestampRaw);
  if (!Number.isFinite(timestamp)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (timestamp > now + 60) return false;
  if (now - timestamp > maxAgeSeconds) return false;

  const expected = createHmac('sha256', secret).update(timestampRaw).digest('hex');
  const expectedBuffer = Buffer.from(expected);
  const givenBuffer = Buffer.from(signatureRaw);

  if (expectedBuffer.length !== givenBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, givenBuffer);
}

export function isResellerProfileAuthorized(
  profileCookieValue: string | undefined,
  authCookieValue: string | undefined,
  secret: string
): boolean {
  const profile = parseCatalogProfile(profileCookieValue);
  if (profile !== 'revendedores') return false;
  return isValidResellerAuthToken(authCookieValue, secret);
}
