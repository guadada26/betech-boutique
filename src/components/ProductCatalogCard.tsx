'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/types/product';
import RequestProductButton from '@/components/RequestProductButton';
import {
  getProductImageAlt,
  getProductImageCandidatePathsBySku,
} from '@/lib/productImage';

function formatPrice(currency: string, price: number) {
  if (typeof price !== 'number' || Number.isNaN(price)) {
    return 'Consultar precio';
  }

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency || 'ARS',
    maximumFractionDigits: 0,
  }).format(price);
}

function getProductDetailHref(sku: string): string {
  return `/producto/${encodeURIComponent(sku)}`;
}

type ProductCatalogCardProps = {
  product: Product;
};

export default function ProductCatalogCard({ product }: ProductCatalogCardProps) {
  return (
    <article
      key={product.sku}
      className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
    >
      <Link href={getProductDetailHref(product.sku)} className="block">
        <div className="relative aspect-[4/3] bg-stone-50 p-3">
          <ProductCardImage product={product} />
        </div>
      </Link>

      <div className="space-y-1 p-3.5">
        <p className="text-[10px] uppercase tracking-wide text-stone-400">{product.sku}</p>
        <Link href={getProductDetailHref(product.sku)} className="block">
          <p className="line-clamp-2 text-xs text-stone-600 hover:text-stone-800 transition-colors">
            {product.description || 'Sin descripción'}
          </p>
        </Link>
        <p className="pt-0.5 text-[2rem] font-extrabold leading-none text-stone-900">
          {formatPrice(product.currency, product.price)}
        </p>
        <div>
          <Link
            href={getProductDetailHref(product.sku)}
            className="text-xs font-medium text-stone-600 underline-offset-2 transition-colors hover:text-stone-900 hover:underline"
          >
            Ver detalle
          </Link>
        </div>
        <div className="pt-1">
          <RequestProductButton
            sku={product.sku}
            descriptionCommercial={product.description || product.name}
            currency={product.currency}
            price={product.price}
            productUrl={getProductDetailHref(product.sku)}
            className="mx-auto block h-9 w-[70%] rounded-full bg-emerald-700 px-4 py-1.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:brightness-95"
          />
        </div>
      </div>
    </article>
  );
}

function ProductCardImage({ product }: { product: Product }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const sources = getProductImageCandidatePathsBySku(product.sku);
  const src = sources[srcIndex] || null;
  const shouldRenderImage = !!src;

  return (
    <div className="h-full w-full rounded-xl bg-white">
      {shouldRenderImage ? (
        <img
          src={src}
          alt={getProductImageAlt(product.name, product.description)}
          className="h-full w-full object-contain"
          onError={() => {
            setSrcIndex((current) => {
              if (current < sources.length - 1) {
                return current + 1;
              }
              return current;
            });
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-[11px] text-stone-400">
          Imagen no disponible
        </div>
      )}
    </div>
  );
}
