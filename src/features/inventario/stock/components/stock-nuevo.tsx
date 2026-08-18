"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProducto } from "../../producto/hooks/hooks";
import { getMensajeDeError } from "../../producto/servicios/producto.service";
import { StockForm } from "./stock-form";

/** Resuelve el producto y muestra el formulario de configuración de stock. */
export function StockNuevo({ productoId }: { productoId: number }) {
  const producto = useProducto(productoId);

  if (producto.isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Cargando producto…</p>
    );
  }

  if (producto.isError || !producto.data) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeDeError(producto.error)}
      </p>
    );
  }

  if (producto.data.configuracionStock) {
    return (
      <div className="space-y-4 rounded-xl border bg-card p-5">
        <p className="text-sm text-foreground">
          Este producto ya tiene una configuración de stock.
        </p>
        <Button
          nativeButton={false}
          render={
            <Link
              href={`/dashboard/inventario/stock/${producto.data.configuracionStock.id}/editar`}
            />
          }
        >
          Editar configuración
        </Button>
      </div>
    );
  }

  return (
    <StockForm productoId={producto.data.id} productoNombre={producto.data.nombre} />
  );
}
