"use client";

import { useState } from "react";
import Link from "next/link";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { AccionesMenu } from "@/components/acciones-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CultivoEliminarDialog } from "./cultivo-eliminar-dialog";
import {
  ETIQUETA_TIPO_CULTIVO,
  type CultivoRespuesta,
} from "../models/cultivo.model";

type Props = {
  cargando: boolean;
  /** Mensaje del fallo, o null si no lo hubo. */
  error: string | null;
  cultivos: CultivoRespuesta[];
  hayFiltros: boolean;
};

export function CultivosTabla({ cargando, error, cultivos, hayFiltros }: Props) {
  const [cultivoAEliminar, setCultivoAEliminar] =
    useState<CultivoRespuesta | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>Cultivo</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cargando
            ? Array.from({ length: 4 }).map((_, indice) => (
                <TableRow key={`esqueleto-${indice}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-56" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            : null}

          {error ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-16 text-center text-sm whitespace-normal text-destructive"
              >
                No se pudieron cargar los cultivos. {error}
              </TableCell>
            </TableRow>
          ) : null}

          {!cargando && !error && cultivos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-16 text-center text-sm text-muted-foreground"
              >
                {hayFiltros
                  ? "No existen cultivos para los filtros seleccionados."
                  : "No hay cultivos registrados. Registre uno para poder sembrarlo."}
              </TableCell>
            </TableRow>
          ) : null}

          {!cargando && !error
            ? cultivos.map((cultivo) => (
                <TableRow key={cultivo.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {cultivo.nombre}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {ETIQUETA_TIPO_CULTIVO[cultivo.tipo]}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words text-muted-foreground">
                    {cultivo.descripcion?.trim() ? cultivo.descripcion : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={cultivo.activo ? "secondary" : "outline"}>
                      {cultivo.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <MostrarSiPuede modulo="AGRICOLA" nivel="COMPLETO">
                      <AccionesMenu aria-label={`Acciones de ${cultivo.nombre}`}>
                        <DropdownMenuItem
                          render={
                            <Link
                              href={`/dashboard/agricola/cultivos/${cultivo.id}/editar`}
                            />
                          }
                        >
                          <PencilIcon />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setCultivoAEliminar(cultivo)}
                        >
                          <Trash2Icon />
                          Eliminar
                        </DropdownMenuItem>
                      </AccionesMenu>
                    </MostrarSiPuede>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>

      <CultivoEliminarDialog
        cultivo={cultivoAEliminar}
        open={cultivoAEliminar !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setCultivoAEliminar(null);
        }}
      />
    </div>
  );
}
