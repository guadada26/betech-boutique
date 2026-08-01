/**
 * Betech Boutique — Capa de acceso a datos
 *
 * Todas las llamadas al Master (Google Sheets vía Apps Script) pasan
 * exclusivamente por este archivo. Los componentes y páginas NUNCA
 * hacen fetch directo a la API.
 *
 * URL configurada mediante variable de entorno:
 *   NEXT_PUBLIC_BOUTIQUE_API_URL
 */

import type { Category } from '@/types/category';
import type { Product } from '@/types/product';
import { cookies } from 'next/headers';
import { CATALOG_PROFILE_COOKIE, parseCatalogProfile, resolvePriceMode, type PriceMode } from '@/lib/catalogProfile';

// ─── Tipos internos ────────────────────────────────────────────────────────

interface ApiSuccessResponse<T> {
  success: true;
  data: T[];
  count: number;
  updatedAt: string;
}

interface ApiErrorResponse {
  success: false;
  error:
    | string
    | {
        code?: string;
        message?: string;
      };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

const SAFE_CATEGORY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeText(value: string): string {
  return (value || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s*&\s*/g, ' y ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function categoriesMatch(productCategory: string, slug: string): boolean {
  const a = normalizeText(productCategory);
  const b = normalizeText(slug);

  if (!a || !b) return false;
  if (a === b) return true;

  const stripConnector = (text: string) => text.replace(/-y-/g, '-').replace(/--+/g, '-');
  return stripConnector(a) === stripConnector(b);
}

type ApiDetailedResponse<T> = {
  data: T[];
  count: number;
  success: true;
  requestUrl: string;
};

function shouldLogDevDiagnostics(): boolean {
  return process.env.NODE_ENV !== 'production';
}

function normalizeProduct(product: Product): Product {
  const source = product as unknown as Record<string, unknown>;
  const pickText = (...keys: string[]): string | undefined => {
    for (const key of keys) {
      const value = source[key];
      if (value === null || value === undefined) continue;
      const normalized = String(value).trim();
      if (normalized) return normalized;
    }
    return undefined;
  };

  const normalizeKey = (value: string): string =>
    (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

  const parsedByNormalizedKey = new Map<string, unknown>();
  for (const [key, value] of Object.entries(source)) {
    parsedByNormalizedKey.set(normalizeKey(key), value);
  }

  const parsePriceValue = (value: unknown): number | null => {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    if (typeof value !== 'string') {
      return null;
    }

    const cleaned = value
      .trim()
      .replace(/\s+/g, '')
      .replace(/[^0-9,.-]/g, '');

    if (!cleaned) return null;

    if (cleaned.includes(',') && cleaned.includes('.')) {
      const withoutDots = cleaned.replace(/\./g, '');
      const normalized = withoutDots.replace(',', '.');
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : null;
    }

    if (cleaned.includes(',')) {
      const normalized = cleaned.replace(',', '.');
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : null;
    }

    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const pickNumber = (...keys: string[]): number | null => {
    for (const key of keys) {
      const raw = source[key];
      const parsed = parsePriceValue(raw);
      if (parsed !== null) return parsed;
    }

    for (const key of keys) {
      const raw = parsedByNormalizedKey.get(normalizeKey(key));
      const parsed = parsePriceValue(raw);
      if (parsed !== null) return parsed;
    }

    return null;
  };

  const resellerPrice = pickNumber(
    'PRECIO_UNITARIO_REVENDEDOR',
    'precio_unitario_revendedor',
    'precioUnitarioRevendedor',
    'precioRevendedor',
    'PRECIO_REVENDEDOR',
    'PRECIO_REVENDEDORES'
  );

  return {
    ...product,
    // Por ahora las imágenes no se conectan al Master: se usa placeholder del frontend.
    image: null,
    publishHome: pickText('publishHome', 'PUBLICAR_HOME', 'publicarHome'),
    publishDrop: pickText(
      'publishDrop',
      'PUBLICAR_DROP',
      'publicarDrop',
      'Publicar_Drop',
      'DESTACADO_HOME',
      'featuredHome'
    ),
    descriptionExtended: pickText('descriptionExtended', 'DESCRIPCION_AMPLIADA', 'descripcionAmpliada'),
    availableColors: pickText('availableColors', 'COLORES_DISPONIBLES', 'coloresDisponibles'),
    measurements: pickText('measurements', 'MEDIDAS', 'medidas'),
    resellerPrice,
  };
}

function applyPriceMode(product: Product, priceMode: PriceMode): Product {
  if (priceMode !== 'reseller') {
    return product;
  }

  if (typeof product.resellerPrice === 'number' && Number.isFinite(product.resellerPrice)) {
    return {
      ...product,
      price: product.resellerPrice,
    };
  }

  return product;
}

function resolveCurrentPriceMode(fallback: PriceMode = 'public'): PriceMode {
  try {
    const cookieValue = cookies().get(CATALOG_PROFILE_COOKIE)?.value;
    const profile = parseCatalogProfile(cookieValue);
    return resolvePriceMode(profile);
  } catch {
    return fallback;
  }
}

function isPublicActiveProduct(product: Product): boolean {
  const status = (product.status || '').trim().toUpperCase();
  const availability = (product.availability || '').trim().toUpperCase();

  if (status === 'INACTIVO' || availability === 'INACTIVO') {
    return false;
  }

  const valid = ['ACTIVO', 'DISPONIBLE'];
  return valid.includes(status) || valid.includes(availability);
}

function isActiveCategory(category: Category): boolean {
  const status = (category.status || '').trim().toUpperCase();
  return status === 'ACTIVO' || status === 'DISPONIBLE';
}

// ─── Fetch genérico ────────────────────────────────────────────────────────

function buildBoutiqueApiUrl(params: Record<string, string>): URL {
  const apiUrl = process.env.NEXT_PUBLIC_BOUTIQUE_API_URL;

  if (!apiUrl) {
    throw new Error(
      'Variable de entorno NEXT_PUBLIC_BOUTIQUE_API_URL no configurada. ' +
        'Revisá el archivo .env.local.'
    );
  }

  const url = new URL(apiUrl);
  if (!params.app) {
    url.searchParams.set('app', 'boutique');
  }
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url;
}

async function fetchFromApiDetailed<T>(params: Record<string, string>): Promise<ApiDetailedResponse<T>> {
  const url = buildBoutiqueApiUrl(params);
  const requestUrl = `${url.origin}${url.pathname}?${url.searchParams.toString()}`;

  let response: Response;

  try {
    response = await fetch(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate: 120 },
    });
  } catch (networkError) {
    throw new Error(
      'No se pudo conectar con la API. Verificá la URL y tu conexión a internet.'
    );
  }

  if (!response.ok) {
    throw new Error(`La API respondió con error HTTP ${response.status}.`);
  }

  let json: ApiResponse<T>;

  const rawBody = await response.text();
  const normalizedBody = rawBody
    .replace(/^\uFEFF/, '')
    .replace(/^\)\]\}',?\s*/, '')
    .trim();

