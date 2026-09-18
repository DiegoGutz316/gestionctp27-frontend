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
  type TratamientoRespuesta,
} from "../models/tratamiento.model";

type TratamientosTablaProps = {
  cargando: boolean;
  error: boolean;
  tratamientos: TratamientoRespuesta[];
  cultivoSeleccionado: boolean;
};

export function TratamientosTabla({
  cargando,
  error,
  tratamientos,
  cultivoSeleccionado,
}: TratamientosTablaProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>
              Cultivo
            </TableHead>

            <TableHead>
              Producto
            </TableHead>

            <TableHead>
              Fecha
            </TableHead>

            <TableHead className="text-center">
              Cantidad
            </TableHead>

            <TableHead>
              Observaciones
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cargando &&
            Array.from({
              length: 4,
            }).map((_, index) => (
              <TableRow
                key={`skeleton-${index}`}
              >
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-36" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>

                <TableCell>
                  <Skeleton className="mx-auto h-4 w-16" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
              </TableRow>
            ))}

          {error ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-16 text-center text-sm text-destructive"
              >
                No se pudieron cargar los tratamientos.
                Verifique la conexión con el servidor.
              </TableCell>
            </TableRow>
          ) : null}

          {!cultivoSeleccionado &&
          !cargando &&
          !error ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-16 text-center text-sm text-muted-foreground"
              >
                Seleccione un cultivo para consultar su
                historial de tratamientos.
              </TableCell>
            </TableRow>
          ) : null}

          {cultivoSeleccionado &&
          !cargando &&
          !error &&
          tratamientos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-16 text-center text-sm text-muted-foreground"
              >
                No existen tratamientos registrados para
                el cultivo seleccionado.
              </TableCell>
            </TableRow>
          ) : null}

          {tratamientos.map(
            (tratamiento) => (
              <TableRow
                key={tratamiento.id}
              >
                <TableCell className="font-medium">
                  {
                    tratamiento.siembra
                      .tipoCultivo
                  }
                </TableCell>

                <TableCell>
                  {tratamiento.producto}
                </TableCell>

                <TableCell>
                  {formatearFecha(
                    tratamiento.fecha,
                  )}
                </TableCell>

                <TableCell className="text-center tabular-nums">
                  {formatearCantidad(
                    tratamiento.cantidad,
                  )}
                </TableCell>

                <TableCell>
                  {tratamiento.observaciones ??
                    "—"}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </div>
  );
}