import { z } from "zod";

export const crearAnimalSchema = z.object({
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

  especie: z
    .string({ error: "La especie del animal es obligatoria" })
    .trim()
    .min(1, "La especie del animal es obligatoria")
    .max(80, "La especie no puede superar 80 caracteres"),

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

  estado: z
    .string({ error: "El estado del animal es obligatorio" })
    .trim()
    .min(1, "El estado del animal es obligatorio")
    .max(50, "El estado no puede superar 50 caracteres"),

  observaciones: z.string().trim().optional(),
});

export type CrearAnimal = z.output<typeof crearAnimalSchema>;
export type CrearAnimalInput = z.input<typeof crearAnimalSchema>;

export const animalSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  nombre: z.string(),
  especie: z.string(),
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