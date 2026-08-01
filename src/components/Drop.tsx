import { siteConfig } from '@/config/siteData';
import Link from 'next/link';
import ProductCatalogCard from '@/components/ProductCatalogCard';
import { getProducts } from '@/services/boutiqueApi';
import type { Product } from '@/types/product';

function isAffirmativePublishHome(value?: string): boolean {
  const normalized = (value || '').trim().toUpperCase();
  return ['SI', 'SÍ', 'TRUE', '1'].includes(normalized);
}

function isAffirmativePublishDrop(value?: string): boolean {
  const normalized = (value || '').trim().toUpperCase();
  return ['SI', 'SÍ', 'TRUE', '1'].includes(normalized);
}

function getCurrencyPriority(currency: string): number {
  const normalized = (currency || '').trim().toUpperCase();
  if (normalized === 'USD') return 0;
  if (normalized === 'ARS') return 1;
  return 2;
}

function compareFeaturedProducts(a: Product, b: Product): number {
  const currencyOrder = getCurrencyPriority(a.currency) - getCurrencyPriority(b.currency);
  if (currencyOrder !== 0) return currencyOrder;

  const aPrice = typeof a.price === 'number' && !Number.isNaN(a.price) ? a.price : Number.POSITIVE_INFINITY;
  const bPrice = typeof b.price === 'number' && !Number.isNaN(b.price) ? b.price : Number.POSITIVE_INFINITY;
  if (aPrice !== bPrice) return aPrice - bPrice;

  const aDescription = (a.description || a.name || '').trim();
  const bDescription = (b.description || b.name || '').trim();
  return aDescription.localeCompare(bDescription, 'es', { sensitivity: 'base' });
}

export default async function Drop() {
  const { drop } = siteConfig;
  const allProducts = await getProducts().catch(() => []);

  const byHome = allProducts
    .filter((product) => isAffirmativePublishHome(product.publishHome || product.PUBLICAR_HOME))
    .sort(compareFeaturedProducts);

  const byDrop = allProducts
    .filter((product) => isAffirmativePublishDrop(product.publishDrop || product.PUBLICAR_DROP))
    .sort(compareFeaturedProducts);

  const orderedUnique = [...byHome, ...byDrop, ...allProducts.sort(compareFeaturedProducts)].filter(
    (product, index, arr) => arr.findIndex((candidate) => candidate.sku === product.sku) === index
  );

  const featuredProducts = orderedUnique.slice(0, 2);

  return (
    <section id="drop" className="bg-white px-6 py-6 md:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex justify-end md:mb-4">
          <Link href="/drop" className="text-sm font-medium text-stone-600 hover:text-stone-900">
            {drop.viewMoreText} →
          </Link>
        </div>

        {/* Grid: Editorial a izq, productos a derecha (desktop) */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Bloque editorial - Desktop solo */}
          <div className="hidden lg:block lg:col-span-1">
            <Link href="/drop" className="relative block h-[25rem] overflow-hidden rounded-xl group">
              {/* Imagen de fondo */}
              <img
                src={drop.editorialImage}
                alt={drop.dropNumber}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay oscuro */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              {/* Contenido */}
              <div className="relative flex h-full flex-col justify-between p-6 text-white">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500 mb-4">
                    {drop.dropNumber}
                  </p>
                  <p className="text-lg leading-relaxed whitespace-pre-line">
                    {drop.dropDescription}
                  </p>
                </div>
                <span
                  className="mt-4 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-sm text-sm font-semibold uppercase tracking-wide transition"
                >
                  {drop.ctaText}
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile: Editorial arriba, productos abajo */}
          <div className="mb-4 lg:hidden">
            <Link href="/drop" className="relative block h-[19rem] overflow-hidden rounded-2xl">
              <img
                src={drop.editorialImage}
                alt={drop.dropNumber}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
              <div className="relative flex h-full flex-col justify-between p-4 text-white">
                <div className="max-w-[80%]">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-500">
                    {drop.dropNumber}
                  </p>
                  <p className="text-base leading-relaxed whitespace-pre-line">
                    {drop.dropDescription}
                  </p>
                </div>
                <span
                  className="inline-block w-fit bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-sm text-sm font-semibold uppercase tracking-wide transition"
                >
                  {drop.ctaText}
                </span>
              </div>
            </Link>
          </div>

          {/* Productos grid */}
          <div className="lg:col-span-2">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              PRODUCTOS DESTACADOS
            </h3>
            <div className="home-featured-mobile grid gap-3 sm:grid-cols-2 sm:gap-4">
              {featuredProducts.length === 0 ? (
                <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500 sm:col-span-2">
                  Próximamente nuevos productos destacados.
                </div>
              ) : (
                featuredProducts.map((product) => <ProductCatalogCard key={product.sku} product={product} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
