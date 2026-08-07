import { z } from "zod";
import { UNIDADES_MEDIDA } from "../models/inventario.model";

// Los formularios envían los campos numéricos como string; z.coerce los
// convierte a number y el genérico <number | string> mantiene z.input tipado.
const numeroDesdeInput = (mensaje: string) =>
  z.coerce.number<number | string>({ error: mensaje });

// z.coerce.number convierte '' (o solo espacios) en 0, ya que Number('') es 0.
// Sin esto, un campo numérico obligatorio dejado vacío pasaría los límites
// mínimos (p. ej. .min(0)) como si el usuario hubiera ingresado 0. Se
// transforma a undefined antes de coercionar para que el chequeo de
// obligatoriedad del campo lo rechace con su mensaje correspondiente.
const sinVacios = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (valor) => (typeof valor === "string" && valor.trim() === "" ? undefined : valor),
    schema,
  );

export const crearCategoriaInsumoSchema = z.object({
  nombre: z
    .string({ error: "El nombre de la categoría es obligatorio" })
    .trim()
    .min(1, "El nombre de la categoría es obligatorio")
    .max(60, "El nombre no puede superar 60 caracteres"),
});

export type CrearCategoriaInsumo = z.output<typeof crearCategoriaInsumoSchema>;

export const crearInsumoSchema = z.object({
  nombre: z
    .string({ error: "El nombre del insumo es obligatorio" })
    .trim()
    .min(1, "El nombre del insumo es obligatorio")
    .max(120, "El nombre no puede superar 120 caracteres"),
  categoriaId: sinVacios(
    numeroDesdeInput("Seleccione una categoría")
      .int("Seleccione una categoría")
      .positive("Seleccione una categoría"),
  ),
  unidadMedida: z.enum(UNIDADES_MEDIDA, {
    error: "Seleccione una unidad de medida válida",
  }),
  cantidad: sinVacios(
    numeroDesdeInput("La cantidad inicial es obligatoria").positive(
      "La cantidad inicial debe ser mayor que 0",
    ),
  ),
  nivelMinimo: sinVacios(
    numeroDesdeInput("El nivel mínimo es obligatorio").min(
      0,
      "El nivel mínimo debe ser 0 o mayor",
    ),
  ),
});

export type CrearInsumo = z.output<typeof crearInsumoSchema>;
export type CrearInsumoInput = z.input<typeof crearInsumoSchema>;

export const categoriaInsumoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  activo: z.boolean(),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export type CategoriaInsumoRespuesta = z.infer<typeof categoriaInsumoSchema>;

export const insumoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  categoria: categoriaInsumoSchema,
  unidadMedida: z.enum(UNIDADES_MEDIDA),
  cantidad: z.number(),
  nivelMinimo: z.number(),
  activo: z.boolean(),
  creadoPor: z.string().nullable(),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export type InsumoRespuesta = z.infer<typeof insumoSchema>;

// Filtros de búsqueda del listado de insumos (backlog 4.2). Todos opcionales:
// ausentes en la query string, llegan como undefined y no filtran.
export const filtrarInsumosSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Ingrese un texto de búsqueda")
    .max(120, "El nombre no puede superar 120 caracteres")
    .optional(),
  categoriaId: numeroDesdeInput("Categoría inválida")
    .int("Categoría inválida")
    .positive("Categoría inválida")
    .optional(),
});

export type FiltrarInsumos = z.output<typeof filtrarInsumosSchema>;

// Edición de insumos (backlog 4.3). La cantidad actual queda fuera: solo
// cambia mediante entradas y salidas de inventario (backlogs 4.4/4.6).
export const editarInsumoSchema = z.object({
  nombre: z
    .string({ error: "El nombre del insumo es obligatorio" })
    .trim()
    .min(1, "El nombre del insumo es obligatorio")
    .max(120, "El nombre no puede superar 120 caracteres"),
  categoriaId: sinVacios(
    numeroDesdeInput("Seleccione una categoría")
      .int("Seleccione una categoría")
      .positive("Seleccione una categoría"),
  ),
  unidadMedida: z.enum(UNIDADES_MEDIDA, {
    error: "Seleccione una unidad de medida válida",
  }),
  nivelMinimo: sinVacios(
    numeroDesdeInput("El nivel mínimo es obligatorio").min(
      0,
      "El nivel mínimo debe ser 0 o mayor",
    ),
  ),
});

export type EditarInsumo = z.output<typeof editarInsumoSchema>;
export type EditarInsumoInput = z.input<typeof editarInsumoSchema>;
