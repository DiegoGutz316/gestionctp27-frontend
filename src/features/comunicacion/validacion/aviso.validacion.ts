import { z } from "zod";

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
  ACTIVO: "Visible para quienes consulten los avisos.",
  INACTIVO: "Queda guardado pero no se muestra.",
};

/**
 * La fecha se valida con `z.iso.date()` y no con una expresión regular: la
 * regular solo mira la forma del texto y deja pasar fechas que no existen en
 * el calendario, como 2026-02-31.
 *
 * A diferencia del resto del sistema, aquí **sí** se admiten fechas futuras:
 * un aviso anuncia una actividad que todavía no ocurrió.
 */
const fechaAvisoSchema = z
  .string({ error: "La fecha del aviso es obligatoria" })
  .min(1, "La fecha del aviso es obligatoria")
  .pipe(z.iso.date({ error: "Ingrese una fecha válida" }));

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

  fecha: fechaAvisoSchema,

  estado: z.enum(ESTADOS_AVISO, { error: "Seleccione un estado válido" }),
});

export type RegistrarAviso = z.output<typeof registrarAvisoSchema>;

export const avisoSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  descripcion: z.string(),
  fecha: z.string(),
  estado: z.enum(ESTADOS_AVISO),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
});

export type AvisoRespuesta = z.infer<typeof avisoSchema>;

/**
 * Backlog 5.6: el listado va paginado porque los avisos solo se acumulan.
 * No lleva filtro de estado: el endpoint devuelve únicamente los activos.
 */
export type ConsultarAvisos = {
  pagina?: number;
  limite?: number;
};
