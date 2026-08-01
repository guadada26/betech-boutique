const CATEGORY_BANNER_BY_SLUG: Record<string, string> = {
  celulares: '/images/subcategories/celulares-destop.webb.jpeg',
  tecnologia: '/images/subcategories/electronica-desktop.webb.jpeg',
  climatizacion: '/images/subcategories/climatizacion-desktop.webb.jpeg',
  cocina: '/images/categories/cocina/cover.jpeg',
  lavado: '/images/subcategories/lavado-desktop.webb.jpeg',
  'pequenos-electrodomesticos': '/images/subcategories/pequenoselectrodomesticos-desktop.webb.jpeg',
  'tv-audio': '/images/subcategories/audio-tv-desktop.webb.jpeg',
  'heladeras-freezer': '/images/subcategories/heladeras-desktop.webb.jpeg',
  bazar: '/images/subcategories/bazar-desktop.webb.jpeg',
};

const CATEGORY_BANNER_FOCUS_BY_SLUG: Record<string, string> = {
  celulares: '50% 46%',
  tecnologia: '50% 45%',
  climatizacion: '50% 46%',
  cocina: '50% 42%',
  lavado: '50% 44%',
  'pequenos-electrodomesticos': '50% 45%',
  'tv-audio': '50% 46%',
  'heladeras-freezer': '50% 46%',
  bazar: '50% 45%',
};

const CATEGORY_BANNER_HEIGHT_BY_SLUG: Record<string, string> = {
  celulares: 'h-[210px] sm:h-[235px] lg:h-[260px]',
  cocina: 'h-[215px] sm:h-[240px] lg:h-[265px]',
};

const CATEGORY_BANNER_BG_SIZE_BY_SLUG: Record<string, string> = {
  celulares: '100% auto',
  cocina: '100% auto',
};

export function getCategoryBannerSrc(slug: string): string | null {
  return CATEGORY_BANNER_BY_SLUG[slug] || null;
}

export function getCategoryBannerFocus(slug: string): string {
  return CATEGORY_BANNER_FOCUS_BY_SLUG[slug] || '50% 50%';
}

export function getCategoryBannerHeightClasses(slug: string): string {
  return CATEGORY_BANNER_HEIGHT_BY_SLUG[slug] || 'h-[240px] sm:h-[270px] lg:h-[320px]';
}

export function getCategoryBannerBackgroundSize(slug: string): string {
  return CATEGORY_BANNER_BG_SIZE_BY_SLUG[slug] || 'cover';
}
