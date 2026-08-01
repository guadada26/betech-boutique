import { siteConfig } from '@/config/siteData';
import type { Product } from '@/types/product';

export type WeeklyListSection = {
  categoryKey: string;
  categoryLabel: string;
  products: Product[];
};

export const WEEKLY_LIST_FINAL_LINES = [
  '📌 *INFORMACIÓN IMPORTANTE*',
  '',
  '▪️ 🚚 Envíos sin cargo en productos seleccionados (consultar zonas)',
  '▪️ 📲 Catálogo online: XXX',
  '▪️ ❌ No se aceptan USD cara chica, manchados o rotos',
  '▪️ 🧾 Factura A/B: consultar recargo',
  '📲 *Consultame y te respondo al momento*',
];

const WEEKLY_LIST_CONFIG = {
  featuredLimit: 4,
  categoryOrder: [
    'celulares',
    'tecnologia',
    'climatizacion',
    'tv-audio',
    'heladeras-freezer',
    'lavado',
    'cocina',
    'pequenos-electrodomesticos',
    'bazar',
  ],
  categoryLabels: {
    celulares: 'Celulares',
    tecnologia: 'Tecnología',
    climatizacion: 'Climatización',
    'tv-audio': 'TV / Audio',
    'heladeras-freezer': 'Heladeras y Freezer',
    lavado: 'Lavado',
    cocina: 'Cocina',
    'pequenos-electrodomesticos': 'Pequeños electro',
    bazar: 'Bazar',
  } as Record<string, string>,
  categoryGroupOrder: {
    celulares: ['iphone', 'samsung', 'accesorios'],
  } as Record<string, string[]>,
};

function normalizeCategoryKey(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s*&\s*/g, ' y ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function canonicalCategoryKey(value: string): string {
  return normalizeCategoryKey(value)
    .replace(/-y-/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getConfiguredCategoryOrder(): { orderMap: Map<string, number>; labelMap: Map<string, string> } {
  const merged = [...siteConfig.categories, ...siteConfig.allCategories];
  const orderMap = new Map<string, number>();
  const labelMap = new Map<string, string>();

  merged.forEach((category, index) => {
    const key = normalizeCategoryKey(category.id || category.name);
    if (!orderMap.has(key)) {
      orderMap.set(key, index);
    }
    if (!labelMap.has(key)) {
      labelMap.set(key, category.name);
    }
  });

  return { orderMap, labelMap };
}

function parsePrice(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/[^0-9.,-]+/g, '').replace(/\./g, '').replace(',', '.');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
  }

  return Number.POSITIVE_INFINITY;
}

function normalizeText(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function isStrictActiveProduct(product: Product): boolean {
  return (product.status || '').trim().toUpperCase() === 'ACTIVO';
}

function isTruthyFlag(value?: string): boolean {
  const normalized = (value || '').trim().toLowerCase();
  return normalized === 'si' || normalized === 'sí' || normalized === 'true' || normalized === '1' || normalized === 'x';
}

function buildCategoryOrderMap(): Map<string, number> {
  const map = new Map<string, number>();
  WEEKLY_LIST_CONFIG.categoryOrder.forEach((key, index) => {
    map.set(canonicalCategoryKey(key), index);
  });
  return map;
}

function getCellPhoneGroupKey(product: Product): string {
  const haystack = normalizeText([
    product.brand || '',
    product.subcategory || '',
    product.description || '',
    product.name || '',
  ].join(' '));

  if (haystack.includes('iphone') || haystack.includes('apple')) return 'iphone';
  if (haystack.includes('samsung') || haystack.includes('galaxy')) return 'samsung';
  return 'accesorios';
}

function getGroupSortRank(categoryKey: string, product: Product): number {
  const groupOrder = WEEKLY_LIST_CONFIG.categoryGroupOrder[categoryKey];
  if (!groupOrder || groupOrder.length === 0) return Number.MAX_SAFE_INTEGER;

  let groupKey = '';
  if (categoryKey === 'celulares') {
    groupKey = getCellPhoneGroupKey(product);
  }

  const idx = groupOrder.indexOf(groupKey);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

function dedupeBySku(products: Product[]): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];

  for (const product of products) {
    const key = (product.sku || '').trim().toUpperCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(product);
  }

  return out;
}

export function formatPrice(currency: string, price: number): string {
  if (!Number.isFinite(price)) {
    return 'Consultar precio';
  }

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function buildWeeklyListSections(products: Product[]): WeeklyListSection[] {
  const { labelMap } = getConfiguredCategoryOrder();
  const orderMap = buildCategoryOrderMap();
  const activeProducts = dedupeBySku(products).filter(isStrictActiveProduct);

  const featuredProducts = activeProducts
    .filter((product) => isTruthyFlag(product.publishHome) || isTruthyFlag(product.PUBLICAR_HOME))
    .slice(0, WEEKLY_LIST_CONFIG.featuredLimit);

  const featuredSkus = new Set(featuredProducts.map((product) => (product.sku || '').trim().toUpperCase()));
  const grouped = new Map<string, Product[]>();

  for (const product of activeProducts) {
    const skuKey = (product.sku || '').trim().toUpperCase();
    if (featuredSkus.has(skuKey)) continue;

    const categoryKey = canonicalCategoryKey(product.category || 'sin-categoria');
    const list = grouped.get(categoryKey) ?? [];
    list.push(product);
    grouped.set(categoryKey, list);
  }

  const sections: WeeklyListSection[] = Array.from(grouped.entries()).map(([categoryKey, categoryProducts]) => {
    const sortedProducts = [...categoryProducts].sort((a, b) => {
      const groupRankA = getGroupSortRank(categoryKey, a);
      const groupRankB = getGroupSortRank(categoryKey, b);

      if (groupRankA !== groupRankB) {
        return groupRankA - groupRankB;
      }

      const aPrice = parsePrice(a.price);
      const bPrice = parsePrice(b.price);

      if (aPrice !== bPrice) {
        return aPrice - bPrice;
      }

      const aName = (a.description || a.name || '').toLowerCase();
      const bName = (b.description || b.name || '').toLowerCase();
      return aName.localeCompare(bName, 'es');
    });

    const categoryLabel =
      WEEKLY_LIST_CONFIG.categoryLabels[canonicalCategoryKey(categoryKey)] ||
      labelMap.get(categoryKey) ||
      (sortedProducts[0]?.category || 'Sin categoría');

    return {
      categoryKey,
      categoryLabel,
      products: sortedProducts,
    };
  });

  sections.sort((a, b) => {
    const aOrder = orderMap.get(a.categoryKey);
    const bOrder = orderMap.get(b.categoryKey);

    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder;
    }

    if (aOrder !== undefined) return -1;
    if (bOrder !== undefined) return 1;

    return a.categoryLabel.localeCompare(b.categoryLabel, 'es');
  });

  if (featuredProducts.length === 0) {
    return sections;
  }

  return [
    {
      categoryKey: 'destacados-home',
      categoryLabel: 'Destacados de la semana',
      products: featuredProducts,
    },
    ...sections,
  ];
}
