import { siteConfig } from '@/config/siteData';

export default function Benefits() {
  const { benefits } = siteConfig;

  return (
    <section className="bg-white px-6 py-8 md:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="flex flex-col rounded-xl border border-stone-200 bg-white p-4 md:rounded-none md:border-0 md:bg-transparent md:p-0">
              <div className="mb-2 text-2xl font-semibold text-emerald-600 md:mb-3 md:text-3xl">{benefit.icon}</div>
              <h3 className="text-base font-semibold text-stone-900 md:text-lg">{benefit.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-stone-600 md:text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
