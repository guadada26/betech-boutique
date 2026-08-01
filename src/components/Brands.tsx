import { siteConfig } from '@/config/siteData';

function getBrandLogoSrc(brandId: string): string {
  if (brandId === 'kitchenaid') return '/images/brands/KitchenAid.png';
  return `/images/brands/${brandId}.png`;
}

export default function Brands() {
  const { brands } = siteConfig;

  return (
    <section className="bg-white px-6 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex min-h-[4.75rem] items-center justify-center rounded-xl border border-stone-100 bg-white px-4 py-3 shadow-[0_1px_8px_rgba(15,23,42,0.05)] transition hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)]"
            >
              <img
                src={getBrandLogoSrc(brand.id)}
                alt={brand.name}
                className="h-10 w-full object-contain md:h-11"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
