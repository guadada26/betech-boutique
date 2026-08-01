import { siteConfig } from '@/config/siteData';
import { cookies } from 'next/headers';
import { CATALOG_PROFILE_COOKIE, isResellerProfileAuthorized, RESELLER_AUTH_COOKIE } from '@/lib/catalogProfile';

export default function Hero() {
  const profileCookie = cookies().get(CATALOG_PROFILE_COOKIE)?.value;
  const authCookie = cookies().get(RESELLER_AUTH_COOKIE)?.value;
  const secret = (process.env.RESELLER_AUTH_SECRET || process.env.RESELLER_ACCESS_KEY || '').trim();
  const isReseller = isResellerProfileAuthorized(profileCookie, authCookie, secret);
  const hero = isReseller ? siteConfig.heroResellers || siteConfig.hero : siteConfig.hero;

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full md:h-[72svh] md:min-h-[26rem] md:max-h-[44rem] lg:h-screen lg:max-h-none">
        <img
          src={hero.image.mobile}
          alt={hero.image.alt}
          className="block w-full h-auto sm:hidden"
        />
        <img
          src={hero.image.desktop}
          alt={hero.image.alt}
          className="absolute inset-0 hidden h-full w-full object-cover sm:block"
        />
        {/* Overlay muy suave - solo para mejorar legibilidad de botones */}
        <div className="absolute inset-0 hidden bg-gradient-to-t from-black/25 via-transparent to-transparent sm:block" />

        {/* Botones - posicionados en la zona inferior del hero como muestra la referencia */}
        <div className="absolute bottom-5 left-0 right-0 z-10 hidden flex-col items-center gap-2.5 px-6 sm:bottom-16 sm:flex sm:flex-row sm:justify-center sm:gap-4 lg:bottom-20 lg:px-8">
          {/* Botón primario - claro */}
          <a
            href={hero.cta1.href}
            className="rounded-sm border-2 border-white bg-white px-6 py-2.5 text-xs font-semibold text-stone-900 uppercase tracking-wide transition hover:bg-stone-100 sm:px-8 sm:py-3 sm:text-sm"
          >
            {hero.cta1.text}
          </a>

          {/* Botón secundario - transparente con borde */}
          <a
            href={hero.cta2.href}
            className="rounded-sm border-2 border-white px-6 py-2.5 text-xs font-semibold text-white uppercase tracking-wide transition hover:bg-white/10 sm:px-8 sm:py-3 sm:text-sm"
          >
            {hero.cta2.text}
          </a>
        </div>
      </div>
    </section>
  );
}
