"use client";

import Link from "next/link";

import { useState } from "react";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { AccionesMenu } from "@/components/acciones-menu";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { ETIQUETA_ESTADO_CAMA_CULTIVO } from "../validacion/cama-cultivo.validacion";
import type { CamaCultivoRespuesta } from "../validacion/cama-cultivo.validacion";

function nombreDeCama(codigo: string): string {
  return /^cama\b/i.test(codigo.trim()) ? codigo.trim() : `Cama ${codigo.trim()}`;
}

import { CamaCultivoEliminarDialog } from "./cama-cultivo-eliminar-dialog";

type CamasCultivoTablaProps = {
  cargando: boolean;
  error: boolean;
  camas: CamaCultivoRespuesta[];
  vacioConFiltros?: boolean;
};

export function CamasCultivoTabla({
  cargando,
  error,
  camas,
  vacioConFiltros = false,
}: CamasCultivoTablaProps) {
  // El diálogo vive fuera del menú: si se montara dentro, se desmontaría al
  // cerrarse el desplegable y no llegaría a verse.
  const [camaAEliminar, setCamaAEliminar] =
    useState<CamaCultivoRespuesta | null>(null);
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>Cama</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Cultivo actual</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cargando &&
            Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto size-8" />
                </TableCell>
              </TableRow>
            ))}

          {error ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-16 text-center text-sm text-destructive"
              >
                No se pudieron cargar las camas de cultivo. Verifique la
                conexión con el servidor.
              </TableCell>
            </TableRow>
          ) : null}

          {!cargando && !error && camas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-16 text-center text-sm text-muted-foreground"
              >
                {vacioConFiltros
                  ? "No se encontraron camas con los filtros seleccionados."
                  : "No hay camas de cultivo registradas."}
              </TableCell>
            </TableRow>
          ) : null}

          {camas.map((cama) => (
            <TableRow
              key={cama.id}
              className="transition-colors hover:bg-muted/30"
            >
              <TableCell className="font-medium">
                <Link
                  href={`/dashboard/agricola/${cama.id}`}
                  className="hover:underline"
                >
                  {nombreDeCama(cama.codigo)}
                </Link>
              </TableCell>

              <TableCell>{cama.ubicacion}</TableCell>

              <TableCell>{cama.cultivoActual?.trim() || "—"}</TableCell>

              <TableCell>
                <Badge variant="secondary">
                  {ETIQUETA_ESTADO_CAMA_CULTIVO[cama.estado]}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <MostrarSiPuede modulo="AGRICOLA" nivel="COMPLETO">
                  <AccionesMenu
                    aria-label={`Acciones de ${cama.codigo}`}
                  >
                    <DropdownMenuItem
                      render={
                        <Link
                          href={`/dashboard/agricola/${cama.id}/editar`}
                        />
                      }
                    >
                      <PencilIcon />
                      Editar
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setCamaAEliminar(cama)}
                    >
                      <Trash2Icon />
                      Eliminar
                    </DropdownMenuItem>
                  </AccionesMenu>
                </MostrarSiPuede>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CamaCultivoEliminarDialog
        cama={camaAEliminar}
        open={camaAEliminar !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setCamaAEliminar(null);
        }}
      />
    </div>
  );
}
