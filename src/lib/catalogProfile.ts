export type CatalogProfile = 'publico' | 'revendedores';

export type PriceMode = 'public' | 'reseller';

export const CATALOG_PROFILE_COOKIE = 'betech_profile';

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
