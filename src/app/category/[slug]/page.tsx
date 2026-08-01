import Link from 'next/link';
import { getCategoryBySlug, getProductsByCategory } from '@/services/boutiqueApi';
import type { Product } from '@/types/product';
import { siteConfig } from '@/config/siteData';
import CategoryBanner from '@/components/CategoryBanner';
import CategoryProductGrid from '@/components/CategoryProductGrid';
import Benefits from '@/components/Benefits';
import Footer from '@/components/Footer';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const localCategory = [...siteConfig.categories, ...siteConfig.allCategories].find(
    (item) => item.id === slug
  );

  // Categories solo aporta metadata visual; no debe bloquear la carga de productos.
  const [category, productsResult] = await Promise.all([
    getCategoryBySlug(slug).catch(() => null),
    getProductsByCategory(slug)
      .then((products) => ({ products, error: null as string | null }))
      .catch((error) => ({
        products: [] as Product[],
        error: error instanceof Error ? error.message : 'PRODUCTS_FETCH_FAILED',
      })),
  ]);

  const categoryExists = !!category || !!localCategory;
  const isCategoryNotFound = !categoryExists;

  const productsError = categoryExists ? productsResult.error : null;
  const products = categoryExists ? productsResult.products : [];

  const categoryName = category?.name || localCategory?.name || slug.replace(/-/g, ' ');
  const hasApiError = productsError !== null && productsError !== 'CATEGORY_INVALID_SLUG';

  const errorMessage = productsError
    ? 'No se pudieron cargar los productos de esta categoría.'
    : null;

  return (
    <>
      <main className="min-h-screen bg-stone-50 px-6 py-10 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5">
            <CategoryBanner
              slug={slug}
              name={categoryName}
              title={category?.title || undefined}
              subtitle={category?.subtitle || undefined}
            />
          </div>

          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-800 transition">Inicio</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-stone-700">{categoryName}</span>
          </nav>

          <div className="mb-4">
            <Link
              href="/#categorias"
              className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
            >
              Ver todas las categorías
            </Link>
          </div>

          {hasApiError ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
              <h2 className="text-lg font-medium text-amber-900">Error al cargar productos</h2>
              <p className="mt-2 text-sm text-amber-800">{errorMessage}</p>
            </section>
          ) : isCategoryNotFound ? (
            <section className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
              <h2 className="text-lg font-medium text-stone-900">Categoría inexistente</h2>
              <p className="mt-2 text-sm text-stone-600">La categoría solicitada no está disponible.</p>
            </section>
          ) : products.length === 0 ? (
            <section className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
              <h2 className="text-lg font-medium text-stone-900">Categoría válida sin productos</h2>
              <p className="mt-2 text-sm text-stone-600">No hay productos activos publicados para esta categoría.</p>
            </section>
          ) : (
            <CategoryProductGrid products={products} />
          )}
        </div>
      </main>
      <Benefits />
      <Footer />
    </>
  );
}
