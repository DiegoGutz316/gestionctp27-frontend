"use client";

import Link from "next/link";
import { Home } from "lucide-react";
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

      <div className="overflow-x-auto rounded-xl border bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Asiento
              </TableHead>
              <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Fecha
              </TableHead>
              <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                N.º factura
              </TableHead>
              <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Descripción
              </TableHead>
              <TableHead className="py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Ingresos
              </TableHead>
              <TableHead className="py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Egresos
              </TableHead>
              <TableHead className="py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Saldo
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-muted/20">
              <TableCell className="py-3 text-muted-foreground">—</TableCell>
              <TableCell className="py-3 text-muted-foreground">
                {formatearFechaPeriodo(datos.periodo.fechaInicio)}
              </TableCell>
              <TableCell />
              <TableCell className="py-3 font-medium">Fondo inicial</TableCell>
              <TableCell />
              <TableCell />
              <TableCell className="text-right tabular-nums">
                {formatearColones(datos.fondoInicial)}
              </TableCell>
            </TableRow>

            {datos.asientos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Todavía no hay ingresos ni egresos en este departamento.
                </TableCell>
              </TableRow>
            ) : null}

            {datos.asientos.map((asiento) => (
              <TableRow
                key={asiento.id}
                className="transition-colors hover:bg-muted/30"
              >
                <TableCell className="py-3 tabular-nums">
                  {asiento.numero}
                </TableCell>
                <TableCell className="py-3">
                  {formatearFechaPeriodo(asiento.fecha)}
                </TableCell>
                <TableCell className="py-3">
                  {asiento.numeroFactura || "—"}
                </TableCell>
                <TableCell className="py-3">{asiento.descripcion}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {celdaMonto(asiento.ingresos)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {celdaMonto(asiento.egresos)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatearColones(asiento.saldo)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="py-3 font-semibold">
                Totales
              </TableCell>
              <TableCell className="text-right tabular-nums font-semibold">
                {formatearColones(datos.totales.ingresos)}
              </TableCell>
              <TableCell className="text-right tabular-nums font-semibold">
                {formatearColones(datos.totales.egresos)}
              </TableCell>
              <TableCell className="text-right tabular-nums font-semibold">
                {formatearColones(datos.totales.saldo)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}
