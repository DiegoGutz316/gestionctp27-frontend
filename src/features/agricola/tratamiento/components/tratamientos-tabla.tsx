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
  ETIQUETA_TIPO_TRATAMIENTO,
  ETIQUETA_UNIDAD_TRATAMIENTO,
  formatearCantidad,
  formatearFecha,
  nombreDeCama,
  type TratamientoRespuesta,
} from "../models/tratamiento.model";

type TratamientosTablaProps = {
  cargando: boolean;
  error: boolean;
  tratamientos: TratamientoRespuesta[];
  hayFiltros: boolean;
};

export function TratamientosTabla({
  cargando,
  error,
  tratamientos,
  hayFiltros,
}: TratamientosTablaProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>Cama</TableHead>
            <TableHead className="hidden md:table-cell">Ubicación</TableHead>
            <TableHead className="hidden sm:table-cell">Cultivo</TableHead>
            <TableHead>Tratamiento</TableHead>
            <TableHead className="hidden sm:table-cell">Fecha</TableHead>
            <TableHead className="text-center">Cantidad</TableHead>
            <TableHead className="hidden md:table-cell">Observaciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cargando
            ? Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="mx-auto h-4 w-12" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                </TableRow>
              ))
            : null}

          {error ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-16 text-center text-sm text-destructive"
              >
                No se pudieron cargar los tratamientos. Verifique la conexión
                con el servidor.
              </TableCell>
            </TableRow>
          ) : null}

          {!cargando && !error && tratamientos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-16 text-center text-sm text-muted-foreground"
              >
                {hayFiltros
                  ? "No existen tratamientos para los filtros seleccionados."
                  : "No hay tratamientos registrados en siembras activas."}
              </TableCell>
            </TableRow>
          ) : null}

          {!cargando && !error
            ? tratamientos.map((tratamiento) => (
                <TableRow key={tratamiento.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {nombreDeCama(tratamiento.siembra.cama.codigo)}
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap md:table-cell">
                    {tratamiento.siembra.cama.ubicacion}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{tratamiento.siembra.tipoCultivo}</TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {ETIQUETA_TIPO_TRATAMIENTO[tratamiento.tipo]}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {tratamiento.producto}
                    </span>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap sm:table-cell">
                    {formatearFecha(tratamiento.fecha)}
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap tabular-nums">
                    {formatearCantidad(tratamiento.cantidad)}{" "}
                    {ETIQUETA_UNIDAD_TRATAMIENTO[tratamiento.unidad]}
                  </TableCell>
                  <TableCell className="hidden whitespace-normal break-words text-muted-foreground md:table-cell">
                    {tratamiento.observaciones?.trim()
                      ? tratamiento.observaciones
                      : "—"}
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
}
