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

/**
 * Límites de las columnas numeric(12,2) del inventario (deben coincidir con
 * `dto/limites-numericos.ts` del backend). Si no se validan aquí, Postgres
 * redondea o desborda el valor y la API responde con un error genérico.
 */
export const VALOR_MAXIMO = 9999999999.99;
const VALOR_MAXIMO_TEXTO = VALOR_MAXIMO.toLocaleString("es-CR", {
  minimumFractionDigits: 2,
});

/**
 * Aplica a un número los límites de la columna: tope máximo y como mucho dos
 * decimales (más decimales los redondearía la base de datos en silencio).
 */
const acotarADecimal = (
  etiqueta: string,
  base: ReturnType<typeof numeroDesdeInput>,
) =>
  base
    .max(VALOR_MAXIMO, `${etiqueta} no puede superar ${VALOR_MAXIMO_TEXTO}`)
    .refine((valor) => Math.abs(valor * 100 - Math.round(valor * 100)) < 1e-9, {
      error: `${etiqueta} admite como máximo 2 decimales`,
    });

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
    acotarADecimal(
      "La cantidad inicial",
      numeroDesdeInput("La cantidad inicial es obligatoria").positive(
        "La cantidad inicial debe ser mayor que 0",
      ),
    ),
  ),
  nivelMinimo: sinVacios(
    acotarADecimal(
      "El nivel mínimo",
      numeroDesdeInput("El nivel mínimo es obligatorio").min(
        0,
        "El nivel mínimo debe ser 0 o mayor",
      ),
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

const insumoSchema = z.object({
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
const filtrarInsumosSchema = z.object({
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
    acotarADecimal(
      "El nivel mínimo",
      numeroDesdeInput("El nivel mínimo es obligatorio").min(
        0,
        "El nivel mínimo debe ser 0 o mayor",
      ),
    ),
  ),
});

export type EditarInsumo = z.output<typeof editarInsumoSchema>;
export type EditarInsumoInput = z.input<typeof editarInsumoSchema>;

// Registro de entradas de inventario (backlog 4.4). El responsable no se pide:
// lo toma el backend del usuario autenticado.
export const registrarEntradaSchema = z.object({
  insumoId: sinVacios(
    numeroDesdeInput("Seleccione un insumo")
      .int("Seleccione un insumo")
      .positive("Seleccione un insumo"),
  ),
  cantidad: sinVacios(
    acotarADecimal(
      "La cantidad",
      numeroDesdeInput("La cantidad es obligatoria").positive(
        "La cantidad debe ser mayor que 0",
      ),
    ),
  ),
  fecha: z
    .string({ error: "La fecha es obligatoria" })
    .min(1, "La fecha es obligatoria")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ingrese una fecha válida"),
  origen: z
    .string()
    .trim()
    .max(150, "El origen no puede superar 150 caracteres")
    .optional(),
});

export type RegistrarEntrada = z.output<typeof registrarEntradaSchema>;
export type RegistrarEntradaInput = z.input<typeof registrarEntradaSchema>;

// Respuesta del historial de movimientos (la reutilizará el backlog 4.5).
const movimientoSchema = z.object({
  id: z.number(),
  insumo: insumoSchema,
  tipo: z.enum(["ENTRADA", "SALIDA"]),
  cantidad: z.number(),
  fecha: z.string(),
  origen: z.string().nullable(),
  motivo: z.string().nullable(),
  responsableId: z.string(),
  creadoEn: z.string(),
});

export type MovimientoRespuesta = z.infer<typeof movimientoSchema>;

// Consulta del historial de entradas (backlog 4.5).
const entradaSchema = z.object({
  id: z.number(),
  cantidad: z.number(),
  fecha: z.string(),
  origen: z.string().nullable(),
  creadoEn: z.string(),
  insumo: z.object({
    id: z.number(),
    nombre: z.string(),
    unidadMedida: z.enum(UNIDADES_MEDIDA),
  }),
  responsable: z.object({ id: z.string(), nombre: z.string() }),
});

export type EntradaRespuesta = z.infer<typeof entradaSchema>;

/** Filtros del historial; se envían como query string y todos son opcionales. */
export const consultarEntradasSchema = z.object({
  pagina: z.number().int().min(1).optional(),
  limite: z.number().int().min(1).max(100).optional(),
  insumoId: z.number().int().positive().optional(),
  desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida").optional(),
  hasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida").optional(),
});

export type ConsultarEntradas = z.output<typeof consultarEntradasSchema>;
