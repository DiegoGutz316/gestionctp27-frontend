"use client";

import { getMensajeDeError } from "../servicios/stock.service";
import { useConfiguracionStock } from "../hooks/hooks";
import { StockEditarForm } from "./stock-editar-form";

export function StockEditar({ id }: { id: number }) {
  const configuracion = useConfiguracionStock(id);

  if (configuracion.isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        Cargando configuración de stock…
      </p>
    );
  }

  if (configuracion.isError || !configuracion.data) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeDeError(configuracion.error)}
      </p>
    );
  }

  return <StockEditarForm configuracion={configuracion.data} />;
}
