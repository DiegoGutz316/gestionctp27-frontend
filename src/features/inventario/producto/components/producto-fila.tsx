"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { StockEntradaDialog } from "../../stock/components/stock-entrada-dialog";
import { StockSalidaDialog } from "../../stock/components/stock-salida-dialog";
import { stockDeProducto } from "../../stock/models/stock.model";
import {
  ETIQUETA_DEPARTAMENTO,
  ETIQUETA_TIPO_PRODUCTO,
  ETIQUETA_UBICACION,
  ETIQUETA_UNIDAD_MEDIDA,
} from "../models/producto.model";
import type { ProductoRespuesta } from "../validacion/producto.validacion";

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProductoFila({ producto }: { producto: ProductoRespuesta }) {
  const [entradaAbierta, setEntradaAbierta] = useState(false);
  const [salidaAbierta, setSalidaAbierta] = useState(false);
  const stock = stockDeProducto(producto);

  return (
    <TableRow>
      {stock ? (
        <>
          <StockEntradaDialog
            stock={stock}
            unidadMedida={producto.unidadMedida}
            open={entradaAbierta}
            onOpenChange={setEntradaAbierta}
          />
          <StockSalidaDialog
            stock={stock}
            unidadMedida={producto.unidadMedida}
            open={salidaAbierta}
            onOpenChange={setSalidaAbierta}
          />
        </>
      ) : null}

      <TableCell>
        <Link
          href={`/dashboard/inventario/${producto.id}`}
          className="flex items-center gap-3"
        >
          <Avatar className="size-9">
            <AvatarFallback className="bg-muted text-xs font-medium">
              {iniciales(producto.nombre)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground hover:underline">
              {producto.nombre}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {ETIQUETA_TIPO_PRODUCTO[producto.tipoProducto]}
            </p>
          </div>
        </Link>
      </TableCell>
      <TableCell>
        <span className="text-sm text-foreground">
          {ETIQUETA_UNIDAD_MEDIDA[producto.unidadMedida]}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-foreground">
          {ETIQUETA_DEPARTAMENTO[producto.departamento]}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-foreground">
          {ETIQUETA_UBICACION[producto.ubicacion]}
        </span>
      </TableCell>
      <TableCell className="text-right">
        {stock ? (
          <span className="text-sm font-medium tabular-nums text-foreground">
            {stock.cantidad}
          </span>
        ) : (
          <Badge variant="secondary">Sin configurar</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                aria-label={`Acciones de ${producto.nombre}`}
              />
            }
          >
            <MoreVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              render={<Link href={`/dashboard/inventario/${producto.id}`} />}
            >
              <EyeIcon />
              Ver stock
            </DropdownMenuItem>

            <MostrarSiPuede modulo="INVENTARIO" nivel="COMPLETO">
              {stock ? (
                <>
                  <DropdownMenuItem onClick={() => setEntradaAbierta(true)}>
                    <ArrowDownIcon />
                    Registrar entrada
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSalidaAbierta(true)}>
                    <ArrowUpIcon />
                    Registrar salida
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/dashboard/inventario/${producto.id}/stock/nuevo`}
                    />
                  }
                >
                  <PlusIcon />
                  Configurar stock
                </DropdownMenuItem>
              )}
            </MostrarSiPuede>

            <DropdownMenuItem
              render={
                <Link href={`/dashboard/inventario/${producto.id}/editar`} />
              }
            >
              <PencilIcon />
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
