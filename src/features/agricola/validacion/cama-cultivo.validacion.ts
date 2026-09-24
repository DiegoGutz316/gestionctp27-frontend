import { z } from "zod";

/**
 * Estados válidos de una cama de cultivo. Deben coincidir con el enum del
 * backend.
 */
export const ESTADOS_CAMA_CULTIVO = [
  "DISPONIBLE",
  "EN_PREPARACION",
  "SEMBRADA",
  "EN_DESCANSO",
  "MANTENIMIENTO",
] as const;

export type EstadoCamaCultivo = (typeof ESTADOS_CAMA_CULTIVO)[number];

export const ETIQUETA_ESTADO_CAMA_CULTIVO: Record<
  EstadoCamaCultivo,
  string
> = {
  DISPONIBLE: "Disponible",
  EN_PREPARACION: "En preparación",
  SEMBRADA: "Sembrada",
  EN_DESCANSO: "En descanso",
  MANTENIMIENTO: "Mantenimiento",
};

/** Filtros del listado. `q` busca a la vez en código y estado. */
export const filtrarCamasCultivoSchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, "Ingrese un texto de búsqueda")
    .max(120, "La búsqueda no puede superar 120 caracteres")
    .optional(),
  ubicacion: z
    .string()
    .trim()
    .min(1, "Seleccione una ubicación válida")
    .max(120, "La ubicación no puede superar 120 caracteres")
    .optional(),
  camaId: z.number().int().positive().optional(),
});

export type FiltrarCamasCultivo = z.output<typeof filtrarCamasCultivoSchema>;

/** Ubicaciones que puede tener una cama. El filtro usa los mismos valores. */
export const INVERNADEROS = ["Invernadero 1", "Invernadero 2"] as const;

export const crearCamaCultivoSchema = z.object({
  codigo: z
    .string({ error: "El número de cama es obligatorio" })
    .trim()
    .min(1, "El número de cama es obligatorio")
    .max(50, "El número de cama no puede superar 50 caracteres"),

  ubicacion: z.enum(INVERNADEROS, {
    error: "Seleccione si está en el invernadero 1 o 2",
  }),

  observaciones: z.string().trim().optional(),
});

export type CrearCamaCultivo = z.output<typeof crearCamaCultivoSchema>;
export type CrearCamaCultivoInput = z.input<typeof crearCamaCultivoSchema>;

export const camaCultivoSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  ubicacion: z.string(),
  cultivoActual: z.string().nullable().optional(),
  estado: z.enum(ESTADOS_CAMA_CULTIVO),
  observaciones: z.string().nullable(),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
  actualizadoEn: z.string(),
  actualizadoPor: z.uuid().nullable(),
});

export type CamaCultivoRespuesta = z.infer<typeof camaCultivoSchema>;
