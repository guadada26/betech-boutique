import Link from 'next/link';
import { notFound } from 'next/navigation';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getProductBySku } from '@/services/boutiqueApi';
import RequestProductButton from '@/components/RequestProductButton';
import {
  getProductImageAlt,
  getProductImageCandidatePathsBySku,
  getProductPlaceholderPath,
} from '@/lib/productImage';

type ProductDetailPageProps = {
  params: Promise<{ sku: string }>;
};

function formatPrice(currency: string, price: number): string {
  if (typeof price !== 'number' || Number.isNaN(price)) {
    return 'Consultar precio';
  }

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency || 'ARS',
    maximumFractionDigits: 0,
  }).format(price);
}

function normalizeText(value?: string | null): string {
  return (value || '').trim();
}

function splitList(value?: string): string[] {
  if (!value) return [];
  return value
    .split(/[;,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getProductDetailHref(sku: string): string {
  return `/producto/${encodeURIComponent(sku)}`;
}

function resolveFirstExistingImagePath(candidates: string[]): string {
  for (const candidate of candidates) {
    if (!candidate.startsWith('/')) continue;

    const filePath = join(process.cwd(), 'public', candidate.replace(/^\//, ''));
    if (existsSync(filePath)) {
      return candidate;
    }
  }

  return getProductPlaceholderPath();
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { sku } = await params;
  const decodedSku = decodeURIComponent(sku || '');

  const product = await getProductBySku(decodedSku);
  if (!product) {
    notFound();
  }

  const brand = normalizeText(product.brand);
  const description = normalizeText(product.description || product.name);
  const normalizedSku = normalizeText(product.sku);
  const descriptionExtended = normalizeText(product.descriptionExtended);
  const colors = splitList(product.availableColors);
  const measurements = normalizeText(product.measurements);

  const imageSrc = resolveFirstExistingImagePath(
    getProductImageCandidatePathsBySku(product.sku)
  );

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-5 text-xs text-stone-500">
          <Link href="/" className="hover:text-stone-800 transition">Inicio</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/#categorias" className="hover:text-stone-800 transition">Categorías</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-stone-700">{normalizedSku || 'Producto'}</span>
        </nav>

        <section className="grid gap-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:grid-cols-[minmax(320px,420px)_1fr] lg:gap-8 lg:p-7">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white">
              <img
                src={imageSrc}
                alt={getProductImageAlt(product.name, product.description)}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-4">
            {brand ? <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{brand}</p> : null}

            {description ? (
              <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{description}</h1>
            ) : null}

            {normalizedSku ? (
              <p className="text-xs uppercase tracking-wide text-stone-400">SKU: {normalizedSku}</p>
            ) : null}

            <p className="text-4xl font-extrabold leading-none text-stone-900">
              {formatPrice(product.currency, product.price)}
            </p>

            <RequestProductButton
              sku={product.sku}
              descriptionCommercial={product.description || product.name}
              currency={product.currency}
              price={product.price}
              productUrl={getProductDetailHref(product.sku)}
              className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-700 px-8 text-sm font-semibold text-white transition-all duration-200 ease-out hover:brightness-95"
            />

            {descriptionExtended ? (
              <section className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <h2 className="text-sm font-semibold text-stone-900">Descripción ampliada</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">{descriptionExtended}</p>
              </section>
            ) : null}

            {colors.length > 0 ? (
              <section className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <h2 className="text-sm font-semibold text-stone-900">Colores disponibles</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <li
                      key={color}
                      className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs text-stone-700"
                    >
                      {color}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {measurements ? (
              <section className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <h2 className="text-sm font-semibold text-stone-900">Medidas</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">{measurements}</p>
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
