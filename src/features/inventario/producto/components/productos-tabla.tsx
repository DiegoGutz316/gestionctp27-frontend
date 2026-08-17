"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProductoRespuesta } from "../validacion/producto.validacion";
import { ProductoFila } from "./producto-fila";

type ProductosTablaProps = {
  cargando: boolean;
  error: boolean;
  productos: ProductoRespuesta[];
  mensajeError?: string;
  vacioConFiltros?: boolean;
};

export function ProductosTabla({
  cargando,
  error,
  productos,
  mensajeError,
  vacioConFiltros = false,
}: ProductosTablaProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Producto
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Unidad
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Departamento
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Ubicación
            </TableHead>
            <TableHead className="py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Stock
            </TableHead>
            <TableHead className="w-[1%] py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cargando &&
            Array.from({ length: 5 }, (_, index) => `skeleton-${index}`).map(
              (key) => (
                <TableRow key={key}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-9 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto size-8" />
                  </TableCell>
                </TableRow>
              ),
            )}

          {error && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-16 text-center text-sm text-destructive"
              >
                {mensajeError ??
                  "No se pudieron cargar los productos. Verifique la conexión con el servidor."}
              </TableCell>
            </TableRow>
          )}

          {!cargando && !error && productos.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-16 text-center text-sm text-muted-foreground"
              >
                {vacioConFiltros
                  ? "No hay productos que coincidan con la búsqueda."
                  : "Todavía no hay productos registrados."}
              </TableCell>
            </TableRow>
          )}

          {productos.map((producto) => (
            <ProductoFila key={producto.id} producto={producto} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
