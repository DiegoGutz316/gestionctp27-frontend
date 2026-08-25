"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Home, LockIcon, PencilIcon } from "lucide-react";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { useAuth } from "@/features/auth/context/auth-context";
import {
  formatearColones,
  formatearFechaHora,
  formatearFechaPeriodo,
} from "@/features/libro-caja/formato";
import {
  ETIQUETA_ESTADO_FONDO,
  ETIQUETA_ESTADO_PERIODO,
} from "../models/periodo.model";
import type { FondoRespuesta } from "../validacion/periodo.validacion";
import { usePeriodo } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/periodo.service";
import { PeriodoCerrarDialog } from "./periodo-cerrar-dialog";
import { SolicitarFondoDialog } from "./solicitar-fondo-dialog";

export function PeriodoDetalle({ id }: { id: number }) {
  const { puede } = useAuth();
  const periodo = usePeriodo(id);
  const [fondoASolicitar, setFondoASolicitar] = useState<FondoRespuesta | null>(
    null,
  );
  const [cerrarAbierto, setCerrarAbierto] = useState(false);

  if (periodo.isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-32 w-full" />
      </section>
    );
  }

  if (periodo.isError || !periodo.data) {
    return (
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <p className="text-sm text-destructive">
          {getMensajeDeError(periodo.error)}
        </p>
      </section>
    );
  }

  const datos = periodo.data;
  const abierto = datos.estado === "ABIERTO";

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
      <SolicitarFondoDialog
        periodoId={datos.id}
        fondo={fondoASolicitar}
        open={fondoASolicitar !== null}
        onOpenChange={(abiertoDialogo) => {
          if (!abiertoDialogo) setFondoASolicitar(null);
        }}
      />
      <PeriodoCerrarDialog
        periodo={datos}
        open={cerrarAbierto}
        onOpenChange={setCerrarAbierto}
      />

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
            <BreadcrumbPage>{datos.nombre}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-color-company">
              {datos.nombre}
            </h1>
            <Badge
              variant="secondary"
              className={
                abierto
                  ? "rounded-full border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                  : "rounded-full border-transparent bg-muted text-muted-foreground"
              }
            >
              {ETIQUETA_ESTADO_PERIODO[datos.estado]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatearFechaPeriodo(datos.fechaInicio)} –{" "}
            {formatearFechaPeriodo(datos.fechaFin)}
          </p>
        </div>
        {abierto ? (
          <MostrarSiPuede modulo="LIBRO_CAJA" nivel="COMPLETO">
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <Link
                    href={`/dashboard/libro-caja/periodos/${id}/editar`}
                  />
                }
              >
                <PencilIcon data-icon="inline-start" />
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => setCerrarAbierto(true)}
              >
                <LockIcon data-icon="inline-start" />
                Cerrar periodo
              </Button>
            </div>
          </MostrarSiPuede>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Unidad
              </TableHead>
              <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Tipo
              </TableHead>
              <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Estado
              </TableHead>
              <TableHead className="py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Monto
              </TableHead>
              <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Registrado
              </TableHead>
              <TableHead className="w-[1%] py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datos.fondos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-16 text-center text-sm text-muted-foreground"
                >
                  Este periodo no tiene fondos cargados.
                </TableCell>
              </TableRow>
            ) : null}

            {datos.fondos.map((fondo) => {
              const puedePedir =
                abierto &&
                fondo.estado === "PENDIENTE" &&
                puede("LIBRO_CAJA", "COMPLETO");

              return (
                <TableRow
                  key={fondo.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <TableCell className="py-3 font-medium">
                    {fondo.departamento.nombreUnidad}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {fondo.departamento.tipoActividad}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        fondo.estado === "SOLICITADO"
                          ? "rounded-full border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                          : "rounded-full border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
                      }
                    >
                      {ETIQUETA_ESTADO_FONDO[fondo.estado]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {fondo.estado === "SOLICITADO" &&
                    fondo.montoSolicitado !== null
                      ? formatearColones(fondo.montoSolicitado)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {fondo.estado === "SOLICITADO" && fondo.solicitadoEn
                      ? formatearFechaHora(fondo.solicitadoEn)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        nativeButton={false}
                        render={
                          <Link
                            href={`/dashboard/libro-caja/periodos/${id}/fondos/${fondo.id}`}
                            prefetch={false}
                          />
                        }
                      >
                        <BookOpen data-icon="inline-start" />
                        Ver libro
                      </Button>
                      {puedePedir ? (
                        <MostrarSiPuede modulo="LIBRO_CAJA" nivel="COMPLETO">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setFondoASolicitar(fondo)}
                          >
                            Solicitar fondo
                          </Button>
                        </MostrarSiPuede>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
