import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { ESPECIALIDADES } from "../datos-institucionales";

export function LandingEspecialidades() {
  return (
    <section id="especialidades" className="scroll-mt-20 bg-landing py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-malva">
            Especialidades
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-tinta sm:text-4xl">
            Nuestras especialidades técnicas
          </h2>
        </div>

        {/* Escritorio: 3 tarjetas arriba y 2 más anchas abajo, repartidas en 6 columnas */}
        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {ESPECIALIDADES.map((especialidad, indice) => (
            <li
              key={especialidad.nombre}
              className={indice >= 3 ? "lg:col-span-3" : "lg:col-span-2"}
            >
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-tinta/8 bg-tarjeta shadow-[0_10px_30px_-22px_rgba(37,38,36,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_50px_-24px_rgba(37,38,36,0.38)]">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={especialidad.foto}
                    alt={especialidad.fotoAlt}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-tinta/25 via-transparent to-transparent"
                  />
                  <div
                    className="absolute bottom-4 left-4 flex size-11 items-center justify-center rounded-2xl bg-tarjeta/90 shadow-sm backdrop-blur"
                    aria-hidden
                  >
                    <especialidad.icono className="size-5" style={{ color: especialidad.acento }} />
                  </div>
                </div>

                <div className="flex flex-1 items-start justify-between gap-4 p-6">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-snug tracking-tight text-tinta">
                      {especialidad.nombre}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-tinta/60">
                      {especialidad.descripcion}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-tinta/10 text-tinta/45 transition-all duration-300 group-hover:border-oliva/30 group-hover:bg-oliva group-hover:text-sobre-oliva"
                  >
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px" />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
