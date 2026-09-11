"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeartPulseIcon,
  MilkIcon,
  PencilIcon,
  PlusIcon,
  UserXIcon,
} from "lucide-react";

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

import type { AnimalRespuesta } from "../validacion/animal.validacion";
import {
  ETIQUETA_ESTADO_ANIMAL,
  esAnimalActivo,
  etiquetaEspecie,
  type EstadoAnimal,
} from "../models/animal.model";
import { AnimalDesactivarDialog } from "./animal-desactivar-dialog";

type AnimalesTablaProps = {
  cargando: boolean;
  error: boolean;
  animales: AnimalRespuesta[];
  vacioConFiltros?: boolean;
};

export function AnimalesTabla({
  cargando,
  error,
  animales,
  vacioConFiltros = false,
}: AnimalesTablaProps) {
  const [
    animalADesactivar,
    setAnimalADesactivar,
  ] = useState<AnimalRespuesta | null>(
    null,
  );

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <AnimalDesactivarDialog
        animal={animalADesactivar}
        open={animalADesactivar !== null}
        onOpenChange={(abierto) => {
          if (!abierto) {
            setAnimalADesactivar(null);
          }
        }}
      />

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
              <TableRow
                key={`skeleton-${index}`}
              >
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
                No se pudieron cargar los
                animales. Verifique la conexión
                con el servidor.
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
                {vacioConFiltros
                  ? "No hay animales que coincidan con la búsqueda."
                  : "No hay animales registrados."}
              </TableCell>
            </TableRow>
          ) : null}

          {animales.map((animal) => {
            const inactivo = !esAnimalActivo(animal.estado);
            const etiquetaEstado =
              ETIQUETA_ESTADO_ANIMAL[animal.estado as EstadoAnimal] ??
              animal.estado;

            return (
              <TableRow
                key={animal.id}
                className="transition-colors hover:bg-muted/30"
              >
                {/* Backlog 2.2: "El usuario puede seleccionar un animal para
                    visualizar su información detallada". */}
                <TableCell className="font-medium">
                  <Link
                    href={`/dashboard/pecuaria/${animal.id}`}
                    className="hover:underline"
                  >
                    {animal.codigo}
                  </Link>
                </TableCell>

                <TableCell>
                  {animal.nombre}
                </TableCell>

                <TableCell>
                  {etiquetaEspecie(animal.especie)}
                </TableCell>

                <TableCell>
                  {animal.raza}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      inactivo
                        ? "rounded-full"
                        : undefined
                    }
                  >
                    {etiquetaEstado}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <AccionesMenu
                    aria-label={`Acciones de ${animal.nombre}`}
                  >
                    <DropdownMenuItem
                      render={
                        <Link
                          href={`/dashboard/pecuaria/${animal.id}`}
                        />
                      }
                    >
                      <HeartPulseIcon />
                      Ver ficha y salud
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      render={
                        <Link
                          href={`/dashboard/pecuaria/produccion?animalId=${animal.id}`}
                        />
                      }
                    >
                      <MilkIcon />
                      Ver producción
                    </DropdownMenuItem>

                    <MostrarSiPuede
                      modulo="PECUARIA"
                      nivel="COMPLETO"
                    >
                      {!inactivo ? (
                        <>
                          <DropdownMenuItem
                            render={
                              <Link
                                href={`/dashboard/pecuaria/produccion/nuevo?animalId=${animal.id}`}
                              />
                            }
                          >
                            <PlusIcon />
                            Registrar producción
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            render={
                              <Link
                                href={`/dashboard/pecuaria/salud/nuevo?animalId=${animal.id}`}
                              />
                            }
                          >
                            <HeartPulseIcon />
                            Registrar salud
                          </DropdownMenuItem>
                        </>
                      ) : null}

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

                      {!inactivo ? (
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            setAnimalADesactivar(
                              animal,
                            )
                          }
                        >
                          <UserXIcon />
                          Desactivar
                        </DropdownMenuItem>
                      ) : null}
                    </MostrarSiPuede>
                  </AccionesMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}