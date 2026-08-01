import { siteConfig } from '@/config/siteData';

export default function Team() {
  const { team } = siteConfig;

  return (
    <section className="bg-white px-6 py-6 md:py-8 lg:px-8 lg:py-9">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-center lg:gap-6">
          {/* Imagen - lado izquierdo en desktop */}
          <div className="order-2 lg:order-1">
            <div className="relative h-56 overflow-hidden rounded-xl sm:h-64 lg:h-72 lg:rounded-lg">
              <img
                src="/images/team/team.jpg"
                alt="Equipo de Betech Boutique"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Contenido - lado derecho en desktop */}
          <div className="order-1 lg:order-2 flex flex-col justify-center">
            <h2 className="max-w-xl text-[1.9rem] font-semibold leading-tight tracking-tight text-stone-900 lg:text-[2.05rem]">
              {team.title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </h2>

            <p className="mt-3 max-w-lg text-base leading-relaxed text-stone-600">
              {team.description}
            </p>
            <a
              href="https://wa.me/5491136327076?text=Hola!%20Me%20gustar%C3%ADa%20recibir%20asesoramiento%20para%20elegir%20un%20producto."
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block w-full rounded-sm bg-emerald-600 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-700 sm:w-fit"
            >
              {team.ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
