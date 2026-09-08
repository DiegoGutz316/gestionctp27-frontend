"use client";

import Link from "next/link";
import { PencilIcon } from "lucide-react";

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

import type { AnimalRespuesta } from "../validacion/animal.validacion";

type AnimalesTablaProps = {
  cargando: boolean;
  error: boolean;
  animales: AnimalRespuesta[];
};

export function AnimalesTabla({
  cargando,
  error,
  animales,
}: AnimalesTablaProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>
              Código
            </TableHead>

            <TableHead>
              Nombre
            </TableHead>

            <TableHead>
              Especie
            </TableHead>

            <TableHead>
              Raza
            </TableHead>

            <TableHead>
              Estado
            </TableHead>

            <TableHead className="text-right">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cargando &&
            Array.from({
              length: 4,
            }).map((_, index) => (
              <TableRow key={index}>
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
                colSpan={6}
                className="py-16 text-center text-sm text-destructive"
              >
                No se pudieron cargar los animales.
                Verifique la conexión con el servidor.
              </TableCell>
            </TableRow>
          ) : null}

          {!cargando &&
          !error &&
          animales.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-16 text-center text-sm text-muted-foreground"
              >
                No hay animales registrados.
              </TableCell>
            </TableRow>
          ) : null}

          {animales.map((animal) => (
            <TableRow
              key={animal.id}
              className="transition-colors hover:bg-muted/30"
            >
              <TableCell className="font-medium">
                {animal.codigo}
              </TableCell>

              <TableCell>
                {animal.nombre}
              </TableCell>

              <TableCell>
                {animal.especie}
              </TableCell>

              <TableCell>
                {animal.raza}
              </TableCell>

              <TableCell>
                <Badge variant="secondary">
                  {animal.estado}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <AccionesMenu
                  aria-label={`Acciones de ${animal.nombre}`}
                >
                  <DropdownMenuItem
                    render={
                      <Link
                        href={`/dashboard/pecuaria/${animal.id}/editar`}
                      />
                    }
                  >
                    <PencilIcon />
                    Editar
                  </DropdownMenuItem>
                </AccionesMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}