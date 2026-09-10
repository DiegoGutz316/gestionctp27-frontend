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

  fecha: z
    .string({ error: "La fecha es obligatoria" })
    .min(1, "La fecha es obligatoria")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener un formato válido")
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
