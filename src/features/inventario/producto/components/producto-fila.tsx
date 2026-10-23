"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { AccionesMenu } from "@/components/acciones-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { useAuth } from "@/features/auth/context/auth-context";
import { StockEntradaDialog } from "../../stock/components/stock-entrada-dialog";
import { StockSalidaDialog } from "../../stock/components/stock-salida-dialog";
import {
  ETIQUETA_DEPARTAMENTO,
  ETIQUETA_TIPO_PRODUCTO,
  ETIQUETA_UBICACION,
  ETIQUETA_UNIDAD_MEDIDA,
  esStockBajo,
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
  const { usuario } = useAuth();
  const esAdministrador = usuario?.rol === "ADMINISTRADOR";
  const [entradaAbierta, setEntradaAbierta] = useState(false);
  const [salidaAbierta, setSalidaAbierta] = useState(false);
  const { configuracionStock, inventario } = producto;
  const stockBajo = esStockBajo(producto);

  return (
    <>
      {inventario && configuracionStock?.activo ? (
        <>
          <StockEntradaDialog
            inventario={inventario}
            productoNombre={producto.nombre}
            unidadMedida={producto.unidadMedida}
            open={entradaAbierta}
            onOpenChange={setEntradaAbierta}
          />
          <StockSalidaDialog
            inventario={inventario}
            productoNombre={producto.nombre}
            unidadMedida={producto.unidadMedida}
            open={salidaAbierta}
            onOpenChange={setSalidaAbierta}
          />
        </>
      ) : null}

      <TableRow className="transition-colors hover:bg-muted/30">
        <TableCell className="whitespace-normal">
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
            </div>
          </Link>
        </TableCell>
        {/* Backlog 4.7: la categoría dejó de ser el subtítulo del nombre y pasó
            a columna propia, para poder ordenar por ella y leerlo. */}
        <TableCell className="hidden md:table-cell">
          <Badge variant="secondary">
            {ETIQUETA_TIPO_PRODUCTO[producto.tipoProducto]}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <span className="text-sm text-foreground">
            {ETIQUETA_UNIDAD_MEDIDA[producto.unidadMedida]}
          </span>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <span className="text-sm text-foreground">
            {ETIQUETA_DEPARTAMENTO[producto.departamento]}
          </span>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <span className="text-sm text-foreground">
            {ETIQUETA_UBICACION[producto.ubicacion]}
          </span>
        </TableCell>
        {/* Backlog 4.8: "Los insumos con bajo stock se muestran resaltados en
            el módulo de inventario". El badge acompaña al color para que la
            alerta no dependa solo del tinte, y el title expone el mínimo
            contra el que se está comparando. */}
        <TableCell className="text-right">
          {inventario ? (
            <div className="flex items-center justify-end gap-2">
              {stockBajo ? (
                <Badge
                  variant="secondary"
                  className="hidden rounded-full border-transparent bg-orange-100 text-orange-800 sm:inline-flex dark:bg-orange-900/40 dark:text-orange-200"
                >
                  <TriangleAlertIcon className="size-3" aria-hidden="true" />
                  Stock bajo
                </Badge>
              ) : null}
              <span
                className={`text-sm font-medium tabular-nums ${
                  stockBajo
                    ? "text-orange-800 dark:text-orange-200"
                    : "text-foreground"
                }`}
                title={
                  configuracionStock
                    ? `Mínimo: ${configuracionStock.stockMinimo}`
                    : undefined
                }
              >
                {inventario.cantidadActual}
              </span>
            </div>
          ) : (
            <Badge variant="secondary">Sin existencias</Badge>
          )}
        </TableCell>
        <TableCell className="text-right">
          <AccionesMenu aria-label={`Acciones de ${producto.nombre}`}>
            <DropdownMenuItem
              render={<Link href={`/dashboard/inventario/${producto.id}`} />}
            >
              <EyeIcon />
              Ver detalle
            </DropdownMenuItem>

            <MostrarSiPuede modulo="INVENTARIO" nivel="COMPLETO">
              {inventario && configuracionStock?.activo ? (
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
              ) : null}
              {esAdministrador ? (
                <>
                  {!configuracionStock ? (
                    <DropdownMenuItem
                      render={
                        <Link
                          href={`/dashboard/inventario/${producto.id}/stock/nuevo`}
                        />
                      }
                    >
                      <PlusIcon />
                      Configuración de stock
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      render={
                        <Link
                          href={`/dashboard/inventario/stock/${configuracionStock.id}/editar`}
                        />
                      }
                    >
                      <PencilIcon />
                      Editar configuración
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    render={
                      <Link href={`/dashboard/inventario/${producto.id}/editar`} />
                    }
                  >
                    <PencilIcon />
                    Editar producto
                  </DropdownMenuItem>
                </>
              ) : null}
            </MostrarSiPuede>
          </AccionesMenu>
        </TableCell>
      </TableRow>
    </>
  );
}
