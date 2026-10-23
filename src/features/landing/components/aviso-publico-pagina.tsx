"use client";

import Link from "next/link";
import { CalendarDays, ImageIcon } from "lucide-react";

import { useAvisosCalendario } from "@/features/comunicacion/hooks/aviso-hooks";
import { urlFlyerAviso } from "@/features/comunicacion/servicios/aviso.service";

import {
  etiquetaCategoria,
  fechasDelAviso,
  formatearFechaAviso,
} from "../aviso-publico";

export function AvisoPublicoPagina({ id }: { id: string }) {
  const avisoId = Number(id);
  const consulta = useAvisosCalendario();
  const aviso =
    consulta.data?.find((item) => item.id === avisoId) ?? null;
  const fechas = aviso ? fechasDelAviso(aviso) : null;
  const categoria = aviso ? etiquetaCategoria(aviso) : null;

  return (
    <div className="min-h-svh bg-landing text-tinta">
      <header className="border-b border-tinta/10 bg-tarjeta">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="text-sm font-semibold">
            Colegio Técnico Profesional 27 de Abril
          </Link>
          <Link
            href="/#calendario"
            className="text-sm font-medium text-oliva hover:underline"
          >
            Volver al calendario
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 py-8">
        {consulta.isLoading ? (
          <p className="text-sm text-tinta/60">Cargando el aviso…</p>
        ) : null}

        {consulta.isError || (!consulta.isLoading && !aviso) ? (
          <p className="text-sm text-tinta/70">
            No se encontró este aviso. Puede que ya no esté publicado.
          </p>
        ) : null}

        {aviso && fechas ? (
          <article className="overflow-hidden rounded-2xl bg-tarjeta shadow-sm">
            {aviso.tieneFlyer ? (
              <div className="flex items-center justify-center bg-crema px-4 py-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlFlyerAviso(aviso.id)}
                  alt={`Flyer de ${aviso.titulo}`}
                  className="max-h-[70vh] w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center bg-crema text-tinta/40">
                <ImageIcon className="size-8" />
                <span className="sr-only">Este aviso no tiene foto</span>
              </div>
            )}

            <div className="space-y-4 px-5 py-6 sm:px-8">
              {categoria ? (
                <span className="inline-flex rounded-full bg-oliva/10 px-3 py-1 text-xs font-medium text-oliva">
                  {categoria}
                </span>
              ) : null}
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {aviso.titulo}
              </h1>
              <p className="text-sm leading-relaxed whitespace-pre-line text-tinta/75">
                {aviso.descripcion}
              </p>
              <dl className="grid gap-2 text-sm text-tinta/70">
                <div className="flex flex-wrap items-center gap-2">
                  <CalendarDays className="size-4 shrink-0 text-oro" />
                  <dt className="font-medium text-tinta">
                    Fecha de la actividad
                  </dt>
                  <dd>{formatearFechaAviso(fechas.actividad)}</dd>
                </div>
                {fechas.publicacion ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <CalendarDays className="size-4 shrink-0 text-oro" />
                    <dt className="font-medium text-tinta">
                      Fecha de publicación
                    </dt>
                    <dd>{formatearFechaAviso(fechas.publicacion)}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </article>
        ) : null}
      </main>
    </div>
  );
}
