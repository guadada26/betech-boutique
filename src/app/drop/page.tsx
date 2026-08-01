import Link from 'next/link';
import CategoryBanner from '@/components/CategoryBanner';
import CategoryProductGrid from '@/components/CategoryProductGrid';
import Benefits from '@/components/Benefits';
import Footer from '@/components/Footer';
import { getProducts } from '@/services/boutiqueApi';
import type { Product } from '@/types/product';

function isAffirmativePublishDrop(value?: string): boolean {
  const normalized = (value || '').trim().toUpperCase();
  return ['SI', 'SÍ', 'TRUE', '1'].includes(normalized);
}

function normalizeFieldKey(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function getDropPublishValue(product: Product): string | undefined {
  const source = product as unknown as Record<string, unknown>;
  const candidates = [
    source.publishDrop,
    source.PUBLICAR_DROP,
    source.publicarDrop,
    source.Publicar_Drop,
    source.featuredHome,
    source.DESTACADO_HOME,
  ];

  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined) continue;
    const normalized = String(candidate).trim();
    if (normalized) return normalized;
  }

  const acceptedKeys = new Set(['publicardrop', 'publishdrop', 'destacadohome', 'featuredhome']);

  for (const [key, value] of Object.entries(source)) {
    if (!acceptedKeys.has(normalizeFieldKey(key))) continue;
    if (value === null || value === undefined) continue;
    const normalized = String(value).trim();
    if (normalized) return normalized;
  }

  return undefined;
}

function isPublishedForDrop(product: Product): boolean {
  return isAffirmativePublishDrop(getDropPublishValue(product));
}

function resolveDropBannerSrc(): string | null {
  return '/images/drop/editorial/drop-banner.jpeg';
}

export default async function DropPage() {
  let productsError: string | null = null;

  const allProducts = await getProducts().catch((error) => {
    productsError = error instanceof Error ? error.message : 'PRODUCTS_FETCH_FAILED';
    return [];
  });

  const dropProducts = allProducts.filter(isPublishedForDrop);
  const hasApiError = productsError !== null;
  const errorMessage = productsError ? 'No se pudieron cargar los productos del Drop.' : null;

  return (
    <>
      <main className="min-h-screen bg-stone-50 px-6 py-10 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5">
            <CategoryBanner
              slug="drop"
              name="Drop"
              title="Drop"
              subtitle="Colección especial curada desde Master."
              bannerSrc={resolveDropBannerSrc()}
              focus="50% 45%"
            />
          </div>

          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-800 transition">
              Inicio
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-stone-700">Drop</span>
          </nav>

          <div className="mb-4">
            <Link
              href="/#drop"
              className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
            >
              Volver al Home
            </Link>
          </div>

          {hasApiError ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
              <h2 className="text-lg font-medium text-amber-900">Error al cargar productos</h2>
              <p className="mt-2 text-sm text-amber-800">{errorMessage}</p>
            </section>
          ) : dropProducts.length === 0 ? (
            <section className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
              <h2 className="text-lg font-medium text-stone-900">Próximamente una nueva selección de productos.</h2>
            </section>
          ) : (
            <CategoryProductGrid
              products={dropProducts}
              showCategoryFilter
              showOrderFilter
              groupByCategory
              defaultSort="price-asc"
            />
          )}
        </div>
      </main>
      <Benefits />
      <Footer />
    </>
  );
}
