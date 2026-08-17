"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsuario } from "../hooks/hooks";
import { UsuarioEditarForm } from "./usuario-editar-form";

/** Carga el usuario por id y muestra el formulario de edición. */
export function UsuarioEditar({ id }: { id: string }) {
  const usuario = useUsuario(id);

  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/dashboard" />}
              className="flex items-center gap-1.5"
            >
              <Home className="size-3.5" />
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/usuarios" />}>
              Usuarios
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar usuario
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {usuario.isLoading
            ? "Cargando datos…"
            : usuario.data
              ? `Actualice los datos de ${usuario.data.nombre}.`
              : "Actualice nombre, correo, rol o estado de acceso."}
        </p>
      </div>

      {usuario.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-40" />
        </div>
      ) : null}

      {usuario.isError || (!usuario.isLoading && !usuario.data) ? (
        <p className="text-sm text-destructive">
          No se pudo cargar la información del usuario. Verifique el
          identificador o la conexión con el servidor.
        </p>
      ) : null}

      {usuario.data ? <UsuarioEditarForm usuario={usuario.data} /> : null}
    </section>
  );
}
