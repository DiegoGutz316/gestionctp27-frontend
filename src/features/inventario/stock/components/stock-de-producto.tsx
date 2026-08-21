"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { useAuth } from "@/features/auth/context/auth-context";
import { esStockBajo } from "../../producto/models/producto.model";
import type { ProductoRespuesta } from "../../producto/validacion/producto.validacion";
import type { Inventario } from "../models/stock.model";
import { StockEntradaDialog } from "./stock-entrada-dialog";
import { StockSalidaDialog } from "./stock-salida-dialog";

export function StockDeProducto({
  producto,
}: {
  producto: ProductoRespuesta;
}) {
  const { usuario } = useAuth();
  const esAdministrador = usuario?.rol === "ADMINISTRADOR";
  const { configuracionStock, inventario } = producto;
  const [entradaPara, setEntradaPara] = useState<Inventario | null>(null);
  const [salidaPara, setSalidaPara] = useState<Inventario | null>(null);
  const stockBajo = esStockBajo(producto);

  return (
    <div className="flex flex-col gap-2">
      <StockEntradaDialog
        inventario={entradaPara}
        productoNombre={producto.nombre}
        unidadMedida={producto.unidadMedida}
        open={entradaPara !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setEntradaPara(null);
        }}
      />
      <StockSalidaDialog
        inventario={salidaPara}
        productoNombre={producto.nombre}
        unidadMedida={producto.unidadMedida}
        open={salidaPara !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setSalidaPara(null);
        }}
      />

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-base font-semibold tracking-tight">
          Existencias y configuración de stock
        </h2>
        {!configuracionStock && esAdministrador ? (
          <Button
            size="sm"
            nativeButton={false}
            render={
              <Link
                href={`/dashboard/inventario/${producto.id}/stock/nuevo`}
              />
            }
          >
            <PlusIcon data-icon="inline-start" />
            Configuración de stock
          </Button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="grid gap-4 p-4 sm:grid-cols-[1.1fr_1fr] sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Existencia actual</p>
              {inventario ? (
                <Badge
                  variant={stockBajo ? "secondary" : "outline"}
                  className={
                    stockBajo
                      ? "rounded-full border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
                      : "rounded-full font-normal text-muted-foreground"
                  }
                >
                  {stockBajo ? "Stock bajo" : "Disponible"}
                </Badge>
              ) : null}
            </div>

            {inventario ? (
              <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
                {inventario.cantidadActual}
              </p>
            ) : (
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Sin registro de existencias
              </p>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-4 border-t pt-3 sm:border-t-0 sm:border-l sm:py-1 sm:pl-4">
            <div>
              <dt className="text-xs text-muted-foreground">Stock mínimo</dt>
              <dd className="mt-1 text-sm font-medium tabular-nums text-foreground">
                {configuracionStock
                  ? configuracionStock.stockMinimo
                  : "Sin configurar"}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-muted-foreground">Precio unitario</dt>
              <dd className="mt-1 text-sm font-medium tabular-nums text-foreground">
                {configuracionStock ? configuracionStock.precio : "—"}
              </dd>
            </div>
          </dl>
        </div>

        <MostrarSiPuede modulo="INVENTARIO" nivel="COMPLETO">
          {inventario && configuracionStock?.activo ? (
            <div className="flex flex-col gap-2 border-t bg-muted/20 p-3 sm:flex-row sm:justify-end">
              {configuracionStock && esAdministrador ? (
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={
                    <Link
                      href={`/dashboard/inventario/stock/${configuracionStock.id}/editar`}
                    />
                  }
                >
                  <PencilIcon data-icon="inline-start" />
                  Editar configuración
                </Button>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEntradaPara(inventario)}
              >
                <ArrowDownIcon data-icon="inline-start" />
                Registrar entrada
              </Button>
              <Button size="sm" onClick={() => setSalidaPara(inventario)}>
                <ArrowUpIcon data-icon="inline-start" />
                Registrar salida
              </Button>
            </div>
          ) : configuracionStock && esAdministrador ? (
            <div className="flex border-t bg-muted/20 p-3 sm:justify-end">
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={
                  <Link
                    href={`/dashboard/inventario/stock/${configuracionStock.id}/editar`}
                  />
                }
              >
                <PencilIcon data-icon="inline-start" />
                Editar configuración
              </Button>
            </div>
          ) : null}
        </MostrarSiPuede>
      </div>
    </div>
  );
}
