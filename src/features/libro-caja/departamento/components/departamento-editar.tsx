"use client";

import { getMensajeDeError } from "../servicios/departamento.service";
import { useDepartamento } from "../hooks/hooks";
import { DepartamentoEditarForm } from "./departamento-editar-form";

export function DepartamentoEditar({ id }: { id: number }) {
  const departamento = useDepartamento(id);

  if (departamento.isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Cargando departamento…</p>
    );
  }

  if (departamento.isError || !departamento.data) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeDeError(departamento.error)}
      </p>
    );
  }

  return <DepartamentoEditarForm departamento={departamento.data} />;
}
