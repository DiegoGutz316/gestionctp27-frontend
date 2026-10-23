"use client";

import Link from "next/link";
import { CalendarDays, Home, Leaf, Sprout } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { formatearCantidadConUnidad } from "@/features/agricola/cosecha/models/cosecha.model";
import {
  ETIQUETA_ACTIVIDAD,
  ETIQUETA_TIPO_TRATAMIENTO,
  ETIQUETA_UNIDAD_TRATAMIENTO,
} from "@/features/agricola/tratamiento/models/tratamiento.model";

import { useDetalleSiembra } from "../hooks/siembra-hooks";
import {
  ETIQUETA_UNIDAD_SIEMBRA,
  formatearCantidad,
  formatearFecha,
} from "../models/siembra.model";
import { getMensajeDeError } from "../servicios/siembra.service";

/**
 * El ciclo de una siembra en una sola pantalla.
 *
 * La huerta se piensa por ciclo: en la cama C-01 se siembra lechuga, se riega,
 * se trata y se cosecha. Al cerrarlo la cama queda libre, pero este historial
 * se conserva.
 */
export function SiembraDetalle({ id }: { id: number }) {
  const consulta = useDetalleSiembra(id);

  if (consulta.isPending) {
    return (
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </section>
    );
  }

  if (consulta.isError || !consulta.data) {
    return (
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
        <Card>
          <CardContent className="py-16 text-center text-sm whitespace-normal text-destructive">
            {getMensajeDeError(consulta.error)}
          </CardContent>
        </Card>
      </section>
    );
  }

  const { siembra, cuidados, cosechas, produccion, cuidadosPorActividad } =
    consulta.data;
  const activa = siembra.finalizadaEn === null;

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
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
            <BreadcrumbLink render={<Link href="/dashboard/agricola/siembras" />}>
              Siembras
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{siembra.tipoCultivo}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Sprout className="size-5 text-muted-foreground" />
            {siembra.tipoCultivo}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Cama {siembra.cama.codigo} · {siembra.cama.ubicacion}
          </p>
        </div>

        <Badge variant={activa ? "default" : "secondary"}>
          {activa ? "Ciclo activo" : "Ciclo finalizado"}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Dato titulo="Se sembró">
          {formatearCantidad(siembra.cantidadSembrada)}{" "}
          {ETIQUETA_UNIDAD_SIEMBRA[siembra.unidadSembrada]}
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
            {formatearFecha(siembra.fechaSiembra)}
          </span>
        </Dato>

        <Dato titulo="Se cosechó">
          {produccion.length === 0
            ? "Nada todavía"
            : produccion
                .map((total) =>
                  formatearCantidadConUnidad(total.cantidad, total.unidadMedida),
                )
                .join(" · ")}
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
            {cosechas.length === 1
              ? "1 recolección"
              : `${cosechas.length} recolecciones`}
          </span>
        </Dato>

        <Dato titulo="Cuidados">
          {cuidados.length}
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
            {cuidadosPorActividad.length === 0
              ? "Ninguno registrado"
              : cuidadosPorActividad
                  .map(
                    (conteo) =>
                      `${conteo.cantidad} ${ETIQUETA_ACTIVIDAD[conteo.actividad].toLowerCase()}`,
                  )
                  .join(" · ")}
          </span>
        </Dato>
      </div>

      <Historial
        titulo="Cuidados"
        icono={<Leaf className="size-4 text-muted-foreground" />}
        vacio="Todavía no se registran cuidados en esta siembra."
        filas={cuidados.map((cuidado) => ({
          id: `cuidado-${cuidado.id}`,
          fecha: cuidado.fecha,
          titulo: ETIQUETA_ACTIVIDAD[cuidado.actividad],
          detalle: cuidado.producto
            ? `${cuidado.tipo ? `${ETIQUETA_TIPO_TRATAMIENTO[cuidado.tipo]}: ` : ""}${cuidado.producto}${
                cuidado.cantidad !== null && cuidado.unidad
                  ? ` · ${formatearCantidad(cuidado.cantidad)} ${ETIQUETA_UNIDAD_TRATAMIENTO[cuidado.unidad]}`
                  : ""
              }`
            : null,
          observaciones: cuidado.observaciones,
        }))}
      />

      <Historial
        titulo="Cosechas"
        icono={<Sprout className="size-4 text-muted-foreground" />}
        vacio="Todavía no se registran cosechas en esta siembra."
        filas={cosechas.map((cosecha) => ({
          id: `cosecha-${cosecha.id}`,
          fecha: cosecha.fecha,
          titulo: formatearCantidadConUnidad(
            cosecha.cantidadObtenida,
            cosecha.unidadMedida,
          ),
          detalle: null,
          observaciones: cosecha.observaciones,
        }))}
      />
    </section>
  );
}

function Dato({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          {titulo}
        </p>
        <p className="mt-1 text-lg font-semibold">{children}</p>
      </CardContent>
    </Card>
  );
}

type FilaHistorial = {
  id: string;
  fecha: string;
  titulo: string;
  detalle: string | null;
  observaciones: string | null;
};

function Historial({
  titulo,
  icono,
  vacio,
  filas,
}: {
  titulo: string;
  icono: React.ReactNode;
  vacio: string;
  filas: FilaHistorial[];
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        {icono}
        {titulo}
        <span className="font-normal text-muted-foreground">
          ({filas.length})
        </span>
      </h2>

      {filas.length === 0 ? (
        <Card className="mt-3">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {vacio}
          </CardContent>
        </Card>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {filas.map((fila) => (
            <li key={fila.id}>
              <Card>
                <CardContent className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="font-medium">{fila.titulo}</p>
                    {fila.detalle ? (
                      <p className="text-sm text-muted-foreground">
                        {fila.detalle}
                      </p>
                    ) : null}
                    {fila.observaciones?.trim() ? (
                      <p className="mt-0.5 text-sm whitespace-pre-line text-muted-foreground">
                        {fila.observaciones}
                      </p>
                    ) : null}
                  </div>

                  <span className="flex shrink-0 items-center gap-1.5 text-sm whitespace-nowrap text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {formatearFecha(fila.fecha)}
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
