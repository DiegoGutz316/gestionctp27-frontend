import { z } from "zod";

import {
  CATEGORIAS_BOVINAS,
  ESPECIES_ANIMAL,
  ESTADOS_ANIMAL,
} from "../models/animal.model";

export const crearAnimalSchema = z
  .object({
    codigo: z
      .string({ error: "El código del animal es obligatorio" })
      .trim()
      .min(1, "El código del animal es obligatorio")
      .max(50, "El código no puede superar 50 caracteres"),

    nombre: z
      .string({ error: "El nombre del animal es obligatorio" })
      .trim()
      .min(1, "El nombre del animal es obligatorio")
      .max(120, "El nombre no puede superar 120 caracteres"),

    especie: z.enum(ESPECIES_ANIMAL, {
      error: "Seleccione una especie",
    }),

    categoriaBovina: z
      .union([z.enum(CATEGORIAS_BOVINAS), z.literal("")])
      .optional(),

    raza: z
      .string({ error: "La raza del animal es obligatoria" })
      .trim()
      .min(1, "La raza del animal es obligatoria")
      .max(100, "La raza no puede superar 100 caracteres"),

    fechaNacimiento: z
      .string({ error: "La fecha de nacimiento es obligatoria" })
      .min(1, "La fecha de nacimiento es obligatoria")
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "La fecha de nacimiento debe tener un formato válido",
      ),

    estado: z.enum(ESTADOS_ANIMAL, {
      error: "Seleccione un estado",
    }),

    observaciones: z.string().trim().optional(),
  })
  .superRefine((datos, contexto) => {
    if (datos.especie === "VACA" && !datos.categoriaBovina) {
      contexto.addIssue({
        code: "custom",
        path: ["categoriaBovina"],
        message: "Seleccione si es toro, novilla, vaca, ternero/a o torete",
      });
    }
  })
  .transform((datos) => ({
    ...datos,
    categoriaBovina:
      datos.especie === "VACA" && datos.categoriaBovina
        ? datos.categoriaBovina
        : undefined,
    observaciones: datos.observaciones || undefined,
  }));

export type CrearAnimal = z.output<typeof crearAnimalSchema>;
export type CrearAnimalInput = z.input<typeof crearAnimalSchema>;

export const animalSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  nombre: z.string(),
  especie: z.string(),
  categoriaBovina: z.string().nullable().optional(),
  raza: z.string(),
  fechaNacimiento: z.string(),
  estado: z.string(),
  observaciones: z.string().nullable(),
  creadoEn: z.string(),
  creadoPor: z.uuid(),
  actualizadoEn: z.string(),
  actualizadoPor: z.uuid().nullable(),
});

export type AnimalRespuesta = z.infer<typeof animalSchema>;
