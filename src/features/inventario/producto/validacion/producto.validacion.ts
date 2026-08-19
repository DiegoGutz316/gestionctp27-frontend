import { z } from "zod";
import {
  DEPARTAMENTOS,
  ORDENES_PRODUCTOS,
  TIPOS_PRODUCTO,
  UBICACIONES,
  UNIDADES_MEDIDA,
} from "../models/producto.model";
import {
  configuracionStockSchema,
  inventarioSchema,
} from "../../stock/models/stock.model";
import { paginarSchema, type ResultadoPaginado } from "@/lib/paginacion";

export const crearProductoSchema = z.object({
  nombre: z
    .string({ error: "El nombre del producto es obligatorio" })
    .trim()
    .min(1, "El nombre del producto es obligatorio")
    .max(120, "El nombre no puede superar 120 caracteres"),
  tipoProducto: z.enum(TIPOS_PRODUCTO, {
    error: "Seleccione un tipo de producto válido",
  }),
  unidadMedida: z.enum(UNIDADES_MEDIDA, {
    error: "Seleccione una unidad de medida válida",
  }),
  departamento: z.enum(DEPARTAMENTOS, {
    error: "Seleccione un departamento válido",
  }),
  ubicacion: z.enum(UBICACIONES, {
    error: "Seleccione una ubicación válida",
  }),
});

export type CrearProducto = z.output<typeof crearProductoSchema>;
export type CrearProductoInput = z.input<typeof crearProductoSchema>;

export const editarProductoSchema = z.object({
  nombre: z
    .string({ error: "El nombre del producto es obligatorio" })
    .trim()
    .min(1, "El nombre del producto es obligatorio")
    .max(120, "El nombre no puede superar 120 caracteres"),
  tipoProducto: z.enum(TIPOS_PRODUCTO, {
    error: "Seleccione un tipo de producto válido",
  }),
  unidadMedida: z.enum(UNIDADES_MEDIDA, {
    error: "Seleccione una unidad de medida válida",
  }),
  departamento: z.enum(DEPARTAMENTOS, {
    error: "Seleccione un departamento válido",
  }),
  ubicacion: z.enum(UBICACIONES, {
    error: "Seleccione una ubicación válida",
  }),
});

export type EditarProducto = z.output<typeof editarProductoSchema>;
export type EditarProductoInput = z.input<typeof editarProductoSchema>;

const productoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  tipoProducto: z.enum(TIPOS_PRODUCTO),
  unidadMedida: z.enum(UNIDADES_MEDIDA),
  departamento: z.enum(DEPARTAMENTOS),
  ubicacion: z.enum(UBICACIONES),
  activo: z.boolean(),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export const productoRespuestaSchema = productoSchema.extend({
  configuracionStock: configuracionStockSchema.nullable(),
  inventario: inventarioSchema.nullable(),
});

export type ProductoRespuesta = z.infer<typeof productoRespuestaSchema>;

const listadoProductosSchema = z.object({
  datos: z.array(productoRespuestaSchema),
  meta: z.object({
    pagina: z.number(),
    limite: z.number(),
    total: z.number(),
    totalPaginas: z.number(),
    tieneAnterior: z.boolean(),
    tieneSiguiente: z.boolean(),
  }),
});

export function parsearProductos(
  respuesta: unknown,
): ResultadoPaginado<ProductoRespuesta> {
  const parseo = listadoProductosSchema.safeParse(respuesta);
  if (!parseo.success) {
    throw new Error("El servidor devolvió un listado de productos inválido.");
  }
  return parseo.data;
}

export const filtrarProductosSchema = paginarSchema.omit({ q: true }).extend({
  nombre: z
    .string()
    .trim()
    .min(1, "Ingrese un texto de búsqueda")
    .max(120, "El nombre no puede superar 120 caracteres")
    .optional(),
  tipoProducto: z.enum(TIPOS_PRODUCTO).optional(),
  departamento: z.enum(DEPARTAMENTOS).optional(),
  ubicacion: z.enum(UBICACIONES).optional(),
  orden: z.enum(ORDENES_PRODUCTOS).optional(),
});

export type FiltrarProductos = z.output<typeof filtrarProductosSchema>;

export { productoSchema };
