import { z } from "zod";

import { contarCaracteres } from "@/lib/texto";

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

/**
 * Los límites se cuentan por carácter, no por unidad UTF-16, para que el
 * formulario acepte y rechace exactamente lo mismo que la API y la BD: con
 * `.min()`/`.max()` un emoji valdría 2 y los tres niveles no coincidirían.
 */
export const registrarCultivoSchema = z.object({
  nombre: z
    .string({ error: "El nombre del cultivo es obligatorio" })
    .trim()
    .refine(
      (nombre) => contarCaracteres(nombre) >= 2,
      "El nombre del cultivo es obligatorio",
    )
    .refine(
      (nombre) => contarCaracteres(nombre) <= 120,
      "El nombre no puede superar 120 caracteres",
    ),

  tipo: z.enum(TIPOS_CULTIVO, { error: "Seleccione el tipo de cultivo" }),

  descripcion: z
    .string()
    .trim()
    .refine(
      (descripcion) => contarCaracteres(descripcion) <= 500,
      "La descripción no puede superar 500 caracteres",
    )
    .optional(),
});

export type RegistrarCultivo = z.output<typeof registrarCultivoSchema>;
export type RegistrarCultivoInput = z.input<typeof registrarCultivoSchema>;

/** Al editar se envía lo mismo, más el estado activo. */
export const editarCultivoSchema = registrarCultivoSchema.extend({
  activo: z.boolean(),
});

export type EditarCultivo = z.output<typeof editarCultivoSchema>;

/**
 * Lo que viaja en el `PATCH`: solo los campos que el usuario cambió, para no
 * pisar lo que otra persona haya editado mientras el formulario estaba
 * abierto. `descripcion: null` es la forma de borrarla; omitirla la conserva.
 */
export type CambiosDeCultivo = {
  nombre?: string;
  tipo?: TipoCultivo;
  descripcion?: string | null;
  activo?: boolean;
};

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
