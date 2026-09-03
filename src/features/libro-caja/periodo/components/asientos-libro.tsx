"use client";

import Link from "next/link";
import { Home, Printer } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import {
  formatearColones,
  formatearFechaInstante,
  formatearFechaPeriodo,
} from "@/features/libro-caja/formato";
import { ETIQUETA_ESTADO_PERIODO } from "../models/periodo.model";
import { useAsientos } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/asiento.service";
import { AsientoForm } from "./asiento-form";

function celdaMonto(monto: number): string {
  return monto > 0 ? formatearColones(monto) : "";
}

export function AsientosLibro({
  periodoId,
  fondoId,
}: {
  periodoId: number;
  fondoId: number;
}) {
  const libro = useAsientos(periodoId, fondoId);

  if (libro.isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-32 w-full" />
      </section>
    );
  }

  if (libro.isError || !libro.data) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <p className="text-sm text-destructive">
          {getMensajeDeError(libro.error)}
        </p>
      </section>
    );
  }

  const datos = libro.data;
  const abierto = datos.periodo.estado === "ABIERTO";
  const fondoListo = datos.fondo.estado === "SOLICITADO";
  const unidad = datos.fondo.departamento.nombreUnidad;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
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
            <BreadcrumbLink render={<Link href="/dashboard/libro-caja" />}>
              Libro de caja
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/dashboard/libro-caja/periodos" />}
            >
              Periodos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={
                <Link href={`/dashboard/libro-caja/periodos/${periodoId}`} />
              }
            >
              {datos.periodo.nombre}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{unidad}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-color-company">
              {unidad}
            </h1>
            <Badge
              variant="secondary"
              className={
                abierto
                  ? "rounded-full border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                  : "rounded-full border-transparent bg-muted text-muted-foreground"
              }
            >
              {ETIQUETA_ESTADO_PERIODO[datos.periodo.estado]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {datos.periodo.nombre} · {formatearFechaPeriodo(datos.periodo.fechaInicio)}{" "}
            – {formatearFechaPeriodo(datos.periodo.fechaFin)}
          </p>
        </div>
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link
              href={`/dashboard/libro-caja/periodos/${periodoId}/fondos/${fondoId}/informe`}
              prefetch={false}
            />
          }
        >
          <Printer data-icon="inline-start" />
          Generar informe
        </Button>
      </div>

      {abierto && fondoListo ? (
        <MostrarSiPuede modulo="LIBRO_CAJA" nivel="COMPLETO">
          <AsientoForm libro={datos} />
        </MostrarSiPuede>
      ) : null}

      {abierto && !fondoListo ? (
        <p className="text-sm text-muted-foreground">
          Registre el fondo inicial de este departamento antes de anotar
          asientos.
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border bg-white shadow-xs">
        <Table className="font-[Arial,Helvetica,sans-serif]">
          <TableHeader>
            <TableRow className="bg-[#ffff99] hover:bg-[#ffff99]">
              <TableCell
                colSpan={6}
                className="py-2 text-right text-sm font-bold tabular-nums"
              >
                {datos.fondo.solicitadoEn
                  ? formatearFechaInstante(datos.fondo.solicitadoEn)
                  : formatearFechaPeriodo(datos.periodo.fechaInicio)}
              </TableCell>
              <TableCell className="py-2 text-right text-sm font-bold tabular-nums">
                {formatearColones(datos.fondoInicial)}
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableHead className="border border-black py-2 text-center text-sm font-normal text-black">
                Asiento
              </TableHead>
              <TableHead className="border border-black bg-[#deeaf6] py-2 text-center text-sm font-bold text-black">
                Fecha
              </TableHead>
              <TableHead className="border border-black bg-[#deeaf6] py-2 text-center text-sm font-bold leading-tight whitespace-normal text-black">
                N<sup>o</sup> Factura/ N<sup>0</sup> Depósito
              </TableHead>
              <TableHead className="border border-black bg-[#deeaf6] py-2 text-center text-sm font-bold text-black">
                Descripción
              </TableHead>
              <TableHead className="border border-black bg-[#deeaf6] py-2 text-center text-sm font-bold text-black">
                Ingresos
              </TableHead>
              <TableHead className="border border-black bg-[#deeaf6] py-2 text-center text-sm font-bold text-black">
                Egresos
              </TableHead>
              <TableHead className="border border-black bg-[#deeaf6] py-2 text-center text-sm font-bold text-black">
                Saldo
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datos.asientos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="border border-black py-8 text-center text-sm text-muted-foreground"
                >
                  Todavía no hay ingresos ni egresos en este departamento.
                </TableCell>
              </TableRow>
            ) : null}

            {datos.asientos.map((asiento) => (
              <TableRow key={asiento.id} className="hover:bg-muted/20">
                <TableCell className="border border-black py-2 text-center tabular-nums">
                  {asiento.numero}
                </TableCell>
                <TableCell className="border border-black py-2 text-center">
                  {formatearFechaPeriodo(asiento.fecha)}
                </TableCell>
                <TableCell className="border border-black py-2 text-center">
                  {asiento.numeroFactura}
                </TableCell>
                <TableCell className="border border-black py-2 whitespace-normal">
                  {asiento.descripcion}
                </TableCell>
                <TableCell className="border border-black py-2 text-right tabular-nums">
                  {celdaMonto(asiento.ingresos)}
                </TableCell>
                <TableCell className="border border-black py-2 text-right tabular-nums">
                  {celdaMonto(asiento.egresos)}
                </TableCell>
                <TableCell className="border border-black bg-[#deeaf6] py-2 text-right tabular-nums">
                  {formatearColones(asiento.saldo)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-[#deeaf6] hover:bg-[#deeaf6]">
              <TableCell
                colSpan={4}
                className="border border-black py-2 text-center font-bold"
              >
                Totales al {formatearFechaPeriodo(datos.periodo.fechaFin)}
              </TableCell>
              <TableCell className="border border-black py-2 text-right font-bold tabular-nums">
                {formatearColones(datos.totales.ingresos)}
              </TableCell>
              <TableCell className="border border-black py-2 text-right font-bold tabular-nums">
                {formatearColones(datos.totales.egresos)}
              </TableCell>
              <TableCell className="border border-black py-2 text-right font-bold tabular-nums">
                {formatearColones(datos.totales.saldo)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}
