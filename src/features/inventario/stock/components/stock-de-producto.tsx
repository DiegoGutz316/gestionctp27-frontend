"use client";

import { useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import { MenuFlotante, type AccionMenu } from "@/components/accion-flotante";
import { Badge } from "@/components/ui/badge";
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
  const { usuario, puede } = useAuth();
  const esAdministrador = usuario?.rol === "ADMINISTRADOR";
  const puedeEscribir = puede("INVENTARIO", "COMPLETO");
  const { configuracionStock, inventario } = producto;
  const [entradaPara, setEntradaPara] = useState<Inventario | null>(null);
  const [salidaPara, setSalidaPara] = useState<Inventario | null>(null);
  const stockBajo = esStockBajo(producto);
  const acciones: AccionMenu[] = [];

  if (esAdministrador) {
    acciones.push({
      href: `/dashboard/inventario/${producto.id}/editar`,
      etiqueta: "Editar producto",
      icono: <PencilIcon className="size-4" />,
    });
    acciones.push(
      configuracionStock
        ? {
            href: `/dashboard/inventario/stock/${configuracionStock.id}/editar`,
            etiqueta: "Editar configuración",
            icono: <PencilIcon className="size-4" />,
          }
        : {
            href: `/dashboard/inventario/${producto.id}/stock/nuevo`,
            etiqueta: "Configuración de stock",
            icono: <PlusIcon className="size-4" />,
          },
    );
  }

  if (puedeEscribir && inventario && configuracionStock?.activo) {
    acciones.push(
      {
        etiqueta: "Registrar entrada",
        icono: <ArrowDownIcon className="size-4" />,
        onClick: () => setEntradaPara(inventario),
      },
      {
        etiqueta: "Registrar salida",
        icono: <ArrowUpIcon className="size-4" />,
        onClick: () => setSalidaPara(inventario),
      },
    );
  }

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

      <h2 className="text-base font-semibold tracking-tight">
        Existencias y configuración de stock
      </h2>
      <MenuFlotante acciones={acciones} />

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

      </div>
    </div>
  );
}
