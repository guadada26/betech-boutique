import {
  getCategoryBannerBackgroundSize,
  getCategoryBannerFocus,
  getCategoryBannerHeightClasses,
  getCategoryBannerSrc,
} from '@/config/categoryBanners';

type CategoryBannerProps = {
  slug: string;
  name: string;
  title?: string;
  subtitle?: string;
  bannerSrc?: string | null;
  focus?: string;
};

export default function CategoryBanner({ slug, name, title, subtitle, bannerSrc, focus }: CategoryBannerProps) {
  const src = bannerSrc !== undefined ? bannerSrc : getCategoryBannerSrc(slug);
  const imageFocus = focus || getCategoryBannerFocus(slug);
  const heightClasses = getCategoryBannerHeightClasses(slug);
  const backgroundSize = getCategoryBannerBackgroundSize(slug);

  if (src) {
    return (
      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
        <div
          role="img"
          aria-label={name}
          className={`relative w-full bg-cover bg-center ${heightClasses}`}
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: imageFocus,
            backgroundRepeat: 'no-repeat',
            backgroundSize,
          }}
        />
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-stone-200 bg-gradient-to-r from-stone-100 to-stone-200 p-6 sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{title || name}</h2>
      {subtitle ? <p className="mt-2 text-sm text-stone-600 sm:text-base">{subtitle}</p> : null}
    </section>
  );
}
