"use client";

import { getMensajeDeError } from "../servicios/stock.service";
import { useStockItem } from "../hooks/hooks";
import { StockEditarForm } from "./stock-editar-form";

export function StockEditar({ id }: { id: number }) {
  const stock = useStockItem(id);

  if (stock.isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando stock…</p>;
  }

  if (stock.isError || !stock.data) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeDeError(stock.error)}
      </p>
    );
  }

  return <StockEditarForm stock={stock.data} />;
}
