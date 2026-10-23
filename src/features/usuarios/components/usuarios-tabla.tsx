"use client";

import { useState } from "react";
import Link from "next/link";
import { PencilIcon, UserXIcon } from "lucide-react";
import { AccionesMenu } from "@/components/acciones-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useAuth } from "@/features/auth/context/auth-context";
import { ETIQUETA_ROL } from "../models/usuario.model";
import type { UsuarioRespuesta } from "../validacion/usuario.validacion";
import { UsuarioDesactivarDialog } from "./usuario-desactivar-dialog";

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

type UsuariosTablaProps = {
  cargando: boolean;
  error: boolean;
  usuarios: UsuarioRespuesta[];
};

export function UsuariosTabla({
  cargando,
  error,
  usuarios,
}: UsuariosTablaProps) {
  const { usuario: sesion } = useAuth();
  const [usuarioADesactivar, setUsuarioADesactivar] =
    useState<UsuarioRespuesta | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <UsuarioDesactivarDialog
        usuario={usuarioADesactivar}
        open={usuarioADesactivar !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setUsuarioADesactivar(null);
        }}
      />
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Usuario
            </TableHead>
            <TableHead className="hidden py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:table-cell">
              Rol
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
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-9 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
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
                No se pudieron cargar los usuarios. Verifique la conexión con el
                servidor.
              </TableCell>
            </TableRow>
          )}

          {!cargando && !error && usuarios.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                    <UserXIcon className="size-7 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm font-medium">No se encontraron usuarios</p>
                  <p className="text-xs text-muted-foreground">
                    Pruebe ajustando los filtros de búsqueda
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}

          {usuarios.map((usuario) => (
            <TableRow
              key={usuario.id}
              className="transition-colors hover:bg-muted/30"
            >
              <TableCell className="py-3 whitespace-normal">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-muted text-xs font-medium">
                      {iniciales(usuario.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {usuario.nombre}
                    </p>
                    <p className="hidden truncate text-xs text-muted-foreground sm:block">
                      {usuario.correo}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-sm text-foreground">
                  {ETIQUETA_ROL[usuario.rol]}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    usuario.activo
                      ? "rounded-full border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                      : "rounded-full border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
                  }
                >
                  {usuario.activo ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <AccionesMenu aria-label={`Acciones de ${usuario.nombre}`}>
                  <DropdownMenuItem
                    render={
                      <Link href={`/dashboard/usuarios/${usuario.id}/editar`} />
                    }
                  >
                    <PencilIcon />
                    Editar
                  </DropdownMenuItem>
                  {usuario.activo && sesion && usuario.id !== sesion.id ? (
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setUsuarioADesactivar(usuario)}
                    >
                      <UserXIcon />
                      Desactivar
                    </DropdownMenuItem>
                  ) : null}
                </AccionesMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
