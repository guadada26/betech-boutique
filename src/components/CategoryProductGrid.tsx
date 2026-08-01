'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/types/product';
import ProductCatalogCard from '@/components/ProductCatalogCard';

type CategoryProductGridProps = {
  products: Product[];
  showCategoryFilter?: boolean;
  showOrderFilter?: boolean;
  groupByCategory?: boolean;
  defaultSort?: 'price-asc' | 'price-desc' | 'description-asc' | 'description-desc';
};

function normalizeValue(value: string | undefined): string {
  return (value || '').trim();
}

function getSafePrice(price: number): number {
  return typeof price === 'number' && !Number.isNaN(price) ? price : Number.POSITIVE_INFINITY;
}

function compareByDescription(a: Product, b: Product): number {
  const aText = normalizeValue(a.description || a.name);
  const bText = normalizeValue(b.description || b.name);
  return aText.localeCompare(bText, 'es', { sensitivity: 'base' });
}

function toCategoryLabel(value: string | undefined): string {
  const normalized = normalizeValue(value);
  return normalized || 'Sin categoría';
}

export default function CategoryProductGrid({
  products,
  showCategoryFilter = false,
  showOrderFilter = false,
  groupByCategory = false,
  defaultSort = 'price-asc',
}: CategoryProductGridProps) {
  const [category, setCategory] = useState('all');
  const [brand, setBrand] = useState('all');
  const [subcategory, setSubcategory] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState(defaultSort);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => toCategoryLabel(p.category)).filter(Boolean))).sort(),
    [products]
  );

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => (p.brand || '').trim()).filter(Boolean))).sort(),
    [products]
  );

  const subcategories = useMemo(
    () => Array.from(new Set(products.map((p) => (p.subcategory || '').trim()).filter(Boolean))).sort(),
    [products]
  );

  const availabilityOptions = useMemo(
    () => Array.from(new Set(products.map((p) => (p.availability || '').trim()).filter(Boolean))).sort(),
    [products]
  );

  const hasAvailability = availabilityOptions.length > 0;

  const filteredProducts = useMemo(() => {
    const parsedMin = minPrice ? Number(minPrice) : null;
    const parsedMax = maxPrice ? Number(maxPrice) : null;

    const list = products.filter((product) => {
      if (showCategoryFilter && category !== 'all' && toCategoryLabel(product.category) !== category) {
        return false;
      }

      if (brand !== 'all' && (product.brand || '').trim() !== brand) {
        return false;
      }

      if (subcategory !== 'all' && (product.subcategory || '').trim() !== subcategory) {
        return false;
      }

      if (hasAvailability && availability !== 'all' && (product.availability || '').trim() !== availability) {
        return false;
      }

      if (parsedMin !== null && !Number.isNaN(parsedMin)) {
        if (typeof product.price !== 'number' || Number.isNaN(product.price) || product.price < parsedMin) {
          return false;
        }
      }

      if (parsedMax !== null && !Number.isNaN(parsedMax)) {
        if (typeof product.price !== 'number' || Number.isNaN(product.price) || product.price > parsedMax) {
          return false;
        }
      }

      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'price-desc') {
        return getSafePrice(b.price) - getSafePrice(a.price);
      }

      if (sortBy === 'description-asc') {
        return compareByDescription(a, b);
      }

      if (sortBy === 'description-desc') {
        return compareByDescription(b, a);
      }

      return getSafePrice(a.price) - getSafePrice(b.price);
    });
  }, [
    products,
    showCategoryFilter,
    category,
    brand,
    subcategory,
    availability,
    minPrice,
    maxPrice,
    hasAvailability,
    sortBy,
  ]);

  const groupedProducts = useMemo(() => {
    if (!groupByCategory) return [] as Array<[string, Product[]]>;

    const grouped = new Map<string, Product[]>();

    filteredProducts.forEach((product) => {
      const key = toCategoryLabel(product.category);
      const current = grouped.get(key) || [];
      current.push(product);
      grouped.set(key, current);
    });

    return Array.from(grouped.entries()).sort(([a], [b]) =>
      a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
  }, [filteredProducts, groupByCategory]);

  return (
    <>
      <section className="mb-4 rounded-xl border border-stone-200 bg-white p-3 sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {showCategoryFilter ? (
              <label className="text-xs text-stone-500">
                Categoría
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-800"
                >
                  <option value="all">Todas</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label className="text-xs text-stone-500">
              Marca
              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-800"
              >
                <option value="all">Todas</option>
                {brands.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs text-stone-500">
              Subcategoría
              <select
                value={subcategory}
                onChange={(event) => setSubcategory(event.target.value)}
                className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-800"
              >
                <option value="all">Todas</option>
                {subcategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <div className="text-xs text-stone-500">
              Precio
              <div className="mt-1 grid grid-cols-2 gap-2">
                <input
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="Mín"
                  inputMode="numeric"
                  className="w-full rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-800"
                />
                <input
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="Máx"
                  inputMode="numeric"
                  className="w-full rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-800"
                />
              </div>
            </div>

            {hasAvailability ? (
              <label className="text-xs text-stone-500">
                Disponibilidad
                <select
                  value={availability}
                  onChange={(event) => setAvailability(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-800"
                >
                  <option value="all">Todas</option>
                  {availabilityOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div aria-hidden="true" />
            )}
          </div>

          <div className="text-right text-xs text-stone-500">
            {showOrderFilter ? (
              <label className="inline-block text-left text-xs text-stone-500">
                Orden
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                  className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-800"
                >
                  <option value="price-asc">Precio menor a mayor</option>
                  <option value="price-desc">Precio mayor a menor</option>
                  <option value="description-asc">Descripción A-Z</option>
                  <option value="description-desc">Descripción Z-A</option>
                </select>
              </label>
            ) : (
              <>
                <p>Ordenar por</p>
                <p className="text-sm text-stone-800">Precio menor a mayor</p>
              </>
            )}
          </div>
        </div>
      </section>

      <p className="mb-4 text-xs text-stone-500">{filteredProducts.length} productos encontrados</p>

      {filteredProducts.length === 0 ? (
        <section className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <h2 className="text-lg font-medium text-stone-900">No hay productos para los filtros seleccionados</h2>
          <p className="mt-2 text-sm text-stone-600">Probá ajustando marca, subcategoría o precio.</p>
        </section>
      ) : groupByCategory ? (
        <div className="space-y-6">
          {groupedProducts.map(([categoryName, items]) => (
            <section key={categoryName}>
              <h2 className="mb-3 text-lg font-semibold text-stone-900">{categoryName}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((product) => (
                  <ProductCatalogCard key={product.sku} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCatalogCard key={product.sku} product={product} />
          ))}
        </section>
      )}
    </>
  );
}
