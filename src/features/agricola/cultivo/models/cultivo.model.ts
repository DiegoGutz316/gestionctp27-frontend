import { z } from "zod";

export const TIPOS_CULTIVO = [
  "HORTALIZA",
  "VERDURA",
  "GRANO_BASICO",
  "RAIZ_TUBERCULO",
  "FRUTA",
  "HIERBA_AROMATICA",
  "OTRO",
] as const;

export type TipoCultivo = (typeof TIPOS_CULTIVO)[number];

export const ETIQUETA_TIPO_CULTIVO: Record<TipoCultivo, string> = {
  HORTALIZA: "Hortaliza",
  VERDURA: "Verdura",
  GRANO_BASICO: "Grano básico",
  RAIZ_TUBERCULO: "Raíz o tubérculo",
  FRUTA: "Fruta",
  HIERBA_AROMATICA: "Hierba aromática",
  OTRO: "Otro",
};

export const registrarCultivoSchema = z.object({
  nombre: z
    .string({ error: "El nombre del cultivo es obligatorio" })
    .trim()
    .min(2, "El nombre del cultivo es obligatorio")
    .max(120, "El nombre no puede superar 120 caracteres"),

  tipo: z.enum(TIPOS_CULTIVO, { error: "Seleccione el tipo de cultivo" }),

  descripcion: z
    .string()
    .trim()
    .max(500, "La descripción no puede superar 500 caracteres")
    .optional(),
});

export type RegistrarCultivo = z.output<typeof registrarCultivoSchema>;
export type RegistrarCultivoInput = z.input<typeof registrarCultivoSchema>;

/** Al editar se envía lo mismo, más el estado activo. */
export const editarCultivoSchema = registrarCultivoSchema.extend({
  activo: z.boolean(),
});

export type EditarCultivo = z.output<typeof editarCultivoSchema>;

export const cultivoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  tipo: z.enum(TIPOS_CULTIVO),
  descripcion: z.string().nullable(),
  activo: z.boolean(),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
});

export type CultivoRespuesta = z.infer<typeof cultivoSchema>;

export type ConsultarCultivos = {
  soloActivos?: boolean;
  tipo?: TipoCultivo;
  q?: string;
};
