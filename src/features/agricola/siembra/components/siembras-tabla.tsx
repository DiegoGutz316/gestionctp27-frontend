"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { useFinalizarSiembra } from "../hooks/siembra-hooks";
import { formatearCantidad, formatearFecha, type SiembraRespuesta } from "../models/siembra.model";
import { getMensajeDeError } from "../servicios/siembra.service";

type Props = {
  cargando: boolean;
  error: boolean;
  siembras: SiembraRespuesta[];
  hayFiltros: boolean;
};

export function SiembrasTabla({ cargando, error, siembras, hayFiltros }: Props) {
  const finalizar = useFinalizarSiembra();

  const cerrarCiclo = async (id: number) => {
    try {
      await finalizar.mutateAsync(id);
      toast.success("La siembra finalizó y la cama volvió a estar disponible.");
    } catch (errorCierre) {
      toast.error(getMensajeDeError(errorCierre));
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>Cultivo</TableHead>
            <TableHead>Cama</TableHead>
            <TableHead>Fecha de siembra</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">Ciclo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cargando && Array.from({ length: 4 }).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="ml-auto h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="ml-auto h-8 w-24" /></TableCell>
            </TableRow>
          ))}
          {error ? (
            <TableRow><TableCell colSpan={5} className="py-16 text-center text-sm text-destructive">No se pudieron cargar las siembras. Verifique la conexión con el servidor.</TableCell></TableRow>
          ) : null}
          {!cargando && !error && siembras.length === 0 ? (
            <TableRow><TableCell colSpan={5} className="py-16 text-center text-sm text-muted-foreground">{hayFiltros ? "No existen siembras para los filtros seleccionados." : "No hay siembras registradas."}</TableCell></TableRow>
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
              <TableCell className="text-right">
                {siembra.finalizadaEn ? (
                  <span className="text-sm text-muted-foreground">Finalizada</span>
                ) : (
                  <MostrarSiPuede modulo="AGRICOLA" nivel="COMPLETO">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={finalizar.isPending}
                      onClick={() => void cerrarCiclo(siembra.id)}
                    >
                      Finalizar
                    </Button>
                  </MostrarSiPuede>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
