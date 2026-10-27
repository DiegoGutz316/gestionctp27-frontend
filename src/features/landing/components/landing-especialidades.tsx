"use client";

import { ArrowUpRight } from "lucide-react";

import { ESPECIALIDADES } from "../datos-institucionales";
import { ICONO_LUCIDE } from "../especialidades/models/especialidad.model";
import { useEspecialidadesPublicas } from "../especialidades/hooks/hooks";
import { urlFotoVisible } from "../especialidades/servicios/especialidad.service";
import type { EspecialidadRespuesta } from "../especialidades/validacion/especialidad.validacion";
import { BotonEscuchar } from "./boton-escuchar";

type Tarjeta = {
  id: string | number;
  nombre: string;
  descripcion: string;
  acento: string;
  foto: string;
  fotoAlt: string;
  posicionFoto?: string | null;
  Icono: (typeof ICONO_LUCIDE)[keyof typeof ICONO_LUCIDE];
};

function desdeApi(item: EspecialidadRespuesta): Tarjeta {
  return {
    id: item.id,
    nombre: item.nombre,
    descripcion: item.descripcion,
    acento: item.acento,
    foto: urlFotoVisible(item),
    fotoAlt: item.fotoAlt || item.nombre,
    posicionFoto: item.posicionFoto,
    Icono: ICONO_LUCIDE[item.icono],
  };
}

function desdeEstaticas(): Tarjeta[] {
  return ESPECIALIDADES.map((item, indice) => ({
    id: `estatico-${indice}`,
    nombre: item.nombre,
    descripcion: item.descripcion,
    acento: item.acento,
    foto: item.foto,
    fotoAlt: item.fotoAlt,
    posicionFoto: item.posicionFoto,
    Icono: item.icono,
  }));
}

export function LandingEspecialidades() {
  const consulta = useEspecialidadesPublicas();
  const tarjetas =
    consulta.data && consulta.data.length > 0
      ? consulta.data.map(desdeApi)
      : desdeEstaticas();

  return (
    <section
      id="especialidades"
      aria-labelledby="especialidades-titulo"
      className="scroll-mt-20 bg-landing py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-malva">
            Especialidades
          </span>
          <h2
            id="especialidades-titulo"
            className="mt-3 text-3xl font-semibold tracking-tight text-tinta sm:text-4xl"
          >
            Nuestras especialidades técnicas
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {tarjetas.map((especialidad, indice) => (
            <li
              key={especialidad.id}
              className={indice >= 3 ? "lg:col-span-3" : "lg:col-span-2"}
            >
              <article
                id={`especialidad-${indice}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-tinta/8 bg-tarjeta shadow-[0_10px_30px_-22px_rgba(37,38,36,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_50px_-24px_rgba(37,38,36,0.38)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={especialidad.foto}
                    alt={especialidad.fotoAlt}
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    style={
                      especialidad.posicionFoto
                        ? { objectPosition: especialidad.posicionFoto }
                        : undefined
                    }
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-tinta/25 via-transparent to-transparent"
                  />
                  <div
                    className="absolute bottom-4 left-4 flex size-11 items-center justify-center rounded-2xl bg-tarjeta/90 shadow-sm backdrop-blur"
                    aria-hidden
                  >
                    <especialidad.Icono
                      className="size-5"
                      style={{ color: especialidad.acento }}
                    />
                  </div>
                  <BotonEscuchar
                    etiqueta={especialidad.nombre}
                    objetivo={`especialidad-${indice}`}
                    className="absolute right-4 bottom-4 bg-tarjeta/90 shadow-sm backdrop-blur hover:bg-tarjeta"
                  />
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
