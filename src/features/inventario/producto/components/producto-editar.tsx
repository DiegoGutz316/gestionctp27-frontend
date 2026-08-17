"use client";

import { getMensajeDeError } from "../servicios/producto.service";
import { useProducto } from "../hooks/hooks";
import { ProductoEditarForm } from "./producto-editar-form";

export function ProductoEditar({ id }: { id: number }) {
  const producto = useProducto(id);

  if (producto.isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando producto…</p>;
  }

  if (producto.isError || !producto.data) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeDeError(producto.error)}
      </p>
    );
  }

  return <ProductoEditarForm producto={producto.data} />;
}
