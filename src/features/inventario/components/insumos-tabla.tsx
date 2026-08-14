"use client";

import Link from "next/link";
import { MoreVerticalIcon, PencilIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InsumoRespuesta } from "../models/inventario.model";

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

type InsumosTablaProps = {
  cargando: boolean;
  error: boolean;
  insumos: InsumoRespuesta[];
  mensajeError?: string;
  vacioConFiltros?: boolean;
};

export function InsumosTabla({
  cargando,
  error,
  insumos,
  mensajeError,
  vacioConFiltros = false,
}: InsumosTablaProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Insumo
            </TableHead>
            <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Categoría
            </TableHead>
            <TableHead className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Unidad
            </TableHead>
            <TableHead className="text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Cantidad
            </TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cargando &&
            Array.from({ length: 5 }, (_, index) => `skeleton-${index}`).map(
              (key) => (
                <TableRow key={key}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-9 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-5 w-12" />
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
                colSpan={5}
                className="py-10 text-center text-sm text-destructive"
              >
                {mensajeError ??
                  "No se pudieron cargar los insumos. Verifique la conexión con el servidor."}
              </TableCell>
            </TableRow>
          )}

          {!cargando && !error && insumos.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                {vacioConFiltros
                  ? "No hay insumos que coincidan con la búsqueda."
                  : "Todavía no hay insumos registrados."}
              </TableCell>
            </TableRow>
          )}

          {insumos.map((insumo) => (
            <TableRow key={insumo.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-muted text-xs font-medium">
                      {iniciales(insumo.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {insumo.nombre}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {insumo.categoria.nombre}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-foreground">
                  {insumo.categoria.nombre}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-foreground">
                  {insumo.unidadMedida}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-sm font-medium tabular-nums text-foreground">
                  {insumo.cantidad}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                        aria-label={`Acciones de ${insumo.nombre}`}
                      />
                    }
                  >
                    <MoreVerticalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      render={
                        <Link
                          href={`/dashboard/inventario/${insumo.id}/editar`}
                        />
                      }
                    >
                      <PencilIcon />
                      Editar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
