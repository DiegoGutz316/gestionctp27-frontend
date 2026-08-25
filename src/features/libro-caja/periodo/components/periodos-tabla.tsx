"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeIcon, LockIcon, PencilIcon } from "lucide-react";
import { AccionesMenu } from "@/components/acciones-menu";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
import { formatearFechaPeriodo } from "@/features/libro-caja/formato";
import {
  ETIQUETA_ESTADO_PERIODO,
} from "../models/periodo.model";
import type { PeriodoRespuesta } from "../validacion/periodo.validacion";
import { PeriodoCerrarDialog } from "./periodo-cerrar-dialog";

type PeriodosTablaProps = {
  cargando: boolean;
  error: boolean;
  periodos: PeriodoRespuesta[];
  mensajeError?: string;
  vacioConFiltros?: boolean;
};

export function PeriodosTabla({
  cargando,
  error,
  periodos,
  mensajeError,
  vacioConFiltros = false,
}: PeriodosTablaProps) {
  const [periodoACerrar, setPeriodoACerrar] = useState<PeriodoRespuesta | null>(
    null,
  );

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-xs">
      <PeriodoCerrarDialog
        periodo={periodoACerrar}
        open={periodoACerrar !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setPeriodoACerrar(null);
        }}
      />
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Periodo
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Fechas
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Estado
            </TableHead>
            <TableHead className="w-[1%] py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cargando &&
            Array.from({ length: 5 }, (_, index) => `skeleton-${index}`).map(
              (key) => (
                <TableRow key={key}>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto size-8" />
                  </TableCell>
                </TableRow>
              ),
            )}

          {error && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-16 text-center text-sm text-destructive"
              >
                {mensajeError ??
                  "No se pudieron cargar los periodos. Verifique la conexión con el servidor."}
              </TableCell>
            </TableRow>
          )}

          {!cargando && !error && periodos.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-16 text-center text-sm text-muted-foreground"
              >
                {vacioConFiltros
                  ? "No hay periodos que coincidan con la búsqueda."
                  : "Todavía no hay periodos abiertos."}
              </TableCell>
            </TableRow>
          )}

          {periodos.map((periodo) => (
            <TableRow
              key={periodo.id}
              className="transition-colors hover:bg-muted/30"
            >
              <TableCell className="py-3">
                <Link
                  href={`/dashboard/libro-caja/periodos/${periodo.id}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {periodo.nombre}
                </Link>
              </TableCell>
              <TableCell>
                <span className="text-sm text-foreground">
                  {formatearFechaPeriodo(periodo.fechaInicio)} –{" "}
                  {formatearFechaPeriodo(periodo.fechaFin)}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    periodo.estado === "ABIERTO"
                      ? "rounded-full border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                      : "rounded-full border-transparent bg-muted text-muted-foreground"
                  }
                >
                  {ETIQUETA_ESTADO_PERIODO[periodo.estado]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <AccionesMenu aria-label={`Acciones de ${periodo.nombre}`}>
                  <DropdownMenuItem
                    render={
                      <Link
                        href={`/dashboard/libro-caja/periodos/${periodo.id}`}
                      />
                    }
                  >
                    <EyeIcon />
                    Ver detalle
                  </DropdownMenuItem>
                  {periodo.estado === "ABIERTO" ? (
                    <MostrarSiPuede modulo="LIBRO_CAJA" nivel="COMPLETO">
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/dashboard/libro-caja/periodos/${periodo.id}/editar`}
                          />
                        }
                      >
                        <PencilIcon />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setPeriodoACerrar(periodo)}
                      >
                        <LockIcon />
                        Cerrar
                      </DropdownMenuItem>
                    </MostrarSiPuede>
                  ) : null}
                </AccionesMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
