"use client";

import { useState } from "react";
import { ControlesPaginacion } from "@/components/controles-paginacion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMovimientos } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/stock.service";

const PAGE_SIZE = 8;

const ETIQUETA_TIPO = {
  APERTURA: "Apertura",
  AJUSTE: "Ajuste",
  ENTRADA: "Entrada",
  SALIDA: "Salida",
} as const;

export function MovimientosTabla({ inventarioId }: { inventarioId: number }) {
  const [pagina, setPagina] = useState(1);
  const movimientos = useMovimientos({
    inventarioId,
    pagina,
    limite: PAGE_SIZE,
  });

  const datos = movimientos.data?.datos ?? [];
  const meta = movimientos.data?.meta;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">
        Movimientos de existencias
      </h2>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Tipo
              </TableHead>
              <TableHead className="py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Cantidad
              </TableHead>
              <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Fecha
              </TableHead>
              <TableHead className="hidden py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:table-cell">
                Detalle
              </TableHead>
              <TableHead className="hidden py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:table-cell">
                Responsable
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimientos.isLoading &&
              Array.from({ length: 3 }, (_, index) => `skeleton-${index}`).map(
                (key) => (
                  <TableRow key={key}>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-5 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                  </TableRow>
                ),
              )}

            {movimientos.isError && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-sm text-destructive"
                >
                  {getMensajeDeError(movimientos.error)}
                </TableCell>
              </TableRow>
            )}

            {!movimientos.isLoading && !movimientos.isError && datos.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Todavía no hay movimientos registrados.
                </TableCell>
              </TableRow>
            )}

            {datos.map((movimiento) => (
              <TableRow key={movimiento.id}>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      movimiento.tipo === "ENTRADA"
                        ? "rounded-full border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        : movimiento.tipo === "SALIDA"
                          ? "rounded-full border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
                          : "rounded-full border-transparent bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200"
                    }
                  >
                    {ETIQUETA_TIPO[movimiento.tipo]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-medium tabular-nums text-foreground">
                    {movimiento.cantidad}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-foreground">
                    {movimiento.fecha}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {movimiento.origen ?? movimiento.motivo ?? "—"}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm text-foreground">
                    {movimiento.responsable?.nombre ?? "Migración del sistema"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {meta ? <ControlesPaginacion meta={meta} onPaginaChange={setPagina} /> : null}
    </div>
  );
}
