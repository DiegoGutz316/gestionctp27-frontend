"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import type { ProductoRespuesta } from "../../producto/validacion/producto.validacion";
import { stockDeProducto } from "../models/stock.model";
import type { StockRespuesta } from "../validacion/stock.validacion";
import { StockEntradaDialog } from "./stock-entrada-dialog";
import { StockSalidaDialog } from "./stock-salida-dialog";

export function StockDeProducto({
  producto,
}: {
  producto: ProductoRespuesta;
}) {
  const stock = stockDeProducto(producto);
  const [entradaPara, setEntradaPara] = useState<StockRespuesta | null>(null);
  const [salidaPara, setSalidaPara] = useState<StockRespuesta | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <StockEntradaDialog
        stock={entradaPara}
        unidadMedida={producto.unidadMedida}
        open={entradaPara !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setEntradaPara(null);
        }}
      />
      <StockSalidaDialog
        stock={salidaPara}
        unidadMedida={producto.unidadMedida}
        open={salidaPara !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setSalidaPara(null);
        }}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Stock</h2>
        {!stock ? (
          <MostrarSiPuede modulo="INVENTARIO" nivel="COMPLETO">
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
              Configurar stock
            </Button>
          </MostrarSiPuede>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Cantidad
              </TableHead>
              <TableHead className="text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Stock mínimo
              </TableHead>
              <TableHead className="text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Precio
              </TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!stock ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Este producto todavía no tiene el stock configurado.
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm font-medium tabular-nums text-foreground">
                      {stock.cantidad}
                    </span>
                    {stock.cantidad <= stock.stockMinimo ? (
                      <Badge
                        variant="secondary"
                        className="rounded-full border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
                      >
                        Bajo
                      </Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm tabular-nums text-foreground">
                    {stock.stockMinimo}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm tabular-nums text-foreground">
                    {stock.precio}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground"
                          aria-label="Acciones de stock"
                        />
                      }
                    >
                      <MoreVerticalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <MostrarSiPuede modulo="INVENTARIO" nivel="COMPLETO">
                        <DropdownMenuItem
                          onClick={() => setEntradaPara(stock)}
                        >
                          <ArrowDownIcon />
                          Registrar entrada
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSalidaPara(stock)}>
                          <ArrowUpIcon />
                          Registrar salida
                        </DropdownMenuItem>
                      </MostrarSiPuede>
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/dashboard/inventario/stock/${stock.id}/editar`}
                          />
                        }
                      >
                        <PencilIcon />
                        Editar configuración
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
