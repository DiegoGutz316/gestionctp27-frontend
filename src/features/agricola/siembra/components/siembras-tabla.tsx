"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { FinalizarSiembraDialog } from "./finalizar-siembra-dialog";
import {
  ETIQUETA_MOTIVO_FINALIZACION,
  ETIQUETA_UNIDAD_SIEMBRA,
  formatearCantidad,
  formatearFecha,
  type MotivoFinalizacion,
  type SiembraRespuesta,
} from "../models/siembra.model";

type Props = {
  cargando: boolean;
  error: boolean;
  siembras: SiembraRespuesta[];
  hayFiltros: boolean;
};

export function SiembrasTabla({ cargando, error, siembras, hayFiltros }: Props) {
  const [siembraAbierta, setSiembraAbierta] = useState<SiembraRespuesta | null>(
    null,
  );

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
              <TableCell className="font-medium">
                {/* El ciclo completo: cuidados y cosechas de esta siembra. */}
                <Link
                  href={`/dashboard/agricola/siembras/${siembra.id}`}
                  className="underline-offset-4 hover:underline"
                >
                  {siembra.tipoCultivo}
                </Link>
              </TableCell>
              <TableCell>
                <span className="font-medium">{siembra.cama.codigo}</span>
                <span className="block text-xs text-muted-foreground">{siembra.cama.ubicacion}</span>
              </TableCell>
              <TableCell>{formatearFecha(siembra.fechaSiembra)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatearCantidad(siembra.cantidadSembrada)} {ETIQUETA_UNIDAD_SIEMBRA[siembra.unidadSembrada]}</TableCell>
              <TableCell className="text-right">
                {siembra.finalizadaEn ? (
                  <span className="text-sm text-muted-foreground">
                    Finalizada
                    {siembra.motivoFinalizacion
                      ? ` · ${
                          ETIQUETA_MOTIVO_FINALIZACION[
                            siembra.motivoFinalizacion as MotivoFinalizacion
                          ] ?? siembra.motivoDetalle ?? "Sin cosecha"
                        }`
                      : ""}
                  </span>
                ) : (
                  <MostrarSiPuede modulo="AGRICOLA" nivel="COMPLETO">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setSiembraAbierta(siembra)}
                    >
                      Finalizar ciclo
                    </Button>
                  </MostrarSiPuede>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FinalizarSiembraDialog
        siembra={siembraAbierta}
        open={siembraAbierta !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setSiembraAbierta(null);
        }}
      />
    </div>
  );
}
