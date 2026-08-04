"use client";

import { getMensajeDeError } from "../api";
import { useInsumo } from "../hooks";
import { InsumoEditarForm } from "./insumo-editar-form";

export function InsumoEditar({ id }: { id: number }) {
  const insumo = useInsumo(id);

  if (insumo.isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando insumo…</p>;
  }

  if (insumo.isError || !insumo.data) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeDeError(insumo.error)}
      </p>
    );
  }

  return <InsumoEditarForm insumo={insumo.data} />;
}
