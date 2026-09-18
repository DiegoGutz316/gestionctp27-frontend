"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  formatearCantidad,
  formatearFecha,
} from "@/features/agricola/siembra/models/siembra.model";

import type { CosechaRespuesta } from "../models/cosecha.model";

type Props = {
  cargando: boolean;
  mensajeError: string | null;
  cosechas: CosechaRespuesta[];
  hayFiltros: boolean;
};

/**
 * Backlog 3.7: historial de cosechas.
 *
 * Carga, error, vacío y datos son estados excluyentes: un fallo de red también
 * deja la lista vacía, y confundirlos haría decir que no hay cosechas cuando
 * en realidad no se pudieron consultar.
 */
export function CosechasTabla({
  cargando,
  mensajeError,
  cosechas,
  hayFiltros,
}: Props) {
  const estado = cargando
    ? "cargando"
    : mensajeError
      ? "error"
      : cosechas.length === 0
        ? "vacio"
        : "datos";

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>Cultivo</TableHead>
            <TableHead className="w-40">Fecha de cosecha</TableHead>
            <TableHead className="w-40 text-right">Cantidad obtenida</TableHead>
            <TableHead>Observaciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {estado === "cargando"
            ? Array.from({ length: 4 }).map((_, indice) => (
                <TableRow key={`esqueleto-${indice}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                </TableRow>
              ))
            : null}

          {estado === "error" ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-16 text-center text-sm whitespace-normal text-destructive"
              >
                {mensajeError}
              </TableCell>
            </TableRow>
          ) : null}

          {estado === "vacio" ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-16 text-center text-sm whitespace-normal text-muted-foreground"
              >
                {hayFiltros
                  ? "No existen cosechas para los filtros seleccionados."
                  : "No hay cosechas registradas."}
              </TableCell>
            </TableRow>
          ) : null}

          {estado === "datos"
            ? cosechas.map((cosecha) => (
                <TableRow key={cosecha.id}>
                  <TableCell className="font-medium">
                    {cosecha.siembra.tipoCultivo}
                    <span className="block text-xs text-muted-foreground">
                      Sembrada el {formatearFecha(cosecha.siembra.fechaSiembra)}
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {formatearFecha(cosecha.fecha)}
                  </TableCell>

                  <TableCell className="text-right tabular-nums">
                    {formatearCantidad(cosecha.cantidadObtenida)}
                  </TableCell>

                  <TableCell className="whitespace-normal break-words text-muted-foreground">
                    {cosecha.observaciones?.trim()
                      ? cosecha.observaciones
                      : "Sin observaciones"}
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
}
