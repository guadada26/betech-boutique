import Link from 'next/link';
import { siteConfig } from '@/config/siteData';

export default function Footer() {
  const { contact } = siteConfig;

  return (
    <footer className="bg-stone-900 px-6 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-10 text-stone-300 md:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" aria-label="Ir al inicio" className="inline-block">
              <p className="text-lg font-semibold tracking-widest uppercase text-white">{siteConfig.brand.name}</p>
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-stone-400">Tecnología. Diseño. Confianza.</p>
            <p className="mt-2 text-xs leading-relaxed text-stone-500">Betech® es una marca registrada de BetechStyle.</p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
              Contacto
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:+5491136327076"
                  className="text-sm hover:text-white transition"
                >
                  📞 +54 9 11 3632 7076
                </a>
              </li>
              <li>
                <a
                  href="mailto:comercial@betechstyle.com"
                  className="text-sm hover:text-white transition"
                >
                  ✉️ comercial@betechstyle.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
              Información
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-stone-300">
                <Link href="/devoluciones" className="hover:text-white transition">
                  • Devoluciones
                </Link>
              </li>
              <li className="text-sm text-stone-300">
                <Link href="/terminos-y-condiciones" className="hover:text-white transition">
                  • Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
              Seguinos
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:text-white transition"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-700 pt-6">
          <p className="text-center text-sm text-stone-400">© 2026 BetechStyle. Todos los derechos reservados.</p>
          <div className="mt-3 text-center">
            <Link
              href="/lista-semanal"
              className="text-[11px] text-stone-500 transition hover:text-stone-300"
            >
              Acceso equipo: lista semanal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