  try {
    json = JSON.parse(normalizedBody) as ApiResponse<T>;
  } catch {
    const contentType = response.headers.get('content-type') || 'unknown';
    const head = normalizedBody.slice(0, 160).replace(/\s+/g, ' ');
    throw new Error(`La respuesta de la API no es JSON válido. content-type=${contentType} head=${head}`);
  }

  if (!json.success) {
    const apiError = (json as ApiErrorResponse).error;
    const message =
      typeof apiError === 'string'
        ? apiError
        : apiError?.message || apiError?.code || 'Error desconocido de API';
    throw new Error(`Error de API: ${message}`);
  }

  const successJson = json as ApiSuccessResponse<T>;

  return {
    data: successJson.data ?? [],
    count: typeof successJson.count === 'number' ? successJson.count : (successJson.data ?? []).length,
    success: true,
    requestUrl,
  };
}

async function fetchFromApi<T>(params: Record<string, string>): Promise<T[]> {
  const detailed = await fetchFromApiDetailed<T>(params);
  return detailed.data;
}

// ─── Funciones públicas ────────────────────────────────────────────────────


function isSafeCategorySlug(slug: string): boolean {
  return SAFE_CATEGORY_SLUG_PATTERN.test((slug || '').trim());
}

export async function getCategories(): Promise<Category[]> {
  const categories = await fetchFromApi<Category>({ resource: 'categories' });
  return categories.filter(isActiveCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  const normalizedSlug = normalizeText(slug);
  return categories.find((cat) => normalizeText(cat.slug) === normalizedSlug) ?? null;
}

/**
 * Devuelve todos los productos activos/disponibles del Master.
 */
export async function getProducts(options?: { priceMode?: PriceMode }): Promise<Product[]> {
  const priceMode = options?.priceMode ?? resolveCurrentPriceMode('public');
  const products = await fetchFromApi<Product>({ resource: 'products' });
  return products.filter(isPublicActiveProduct).map(normalizeProduct).map((product) => applyPriceMode(product, priceMode));
}

/**
 * Devuelve los productos de una categoría específica (filtrado en el servidor).
 */
export async function getProductsByCategory(slug: string, options?: { priceMode?: PriceMode }): Promise<Product[]> {
  const priceMode = options?.priceMode ?? resolveCurrentPriceMode('public');
  const safeSlug = normalizeText(slug);
  if (!isSafeCategorySlug(safeSlug)) {
    throw new Error('CATEGORY_INVALID_SLUG');
  }

  try {
    const response = await fetchFromApiDetailed<Product>({
      resource: 'products',
      category: safeSlug,
    });

    const byCategoryEndpoint = response.data
      .filter(isPublicActiveProduct)
      .filter((product) => categoriesMatch(product.category || '', safeSlug))
      .map(normalizeProduct)
      .map((product) => applyPriceMode(product, priceMode));

    if (byCategoryEndpoint.length > 0) {
      if (shouldLogDevDiagnostics()) {
        console.info('[BOUTIQUE][CATEGORY][DEBUG]', {
          slugRecibido: slug,
          categoriaCanonicaResuelta: safeSlug,
          requestUrl: response.requestUrl,
          success: response.success,
          count: response.count,
          fallbackUsed: false,
          error: null,
        });
      }

      return byCategoryEndpoint;
    }

    // Fallback robusto: algunas categorías (ej. tv-audio, heladeras-freezer)
    // pueden venir vacías desde el endpoint filtrado aunque existan en products.
    const allProducts = await getProducts({ priceMode });
    const fallbackProducts = allProducts.filter((product) =>
      categoriesMatch(product.category || '', safeSlug)
    );

    if (shouldLogDevDiagnostics()) {
      console.info('[BOUTIQUE][CATEGORY][DEBUG]', {
        slugRecibido: slug,
        categoriaCanonicaResuelta: safeSlug,
        requestUrl: response.requestUrl,
        success: response.success,
        count: response.count,
        fallbackUsed: true,
        fallbackCount: fallbackProducts.length,
        error: null,
      });
    }

    return fallbackProducts;
  } catch (error) {
    if (shouldLogDevDiagnostics()) {
      console.info('[BOUTIQUE][CATEGORY][DEBUG]', {
        slugRecibido: slug,
        categoriaCanonicaResuelta: safeSlug,
        requestUrl: null,
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : String(error),
      });
    }
    throw error;
  }
}

function normalizeSku(value: string): string {
  return (value || '').trim().toUpperCase();
}

export async function getProductBySku(sku: string, options?: { priceMode?: PriceMode }): Promise<Product | null> {
  const target = normalizeSku(sku);
  if (!target) return null;

  const products = await getProducts(options);
  return products.find((product) => normalizeSku(product.sku) === target) ?? null;
}

/**
 * Diagnóstico: devuelve los encabezados reales detectados en el Master.
 * Solo usar en desarrollo.
 */
export async function getApiHeaders(): Promise<{ CATEGORIAS: string[]; PRODUCTOS: string[] }> {
  throw new Error(
    'resource=headers está deshabilitado para consumo público. Usá diagnosticarEncabezadosBoutique() desde Apps Script.'
  );
}
