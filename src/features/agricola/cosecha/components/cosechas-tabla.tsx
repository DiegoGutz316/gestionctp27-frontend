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

import { formatearFecha } from "@/features/agricola/siembra/models/siembra.model";

import {
  formatearCantidadConUnidad,
  type CosechaRespuesta,
} from "../models/cosecha.model";

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
  const hayDatos = cosechas.length > 0;

  // Una actualización en segundo plano puede fallar teniendo datos ya
  // cargados: TanStack Query los conserva y marca `isError`. Si el error
  // ganara, un fallo pasajero escondería un historial perfectamente usable,
  // así que con filas disponibles se muestran y el fallo se avisa aparte.
  const estado = cargando
    ? "cargando"
    : hayDatos
      ? "datos"
      : mensajeError
        ? "error"
        : "vacio";

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {mensajeError && hayDatos ? (
        <p className="border-b bg-destructive/5 px-4 py-2 text-sm text-destructive">
          No se pudo actualizar el historial ({mensajeError}). Se muestran los
          últimos datos cargados.
        </p>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>Cultivo</TableHead>
            <TableHead className="w-40">Ubicación</TableHead>
            <TableHead className="w-36">Cama de cultivo</TableHead>
            <TableHead className="w-40">Fecha de cosecha</TableHead>
            <TableHead className="w-40 text-center">Cantidad obtenida</TableHead>
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
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="mx-auto h-4 w-16" />
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
                colSpan={6}
                className="py-16 text-center text-sm whitespace-normal text-destructive"
              >
                {mensajeError}
              </TableCell>
            </TableRow>
          ) : null}

          {estado === "vacio" ? (
            <TableRow>
              <TableCell
                colSpan={6}
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
                    {cosecha.siembra.cama.ubicacion}
                  </TableCell>

                  <TableCell className="font-medium whitespace-nowrap">
                    {cosecha.siembra.cama.codigo}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {formatearFecha(cosecha.fecha)}
                  </TableCell>

                  <TableCell className="text-center whitespace-nowrap tabular-nums">
                    {formatearCantidadConUnidad(
                      cosecha.cantidadObtenida,
                      cosecha.unidadMedida,
                    )}
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
