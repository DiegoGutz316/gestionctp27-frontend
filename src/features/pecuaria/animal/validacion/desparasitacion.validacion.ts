import { z } from "zod";

import { fechaHoyCR } from "@/lib/fechas";

/**
 * Backlog 2.7 (Registrar desparasitaciones). Espeja `CrearDesparasitacionDto`
 * del backend, para que el usuario vea el mismo error antes de enviar.
 */
export const crearDesparasitacionSchema = z.object({
  // El selector entrega texto; se convierte a número aquí. Sin selección el
  // valor es "", que da 0 y no pasa el positivo.
  animalId: z.coerce
    .number({ error: "Seleccione un animal" })
    .int("Seleccione un animal")
    .positive("Seleccione un animal"),

  producto: z
    .string({ error: "El producto aplicado es obligatorio" })
    .trim()
    .min(1, "El producto aplicado es obligatorio")
    .max(120, "El producto no puede superar 120 caracteres"),

  // `z.iso.date()` y no una expresión regular: la regular solo mira la forma
  // del texto, así que fechas que no existen en el calendario (2026-02-31,
  // 2025-02-29, mes 00) la superaban y encima colaban la comparación con hoy.
  // Es el mismo patrón que ya usa el módulo de stock.
  fecha: z
    .string({ error: "La fecha es obligatoria" })
    .min(1, "La fecha es obligatoria")
    .pipe(z.iso.date({ error: "Ingrese una fecha válida" }))
    .refine(
      (valor) => valor <= fechaHoyCR(),
      "La fecha no puede ser futura",
    ),

  observaciones: z
    .string()
    .trim()
    .max(500, "Las observaciones no pueden superar 500 caracteres")
    .optional(),
});

export type CrearDesparasitacion = z.output<
  typeof crearDesparasitacionSchema
>;

export const desparasitacionSchema = z.object({
  id: z.number(),
  animalId: z.number(),
  producto: z.string(),
  fecha: z.string(),
  observaciones: z.string().nullable(),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
});

export type DesparasitacionRespuesta = z.infer<
  typeof desparasitacionSchema
>;
