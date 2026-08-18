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
