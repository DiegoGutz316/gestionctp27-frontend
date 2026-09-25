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
            <TableHead>Ubicación</TableHead>
            <TableHead>Cultivo</TableHead>
            <TableHead>Tratamiento</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-center">Cantidad</TableHead>
            <TableHead>Observaciones</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cargando
            ? Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {Array.from({ length: 8 }).map((__, celda) => (
                    <TableCell key={celda}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}

          {error ? (
            <TableRow>
              <TableCell
                colSpan={8}
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
                colSpan={8}
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
                  <TableCell className="whitespace-nowrap">
                    {tratamiento.siembra.cama.ubicacion}
                  </TableCell>
                  <TableCell>{tratamiento.siembra.tipoCultivo}</TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {ETIQUETA_TIPO_TRATAMIENTO[tratamiento.tipo]}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {tratamiento.producto}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatearFecha(tratamiento.fecha)}
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap tabular-nums">
                    {formatearCantidad(tratamiento.cantidad)}{" "}
                    {ETIQUETA_UNIDAD_TRATAMIENTO[tratamiento.unidad]}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words text-muted-foreground">
                    {tratamiento.observaciones?.trim()
                      ? tratamiento.observaciones
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    —
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
}
