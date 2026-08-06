"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useUsuario } from "../hooks/hooks";
import { UsuarioEditarForm } from "./usuario-editar-form";

export function UsuarioEditar({ id }: { id: string }) {
  const usuario = useUsuario(id);

  if (usuario.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-32" />
      </div>
    );
  }

  if (usuario.isError || !usuario.data) {
    return (
      <p className="text-sm text-destructive">
        No se pudo cargar la información del usuario. Verifique el identificador
        o la conexión con el servidor.
      </p>
    );
  }

  return <UsuarioEditarForm usuario={usuario.data} />;
}
