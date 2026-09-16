import { z } from "zod";

/**
 * Estados válidos de una cama de cultivo. Deben coincidir con el enum del
 * backend.
 */
export const ESTADOS_CAMA_CULTIVO = [
  "DISPONIBLE",
  "EN_USO",
  "MANTENIMIENTO",
] as const;

export type EstadoCamaCultivo = (typeof ESTADOS_CAMA_CULTIVO)[number];

export const ETIQUETA_ESTADO_CAMA_CULTIVO: Record<
  EstadoCamaCultivo,
  string
> = {
  DISPONIBLE: "Disponible",
  EN_USO: "En uso",
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
});

export type FiltrarCamasCultivo = z.output<typeof filtrarCamasCultivoSchema>;

export const crearCamaCultivoSchema = z.object({
  codigo: z
    .string({ error: "El código de la cama es obligatorio" })
    .trim()
    .min(1, "El código de la cama es obligatorio")
    .max(50, "El código no puede superar 50 caracteres"),

  ubicacion: z
    .string({ error: "La ubicación es obligatoria" })
    .trim()
    .min(1, "La ubicación es obligatoria")
    .max(120, "La ubicación no puede superar 120 caracteres"),

  estado: z.enum(ESTADOS_CAMA_CULTIVO, {
    error: "Seleccione un estado",
  }),

  observaciones: z.string().trim().optional(),
});

export type CrearCamaCultivo = z.output<typeof crearCamaCultivoSchema>;
export type CrearCamaCultivoInput = z.input<typeof crearCamaCultivoSchema>;

export const camaCultivoSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  ubicacion: z.string(),
  estado: z.enum(ESTADOS_CAMA_CULTIVO),
  observaciones: z.string().nullable(),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
  actualizadoEn: z.string(),
  actualizadoPor: z.uuid().nullable(),
});

export type CamaCultivoRespuesta = z.infer<typeof camaCultivoSchema>;
