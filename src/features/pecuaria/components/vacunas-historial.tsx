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
import { useVacunasDeAnimal } from "../hooks/vacuna-hooks";
import { getMensajeDeError } from "../servicios/vacuna.service";

/**
 * Backlog 2.6: historial de vacunas del animal que se está viendo.
 *
 * Carga, error, vacío y datos son estados excluyentes. Un fallo de red también
 * deja la lista vacía, y sin separarlos la pantalla diría "no tiene vacunas"
 * cuando en realidad no se pudo consultar.
 */
export function VacunasHistorial({ animalId }: { animalId: number }) {
  const historial = useVacunasDeAnimal(animalId);
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
      aria-labelledby="titulo-vacunas"
      className="overflow-hidden rounded-xl border bg-card shadow-xs"
    >
      <h2
        id="titulo-vacunas"
        className="border-b px-4 py-3 text-sm font-semibold"
      >
        Historial de vacunas
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-32">Fecha</TableHead>
            <TableHead>Tipo de vacuna</TableHead>
            <TableHead>Dosis</TableHead>
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
                    <Skeleton className="h-4 w-16" />
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
                colSpan={4}
                className="py-10 text-center text-sm whitespace-normal text-muted-foreground"
              >
                No hay vacunas registradas para este animal.
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
                    {registro.tipoVacuna}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {registro.dosis}
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
