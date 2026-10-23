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

import { useDesparasitacionesDeAnimal } from "@/features/pecuaria/animal/hooks/desparasitacion-hooks";
import { getMensajeDeError } from "@/features/pecuaria/animal/servicios/desparasitacion.service";
import { formatearFecha } from "../formato";

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
            <TableHead className="hidden md:table-cell">Observaciones</TableHead>
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
                  <TableCell className="hidden md:table-cell">
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
                {/* Como en el resto de la app: el motivo lo da la API (permisos,
                    animal inexistente…) y solo se habla de conexión cuando
                    realmente falla la red. */}
                {getMensajeDeError(historial.error)}
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
                  <TableCell className="hidden whitespace-normal break-words md:table-cell">
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
