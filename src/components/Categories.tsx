'use client';

import { siteConfig } from '@/config/siteData';
import { useState } from 'react';
import Link from 'next/link';

type CategoryItem = {
  id: string;
  name: string;
  icon?: string;
  image?: string;
};

function CategoryCard({ category }: { category: CategoryItem }) {
  return (
    <Link
      href={`/category/${category.id}`}
      className="group relative block h-40 overflow-hidden rounded-xl sm:h-56 lg:h-60"
    >
      {category.image ? (
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300 text-stone-500">
          Imagen de {category.name}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex flex-col items-center justify-end p-3 text-center sm:p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-white sm:text-lg">
          {category.name}
        </h3>
      </div>

      <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

export default function Categories() {
  const { categories, allCategories } = siteConfig;
  const [showMore, setShowMore] = useState(false);

  return (
    <section id="categorias" className="bg-stone-50 px-6 py-6 md:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex justify-end md:mb-4">
          {!showMore ? (
            <button
              onClick={() => setShowMore(true)}
              className="text-sm font-medium text-stone-600 transition hover:text-stone-900"
            >
              Ver más →
            </button>
          ) : (
            <button
              onClick={() => setShowMore(false)}
              className="text-sm font-medium text-stone-600 transition hover:text-stone-900"
            >
              ← Volver
            </button>
          )}
        </div>

        <div className="hidden overflow-hidden md:block">
          <div
            className={`flex transition-transform duration-500 ease-in-out ${showMore ? '-translate-x-full' : 'translate-x-0'}`}
          >
            <div className="min-w-full">
              <div className="grid grid-cols-5 gap-4">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>
            <div className="min-w-full">
              <div className="grid grid-cols-4 gap-4">
                {allCategories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden md:hidden">
          <div
            className={`flex transition-transform duration-500 ease-in-out ${showMore ? '-translate-x-full' : 'translate-x-0'}`}
          >
            <div className="min-w-full">
              <div className="-mx-6 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-6 pb-3" style={{ scrollBehavior: 'smooth' }}>
                {categories.map((category) => (
                  <div key={category.id} className="w-[46vw] max-w-[10.5rem] min-w-[9.5rem] flex-shrink-0 snap-start">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </div>
            <div className="min-w-full">
              <div className="-mx-6 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-6 pb-3" style={{ scrollBehavior: 'smooth' }}>
                {allCategories.map((category) => (
                  <div key={category.id} className="w-[46vw] max-w-[10.5rem] min-w-[9.5rem] flex-shrink-0 snap-start">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
