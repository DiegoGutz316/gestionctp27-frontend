import { z } from "zod";

import {
  ACENTOS_ESPECIALIDAD,
  ICONOS_ESPECIALIDAD,
} from "../models/especialidad.model";

const acentos = ACENTOS_ESPECIALIDAD.map((item) => item.value) as [
  string,
  ...string[],
];

export const especialidadSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  icono: z.enum(ICONOS_ESPECIALIDAD),
  acento: z.string(),
  fotoAlt: z.string(),
  posicionFoto: z.string().nullable(),
  fotoEstatica: z.string().nullable(),
  tieneFoto: z.boolean(),
  orden: z.number(),
  activo: z.boolean(),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export type EspecialidadRespuesta = z.infer<typeof especialidadSchema>;

export const crearEspecialidadSchema = z.object({
  nombre: z
    .string({ error: "El nombre es obligatorio" })
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(120, "El nombre no puede superar 120 caracteres"),
  descripcion: z
    .string({ error: "La descripción es obligatoria" })
    .trim()
    .min(1, "La descripción es obligatoria")
    .max(400, "La descripción no puede superar 400 caracteres"),
  icono: z.enum(ICONOS_ESPECIALIDAD, {
    error: "Seleccione un icono válido",
  }),
  acento: z.enum(acentos, { error: "Seleccione un acento válido" }),
  fotoAlt: z
    .string()
    .trim()
    .max(250, "El texto alternativo no puede superar 250 caracteres")
    .optional()
    .or(z.literal("")),
  posicionFoto: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("")),
  orden: z.number().int().min(0).optional(),
});

export type CrearEspecialidad = z.output<typeof crearEspecialidadSchema>;
export type CrearEspecialidadInput = z.input<typeof crearEspecialidadSchema>;

export function parsearEspecialidades(respuesta: unknown): EspecialidadRespuesta[] {
  const parseo = z.array(especialidadSchema).safeParse(respuesta);
  if (!parseo.success) {
    throw new Error("El servidor devolvió especialidades inválidas.");
  }
  return parseo.data;
}
