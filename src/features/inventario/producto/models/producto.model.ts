export const TIPOS_PRODUCTO = ["INSUMO", "HERRAMIENTA", "EQUIPO"] as const;

export type TipoProducto = (typeof TIPOS_PRODUCTO)[number];

export const ETIQUETA_TIPO_PRODUCTO: Record<TipoProducto, string> = {
  INSUMO: "Insumo",
  HERRAMIENTA: "Herramienta",
  EQUIPO: "Equipo",
};

/**
 * Backlog 4.7: "Ordenar insumos por categoría o nombre". La categoría del
 * enunciado es el `tipoProducto`. Replica `OrdenProductos` del backend.
 */
export const ORDENES_PRODUCTOS = ["NOMBRE", "CATEGORIA"] as const;

export type OrdenProductos = (typeof ORDENES_PRODUCTOS)[number];

export const ETIQUETA_ORDEN_PRODUCTOS: Record<OrdenProductos, string> = {
  NOMBRE: "Nombre",
  CATEGORIA: "Categoría",
};

export const UNIDADES_MEDIDA = ["GRANEL", "UNIDAD"] as const;

export type UnidadMedida = (typeof UNIDADES_MEDIDA)[number];

export const ETIQUETA_UNIDAD_MEDIDA: Record<UnidadMedida, string> = {
  GRANEL: "Granel",
  UNIDAD: "Unidad",
};

export const DEPARTAMENTOS = ["AGRICOLA", "PECUARIO", "GENERAL"] as const;

export type Departamento = (typeof DEPARTAMENTOS)[number];

export const ETIQUETA_DEPARTAMENTO: Record<Departamento, string> = {
  AGRICOLA: "Agrícola",
  PECUARIO: "Pecuario",
  GENERAL: "General",
};

export const UBICACIONES = [
  "BODEGA_CENTRAL",
  "BODEGA_AGRICOLA",
  "BODEGA_PECUARIA",
  "TALLER",
] as const;

export type Ubicacion = (typeof UBICACIONES)[number];

export const ETIQUETA_UBICACION: Record<Ubicacion, string> = {
  BODEGA_CENTRAL: "Bodega central",
  BODEGA_AGRICOLA: "Bodega agrícola",
  BODEGA_PECUARIA: "Bodega pecuaria",
  TALLER: "Taller",
};

export type {
  CrearProducto,
  CrearProductoInput,
  EditarProducto,
  EditarProductoInput,
  FiltrarProductos,
  ProductoRespuesta,
} from "../validacion/producto.validacion";

/**
 * Backlog 4.8: "El sistema identifica automáticamente los insumos con cantidad
 * menor o igual al nivel mínimo definido".
 *
 * Vive aquí porque la regla se consulta desde tres pantallas (el listado, el
 * detalle del producto y el panel principal) y tenía tres copias distintas. Con
 * una sola definición no pueden discrepar entre sí.
 *
 * Un producto sin configuración de stock no tiene mínimo contra el cual
 * comparar, y uno sin registro de existencias todavía no tiene cantidad: en
 * ninguno de los dos casos hay alerta que mostrar.
 *
 * Una configuración **inactiva** tampoco alerta: su mínimo quedó obsoleto y el
 * backend rechaza cualquier entrada o salida contra ella con 404 ("El producto,
 * su configuración o su inventario no existe o está inactivo"). Avisar de un
 * faltante que nadie puede reponer es una alerta sin salida, y además
 * contradiría a la propia fila del listado, que oculta las acciones de stock
 * justamente cuando la configuración está inactiva.
 *
 * Recibe la forma mínima que necesita en vez de `ProductoRespuesta`, para no
 * importar nada desde `validacion/` y mantener este módulo sin dependencias en
 * runtime (que es lo que evita el ciclo de imports con los esquemas).
 */
export function esStockBajo(producto: {
  configuracionStock: { stockMinimo: number; activo: boolean } | null;
  inventario: { cantidadActual: number } | null;
}): boolean {
  const { configuracionStock, inventario } = producto;
  return (
    inventario !== null &&
    configuracionStock !== null &&
    configuracionStock.activo &&
    inventario.cantidadActual <= configuracionStock.stockMinimo
  );
}
