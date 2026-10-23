"use client";

import { useState } from "react";
import Link from "next/link";
import { PencilIcon, UserXIcon } from "lucide-react";
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
import type { DepartamentoRespuesta } from "../validacion/departamento.validacion";
import { DepartamentoDesactivarDialog } from "./departamento-desactivar-dialog";

type DepartamentosTablaProps = {
  cargando: boolean;
  error: boolean;
  departamentos: DepartamentoRespuesta[];
  mensajeError?: string;
  vacioConFiltros?: boolean;
};

export function DepartamentosTabla({
  cargando,
  error,
  departamentos,
  mensajeError,
  vacioConFiltros = false,
}: DepartamentosTablaProps) {
  const [departamentoADesactivar, setDepartamentoADesactivar] =
    useState<DepartamentoRespuesta | null>(null);

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-xs">
      <DepartamentoDesactivarDialog
        departamento={departamentoADesactivar}
        open={departamentoADesactivar !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setDepartamentoADesactivar(null);
        }}
      />
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Unidad
            </TableHead>
            <TableHead className="hidden py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:table-cell">
              Tipo de actividad
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Estado
            </TableHead>
            <TableHead className="w-[1%] py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cargando &&
            Array.from({ length: 5 }, (_, index) => `skeleton-${index}`).map(
              (key) => (
                <TableRow key={key}>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto size-8" />
                  </TableCell>
                </TableRow>
              ),
            )}

          {error && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-16 text-center text-sm text-destructive"
              >
                {mensajeError ??
                  "No se pudieron cargar los departamentos. Verifique la conexión con el servidor."}
              </TableCell>
            </TableRow>
          )}

          {!cargando && !error && departamentos.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-16 text-center text-sm text-muted-foreground"
              >
                {vacioConFiltros
                  ? "No hay departamentos que coincidan con la búsqueda."
                  : "Todavía no hay departamentos registrados."}
              </TableCell>
            </TableRow>
          )}

          {departamentos.map((departamento) => (
            <TableRow
              key={departamento.id}
              className="transition-colors hover:bg-muted/30"
            >
              <TableCell className="py-3">
                <p className="font-medium text-foreground">
                  {departamento.nombreUnidad}
                </p>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary">{departamento.tipoActividad}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    departamento.activo
                      ? "rounded-full border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                      : "rounded-full border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
                  }
                >
                  {departamento.activo ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <MostrarSiPuede modulo="LIBRO_CAJA" nivel="COMPLETO">
                  <AccionesMenu
                    aria-label={`Acciones de ${departamento.nombreUnidad}`}
                  >
                    <DropdownMenuItem
                      render={
                        <Link
                          href={`/dashboard/libro-caja/departamentos/${departamento.id}/editar`}
                        />
                      }
                    >
                      <PencilIcon />
                      Editar
                    </DropdownMenuItem>
                    {departamento.activo ? (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDepartamentoADesactivar(departamento)}
                      >
                        <UserXIcon />
                        Desactivar
                      </DropdownMenuItem>
                    ) : null}
                  </AccionesMenu>
                </MostrarSiPuede>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
