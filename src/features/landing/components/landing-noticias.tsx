"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAvisosPublicos } from "@/features/comunicacion/hooks/aviso-hooks";
import { getMensajeDeError, urlFlyerAviso } from "@/features/comunicacion/servicios/aviso.service";
import type { AvisoPublico } from "@/features/comunicacion/validacion/aviso.validacion";

import {
  categoriaDeAviso,
  type FiltroAviso,
  prepararAvisosPublicos,
} from "../aviso-publico";
import { AvisoPublicoDialog } from "./aviso-publico-dialog";

const AVISOS_INICIALES = 6;

const FILTROS: { id: FiltroAviso; etiqueta: string }[] = [
  { id: "TODOS", etiqueta: "Todos" },
  { id: "ACADEMICOS", etiqueta: "Académicos" },
  { id: "EVENTOS", etiqueta: "Eventos" },
  { id: "COMUNIDAD", etiqueta: "Comunidad" },
  { id: "ADMINISTRATIVOS", etiqueta: "Administrativos" },
];

export function LandingNoticias() {
  const [filtro, setFiltro] = useState<FiltroAviso>("TODOS");
  const consulta = useAvisosPublicos(filtro === "TODOS" ? undefined : filtro);
  const [verTodos, setVerTodos] = useState(false);
  const [avisoAbierto, setAvisoAbierto] = useState<AvisoPublico | null>(null);

  const avisos = prepararAvisosPublicos(consulta.data ?? []);
  const filtrados =
    filtro === "TODOS"
      ? avisos
      : avisos.filter((aviso) => categoriaDeAviso(aviso) === filtro);
  const visibles = verTodos ? filtrados : filtrados.slice(0, AVISOS_INICIALES);
  const hayMas = filtrados.length > visibles.length;

  const estado = consulta.isPending
    ? "cargando"
    : consulta.isError
      ? "error"
      : filtrados.length === 0
        ? filtro === "TODOS"
          ? "vacio"
          : "filtro-vacio"
        : "datos";

  return (
    <section id="avisos" className="bg-[#F7F5F0] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#52634D] text-[#F7F5F0]">
            <Megaphone className="size-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#252624] sm:text-4xl">
              Avisos Institucionales
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#252624]/60 sm:text-base">
              Mantente al día con las noticias, eventos y comunicados de
              nuestra institución
            </p>
          </div>
        </div>

        <div
          className="mt-8 max-w-full overflow-x-auto scrollbar-none"
          role="group"
          aria-label="Filtrar avisos por categoría"
        >
          <div className="flex w-max gap-2 pb-1">
            {FILTROS.map((item) => {
              const activo = filtro === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => {
                    setFiltro(item.id);
                    setVerTodos(false);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52634D]/40 ${
                    activo
                      ? "bg-[#52634D] text-[#F7F5F0]"
                      : "bg-[#ECEAE4] text-[#252624]/75 hover:bg-[#E3E0D8]"
                  }`}
                >
                  {item.etiqueta}
                </button>
              );
            })}
          </div>
        </div>

        {estado === "cargando" ? <MuralEsqueleto /> : null}

        {estado === "error" ? (
          <div className="mt-10 rounded-2xl bg-white px-6 py-16 text-center shadow-[0_10px_30px_-24px_rgba(37,38,36,0.6)]">
            <p className="text-sm text-[#252624]/70">
              {getMensajeDeError(consulta.error)}
            </p>
            <Button
              type="button"
              className="mt-5 rounded-full bg-[#52634D] text-[#F7F5F0] hover:bg-[#52634D]/90"
              disabled={consulta.isFetching}
              onClick={() => void consulta.refetch()}
            >
              Reintentar
            </Button>
          </div>
        ) : null}

        {estado === "vacio" ? (
          <div className="mt-10 flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center shadow-[0_10px_30px_-24px_rgba(37,38,36,0.6)]">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#F7F5F0] text-[#52634D]">
              <Megaphone className="size-5" aria-hidden />
            </div>
            <p className="mt-4 max-w-md text-sm text-[#252624]/70">
              Por el momento no hay avisos institucionales disponibles
            </p>
          </div>
        ) : null}

        {estado === "filtro-vacio" ? (
          <div className="mt-10 flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center shadow-[0_10px_30px_-24px_rgba(37,38,36,0.6)]">
            <p className="max-w-md text-sm text-[#252624]/70">
              No hay avisos disponibles en esta categoría
            </p>
          </div>
        ) : null}

        {estado === "datos" ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibles.map((aviso) => (
                <TarjetaAviso
                  key={aviso.id}
                  aviso={aviso}
                  onAbrir={() => setAvisoAbierto(aviso)}
                />
              ))}
            </div>

            {hayMas ? (
              <div className="mt-10 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-[#52634D]/25 bg-white px-6 text-[#52634D] hover:bg-[#52634D] hover:text-[#F7F5F0]"
                  onClick={() => setVerTodos(true)}
                >
                  Ver todos los avisos
                </Button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <AvisoPublicoDialog
        aviso={avisoAbierto}
        onCerrar={() => setAvisoAbierto(null)}
      />
    </section>
  );
}

function TarjetaAviso({
  aviso,
  onAbrir,
}: {
  aviso: AvisoPublico;
  onAbrir: () => void;
}) {
  const [flyerRoto, setFlyerRoto] = useState(false);
  const mostrarFlyer = aviso.tieneFlyer && !flyerRoto;

  return (
    <button
      type="button"
      onClick={onAbrir}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_12px_32px_-26px_rgba(37,38,36,0.7)] ring-1 ring-[#252624]/8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-24px_rgba(37,38,36,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52634D]/40"
    >
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-white">
        {mostrarFlyer ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={urlFlyerAviso(aviso.id)}
            alt={`Flyer de ${aviso.titulo}`}
            className="absolute inset-0 h-full w-full object-contain p-3"
            onError={() => setFlyerRoto(true)}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#F7F5F0] text-[#52634D]">
              <Megaphone className="size-6" aria-hidden />
            </span>
          </span>
        )}
      </div>
      <div className="border-t border-[#252624]/6 px-4 py-3.5">
        <p className="line-clamp-2 text-sm font-medium text-[#252624]">
          {aviso.titulo}
        </p>
      </div>
    </button>
  );
}

function MuralEsqueleto() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: AVISOS_INICIALES }).map((_, indice) => (
        <div
          key={`esqueleto-aviso-${indice}`}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#252624]/8"
        >
          <Skeleton className="aspect-[3/4] w-full rounded-none" />
          <div className="px-4 py-3.5">
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
