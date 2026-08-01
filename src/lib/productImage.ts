const PRODUCT_IMAGE_PLACEHOLDER = '/images/placeholders/product-placeholder.svg';

function toDashCaseSku(value: string): string {
  return value
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toTitleCaseSku(value: string): string {
  return value
    .split('-')
    .map((segment) => {
      if (!segment) return segment;
      return `${segment.charAt(0).toUpperCase()}${segment.slice(1).toLowerCase()}`;
    })
    .join('-');
}

function getSkuVariants(sku: string): string[] {
  const normalized = normalizeSkuForImage(sku);
  if (!normalized) return [];

  const dashed = toDashCaseSku(normalized);
  const variants = [
    normalized,
    dashed,
    normalized.toUpperCase(),
    normalized.toLowerCase(),
    dashed.toUpperCase(),
    dashed.toLowerCase(),
    toTitleCaseSku(dashed),
  ];

  return Array.from(new Set(variants.filter(Boolean)));
}

function buildImageCandidatesFromSkuVariants(skuVariants: string[]): string[] {
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  const candidates: string[] = [];

  skuVariants.forEach((variant) => {
    extensions.forEach((ext) => {
      candidates.push(`/images/products/${variant}.${ext}`);
    });
  });

  candidates.push(PRODUCT_IMAGE_PLACEHOLDER);
  return Array.from(new Set(candidates));
}

export function normalizeSkuForImage(sku: string): string {
  return (sku || '').trim();
}

export function isValidBoutiqueSku(sku: string): boolean {
  return normalizeSkuForImage(sku).length > 0;
}

export function getProductImagePathBySku(sku: string): string | null {
  const normalized = normalizeSkuForImage(sku);

  if (!isValidBoutiqueSku(normalized)) {
    return null;
  }

  return `/images/products/${normalized}.jpg`;
}

export function getProductImageCandidatePathsBySku(sku: string): string[] {
  const variants = getSkuVariants(sku);

  if (variants.length === 0) {
    return [PRODUCT_IMAGE_PLACEHOLDER];
  }

  return buildImageCandidatesFromSkuVariants(variants);
}

export function getProductImageAlt(name?: string, description?: string): string {
  const byName = (name || '').trim();
  if (byName) return byName;

  const byDescription = (description || '').trim();
  if (byDescription) return byDescription;

  return 'Producto Betech Boutique';
}

export function getProductPlaceholderPath(): string {
  return PRODUCT_IMAGE_PLACEHOLDER;
}
