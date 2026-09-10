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

import { formatearFecha } from "../formato";
import { useDesparasitacionesDeAnimal } from "../hooks/desparasitacion-hooks";

/**
 * Backlog 2.8: historial de desparasitaciones del animal que se está viendo.
 *
 * Carga, error, vacío y datos son estados excluyentes. Un fallo de red también
 * deja la lista vacía, y sin separarlos la pantalla diría "no tiene
 * desparasitaciones" cuando en realidad no se pudo consultar.
 */
export function DesparasitacionesHistorial({
  animalId,
}: {
  animalId: number;
}) {
  const historial = useDesparasitacionesDeAnimal(animalId);
  const registros = historial.data ?? [];

  const estado = historial.isLoading
    ? "cargando"
    : historial.isError
      ? "error"
      : registros.length === 0
        ? "vacio"
        : "datos";

  return (
    <section
      aria-labelledby="titulo-desparasitaciones"
      className="overflow-hidden rounded-xl border bg-card shadow-xs"
    >
      <h2
        id="titulo-desparasitaciones"
        className="border-b px-4 py-3 text-sm font-semibold"
      >
        Historial de desparasitaciones
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-32">Fecha</TableHead>
            <TableHead>Producto aplicado</TableHead>
            <TableHead>Observaciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {estado === "cargando"
            ? Array.from({ length: 3 }).map((_, indice) => (
                <TableRow key={`esqueleto-${indice}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
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
                colSpan={3}
                className="py-10 text-center text-sm whitespace-normal text-destructive"
              >
                No se pudo cargar el historial de desparasitaciones. Revise
                la conexión e inténtelo de nuevo.
              </TableCell>
            </TableRow>
          ) : null}

          {estado === "vacio" ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="py-10 text-center text-sm whitespace-normal text-muted-foreground"
              >
                Este animal no tiene desparasitaciones registradas.
              </TableCell>
            </TableRow>
          ) : null}

          {estado === "datos"
            ? registros.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatearFecha(registro.fecha)}
                  </TableCell>
                  <TableCell className="font-medium whitespace-normal">
                    {registro.producto}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words">
                    {registro.observaciones?.trim() ? (
                      registro.observaciones
                    ) : (
                      <span className="text-muted-foreground">
                        Sin observaciones
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </section>
  );
}
