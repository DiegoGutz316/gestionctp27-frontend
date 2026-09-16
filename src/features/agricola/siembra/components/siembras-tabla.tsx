import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { formatearCantidad, formatearFecha, type SiembraRespuesta } from "../models/siembra.model";

type Props = {
  cargando: boolean;
  error: boolean;
  siembras: SiembraRespuesta[];
  hayFiltros: boolean;
};

export function SiembrasTabla({ cargando, error, siembras, hayFiltros }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>Cultivo</TableHead>
            <TableHead>Cama</TableHead>
            <TableHead>Fecha de siembra</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cargando && Array.from({ length: 4 }).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="ml-auto h-4 w-16" /></TableCell>
            </TableRow>
          ))}
          {error ? (
            <TableRow><TableCell colSpan={4} className="py-16 text-center text-sm text-destructive">No se pudieron cargar las siembras. Verifique la conexión con el servidor.</TableCell></TableRow>
          ) : null}
          {!cargando && !error && siembras.length === 0 ? (
            <TableRow><TableCell colSpan={4} className="py-16 text-center text-sm text-muted-foreground">{hayFiltros ? "No existen siembras para los filtros seleccionados." : "No hay siembras registradas."}</TableCell></TableRow>
          ) : null}
          {siembras.map((siembra) => (
            <TableRow key={siembra.id}>
              <TableCell className="font-medium">{siembra.tipoCultivo}</TableCell>
              <TableCell>
                <span className="font-medium">{siembra.cama.codigo}</span>
                <span className="block text-xs text-muted-foreground">{siembra.cama.ubicacion}</span>
              </TableCell>
              <TableCell>{formatearFecha(siembra.fechaSiembra)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatearCantidad(siembra.cantidadSembrada)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
