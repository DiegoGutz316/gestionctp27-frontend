"use client";

import { getMensajeDeError } from "../servicios/colegio.service";
import { useColegio } from "../hooks/hooks";
import { ColegioForm } from "./colegio-form";

export function ColegioEditar() {
  const colegio = useColegio();

  if (colegio.isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        Cargando información del colegio…
      </p>
    );
  }

  if (colegio.isError || !colegio.data) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeDeError(colegio.error)}
      </p>
    );
  }

  return <ColegioForm colegio={colegio.data} />;
}
