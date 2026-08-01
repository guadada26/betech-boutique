'use client';

import { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/siteData';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <>
      {/* Barra superior - negra */}
      <div className="hidden bg-stone-900 pt-[env(safe-area-inset-top)] text-stone-100 md:block">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-1.5 text-xs lg:px-8 lg:py-2 lg:text-sm">
          <div className="whitespace-nowrap" style={{ animation: 'headerTicker 26s linear infinite' }}>
            🚚 Envíos a todo el país &nbsp;&nbsp;•&nbsp;&nbsp; 💬 Atención personalizada por WhatsApp &nbsp;&nbsp;•&nbsp;&nbsp; 🚚 Envíos a todo el país &nbsp;&nbsp;•&nbsp;&nbsp; 💬 Atención personalizada por WhatsApp
          </div>
        </div>
      </div>

      {/* Header principal */}
      <header className="relative z-40 border-b border-stone-200 bg-white pt-[env(safe-area-inset-top)] md:pt-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8 lg:py-4">
          <div className="flex w-10 items-center justify-start md:w-24">
            {/* Menú hamburguesa */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col gap-1.5 md:hidden"
              aria-label="Abrir menú"
            >
              <span className={`h-0.5 w-6 bg-stone-900 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 w-6 bg-stone-900 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-6 bg-stone-900 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-center px-3">
            <Link href="/" aria-label="Ir al inicio" className="block text-center">
              {logoFailed ? (
                <>
                  <div className="text-lg font-semibold tracking-widest uppercase text-stone-900">
                    {siteConfig.brand.name}
                  </div>
                  <div className="text-[10px] tracking-[0.32em] uppercase text-stone-500 sm:text-xs">
                    {siteConfig.brand.subtitle}
                  </div>
                </>
              ) : (
                <span className="block h-11 w-[12.6rem] overflow-hidden sm:h-12 sm:w-[15rem]" aria-hidden="true">
                  <img
                    src="/logos/logo-betech-horizontal.svg"
                    alt=""
                    className="h-full w-full object-contain"
                    style={{ objectPosition: '50% 50%', transform: 'scale(1.45)' }}
                    onError={() => setLogoFailed(true)}
                  />
                </span>
              )}
            </Link>
          </div>

          {/* Acciones derecha */}
          <div className="flex w-10 items-center justify-end gap-4 md:w-24">
            {/* Buscador */}
            <button className="hidden text-stone-900 transition hover:text-stone-600 md:flex" aria-label="Buscar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* WhatsApp */}
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="hidden text-stone-900 transition hover:text-stone-600 md:flex"
              aria-label="Contactar por WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.905 1.523l-.344.214-3.558-.93 1.346 3.206-.22.224a9.75 9.75 0 001.494 5.747 9.76 9.76 0 007.589 3.785h.005c5.424 0 9.834-4.408 9.834-9.832 0-2.605-.635-5.06-1.835-7.246z" />
              </svg>
            </a>

            {/* Bolsa / Pedido */}
            <button className="flex text-stone-900 transition hover:text-stone-600" aria-label="Carrito">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Menú mobile */}
        {isMenuOpen && (
          <div className="border-t border-stone-200 bg-white px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <a href="#categorias" className="text-stone-900 transition hover:text-stone-600">
                Categorías
              </a>
              <a href="#drop" className="text-stone-900 transition hover:text-stone-600">
                Drop
              </a>
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="text-stone-900 transition hover:text-stone-600"
              >
                Contacto
              </a>
            </nav>
          </div>
        )}
      </header>

      <style jsx>{`
        @keyframes headerTicker {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
}
