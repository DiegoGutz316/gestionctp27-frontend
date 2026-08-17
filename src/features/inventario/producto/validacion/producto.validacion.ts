import { z } from "zod";
import {
  DEPARTAMENTOS,
  TIPOS_PRODUCTO,
  UBICACIONES,
  UNIDADES_MEDIDA,
} from "../models/producto.model";

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

const stockDeProductoSchema = z.object({
  id: z.number(),
  cantidad: z.number(),
  stockMinimo: z.number(),
  precio: z.number(),
  activo: z.boolean(),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export const productoRespuestaSchema = productoSchema.extend({
  // Al crear un producto la propiedad puede venir omitida; en consultas
  // viene como null hasta que se configure su único registro de stock.
  stock: stockDeProductoSchema.nullable().optional(),
});

export type ProductoRespuesta = z.infer<typeof productoRespuestaSchema>;

export const filtrarProductosSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Ingrese un texto de búsqueda")
    .max(120, "El nombre no puede superar 120 caracteres")
    .optional(),
  tipoProducto: z.enum(TIPOS_PRODUCTO).optional(),
  departamento: z.enum(DEPARTAMENTOS).optional(),
  ubicacion: z.enum(UBICACIONES).optional(),
});

export type FiltrarProductos = z.output<typeof filtrarProductosSchema>;

export { productoSchema };
