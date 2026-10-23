import { z } from "zod";

import { fechaHoyCR } from "@/lib/fechas";

/**
 * Backlog 5.5: estados de un aviso institucional. Deben coincidir con el enum
 * del backend.
 */
export const ESTADOS_AVISO = ["ACTIVO", "INACTIVO"] as const;

export type EstadoAviso = (typeof ESTADOS_AVISO)[number];

export const ETIQUETA_ESTADO_AVISO: Record<EstadoAviso, string> = {
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
};

export const DESCRIPCION_ESTADO_AVISO: Record<EstadoAviso, string> = {
  ACTIVO: "Este aviso será visible en la página institucional.",
  INACTIVO:
    "Este aviso se guardará, pero no será visible en la página institucional.",
};

/** Catálogo único de categorías. "Todos" es solo un filtro de la landing. */
export const CATEGORIAS_AVISO = [
  "ACADEMICOS",
  "EVENTOS",
  "COMUNIDAD",
  "ADMINISTRATIVOS",
] as const;

export type CategoriaAviso = (typeof CATEGORIAS_AVISO)[number];

export const ETIQUETA_CATEGORIA_AVISO: Record<CategoriaAviso, string> = {
  ACADEMICOS: "Académicos",
  EVENTOS: "Eventos",
  COMUNIDAD: "Comunidad",
  ADMINISTRATIVOS: "Administrativos",
};

/**
 * La fecha se valida con `z.iso.date()` y no con una expresión regular: la
 * regular solo mira la forma del texto y deja pasar fechas que no existen en
 * el calendario, como 2026-02-31.
 *
 * Un aviso anuncia algo que todavía no pasó, así que hoy y las fechas
 * posteriores sí; ayer y las anteriores no.
 */
const fechaAvisoSchema = z
  .string({ error: "La fecha del aviso es obligatoria" })
  .min(1, "La fecha del aviso es obligatoria")
  .pipe(z.iso.date({ error: "Ingrese una fecha válida" }))
  .refine((fecha) => fecha >= fechaHoyCR(), {
    error: "La fecha del aviso debe ser hoy o posterior",
  });

export const registrarAvisoSchema = z.object({
  titulo: z
    .string({ error: "El título es obligatorio" })
    .trim()
    .min(1, "El título es obligatorio")
    .max(150, "El título no puede superar 150 caracteres"),

  descripcion: z
    .string({ error: "La descripción es obligatoria" })
    .trim()
    .min(1, "La descripción es obligatoria")
    .max(2000, "La descripción no puede superar 2000 caracteres"),

  categoria: z.enum(CATEGORIAS_AVISO, {
    error: "Seleccione una categoría",
  }),

  fecha: fechaAvisoSchema,

  estado: z.enum(ESTADOS_AVISO, { error: "Seleccione un estado válido" }),
});

export type RegistrarAviso = z.output<typeof registrarAvisoSchema>;

export const avisoSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  descripcion: z.string(),
  fecha: z.string(),
  categoria: z.enum(CATEGORIAS_AVISO).nullable(),
  estado: z.enum(ESTADOS_AVISO),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
  actualizadoEn: z.string().nullable(),
  actualizadoPor: z.uuid().nullable(),
  tieneFlyer: z.boolean(),
});

export type AvisoRespuesta = z.infer<typeof avisoSchema>;

/**
 * Aviso que devuelve `GET /comunicacion/avisos/publicos`.
 * El endpoint ya aplica las reglas de activos y vigentes.
 * `creadoEn` es el momento de publicación. `categoria`, `fechaActividad`,
 * `prioridad` y `estado` se leen solo si el backend los envía.
 */
export type AvisoPublico = {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  tieneFlyer: boolean;
  categoria?: CategoriaAviso | null;
  estado?: EstadoAviso | null;
  creadoEn?: string | null;
  fechaActividad?: string | null;
  prioridad?: number | null;
};

/**
 * El listado administrativo puede filtrar por estado y título.
 * Sin `estado`, el backend sigue devolviendo solo los activos.
 */
export type ConsultarAvisos = {
  pagina?: number;
  limite?: number;
  estado?: EstadoAviso | "TODOS";
  q?: string;
};
