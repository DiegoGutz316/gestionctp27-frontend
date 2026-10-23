"use client";

import Link from "next/link";
import { CalendarDays, Home, ImageIcon, Pencil } from "lucide-react";

import { AccionFlotante } from "@/components/accion-flotante";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { formatearFecha } from "@/features/agricola/siembra/models/siembra.model";

import { formatearFechaPublicacion } from "../fecha-aviso";
import { useAviso, useSrcFlyer } from "../hooks/aviso-hooks";
import {
  ETIQUETA_CATEGORIA_AVISO,
  ETIQUETA_ESTADO_AVISO,
} from "../validacion/aviso.validacion";

export function AvisoDetalle({ id }: { id: string }) {
  const avisoId = Number(id);
  const aviso = useAviso(avisoId);
  const datos = aviso.data ?? null;
  const srcFlyer = useSrcFlyer(datos?.tieneFlyer ? datos : null);

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/dashboard" />}
              className="flex items-center gap-1.5"
            >
              <Home className="size-3.5" />
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/dashboard/comunicacion/avisos" />}
            >
              Avisos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{datos?.titulo ?? "Detalle"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {aviso.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : null}

      {aviso.isError || (!aviso.isLoading && !datos) ? (
        <p className="text-sm text-destructive">
          No se pudo cargar el aviso. Verifique el identificador o la conexión
          con el servidor.
        </p>
      ) : null}

      {datos ? (
        <article className="overflow-hidden rounded-xl border bg-card shadow-sm">
          {srcFlyer ? (
            <div className="flex items-center justify-center bg-muted/40 px-4 py-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={srcFlyer}
                alt={`Flyer de ${datos.titulo}`}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center bg-muted/40 text-muted-foreground">
              <ImageIcon className="size-8" />
              <span className="sr-only">Este aviso no tiene foto</span>
            </div>
          )}

          <div className="space-y-4 px-5 py-5">
            <Badge
              variant="secondary"
              className={
                datos.estado === "ACTIVO"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }
            >
              {ETIQUETA_ESTADO_AVISO[datos.estado]}
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight">
              {datos.titulo}
            </h1>
            <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">
              {datos.descripcion}
            </p>
            <dl className="grid gap-2 text-sm text-muted-foreground">
              <div className="flex flex-wrap items-center gap-2">
                <dt className="font-medium text-foreground">Categoría</dt>
                <dd>
                  {datos.categoria
                    ? ETIQUETA_CATEGORIA_AVISO[datos.categoria]
                    : "Sin categoría"}
                </dd>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <CalendarDays className="size-4 text-primary" />
                <dt className="font-medium text-foreground">Fecha del aviso</dt>
                <dd>{formatearFecha(datos.fecha)}</dd>
              </div>
              {datos.creadoEn ? (
                <div className="flex flex-wrap items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  <dt className="font-medium text-foreground">
                    Fecha de publicación
                  </dt>
                  <dd>{formatearFechaPublicacion(datos.creadoEn)}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </article>
      ) : null}

      {datos ? (
        <MostrarSiPuede modulo="REPORTES" nivel="COMPLETO">
          <AccionFlotante
            href={`/dashboard/comunicacion/avisos/${datos.id}/editar`}
            etiqueta="Editar aviso"
            icono={<Pencil className="size-6" />}
          />
        </MostrarSiPuede>
      ) : null}
    </section>
  );
}
