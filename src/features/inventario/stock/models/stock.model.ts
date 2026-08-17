export type {
  CrearInventario,
  CrearInventarioInput,
  EditarInventario,
  EditarInventarioInput,
  StockRespuesta,
} from "../validacion/stock.validacion";

import type { ProductoRespuesta } from "../../producto/validacion/producto.validacion";
import type { StockRespuesta } from "../validacion/stock.validacion";

/** Convierte el stock incluido en Producto al contrato completo de stock. */
export function stockDeProducto(
  producto: ProductoRespuesta,
): StockRespuesta | null {
  const { stock, ...productoBase } = producto;
  return stock ? { ...stock, producto: productoBase } : null;
}
