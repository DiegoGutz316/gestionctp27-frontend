import { z } from "zod";

import { animalSchema } from "../../animal/validacion/animal.validacion";
import { CONDICIONES_SALUD } from "../models/salud.model";

export const registrarSaludSchema = z.object({
  animalId: z
    .string({ error: "Seleccione un animal" })
    .min(1, "Seleccione un animal")
    .regex(/^\d+$/, "Seleccione un animal válido")
    .transform((valor) => Number(valor))
    .pipe(z.number().int().positive("Seleccione un animal válido")),

  fecha: z
    .string({ error: "La fecha es obligatoria" })
    .min(1, "La fecha es obligatoria")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener un formato válido"),

  condicionObservada: z.enum(CONDICIONES_SALUD, {
    error: "Seleccione una condición observada",
  }),

  diagnostico: z
    .string()
    .trim()
    .max(500, "El diagnóstico no puede superar 500 caracteres")
    .optional(),

  observaciones: z
    .string()
    .trim()
    .max(1000, "Las observaciones no pueden superar 1000 caracteres")
    .optional(),
});

export type RegistrarSalud = z.output<typeof registrarSaludSchema>;
export type RegistrarSaludInput = z.input<typeof registrarSaludSchema>;

export const saludSchema = z.object({
  id: z.number(),
  animalId: z.number(),
  fecha: z.string(),
  condicionObservada: z.enum(CONDICIONES_SALUD),
  diagnostico: z.string().nullable(),
  observaciones: z.string().nullable(),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
});

export type SaludRespuesta = z.infer<typeof saludSchema>;

export const historialSaludSchema = z.object({
  animal: animalSchema.pick({
    id: true,
    codigo: true,
    nombre: true,
    especie: true,
    estado: true,
  }),
  registros: z.array(saludSchema),
});

export type HistorialSalud = z.infer<typeof historialSaludSchema>;
