import { z } from "zod";
import { paginarSchema, type ResultadoPaginado } from "@/lib/paginacion";

const tipoActividadSchema = z
  .string({ error: "El tipo de actividad es obligatorio" })
  .trim()
  .min(1, "El tipo de actividad es obligatorio")
  .max(120, "El tipo de actividad no puede superar 120 caracteres");

export const crearDepartamentoSchema = z.object({
  nombreUnidad: z
    .string({ error: "El nombre de la unidad es obligatorio" })
    .trim()
    .min(1, "El nombre de la unidad es obligatorio")
    .max(120, "El nombre de la unidad no puede superar 120 caracteres"),
  tipoActividad: tipoActividadSchema,
});

export type CrearDepartamento = z.output<typeof crearDepartamentoSchema>;
export type CrearDepartamentoInput = z.input<typeof crearDepartamentoSchema>;

export const editarDepartamentoSchema = z.object({
  nombreUnidad: z
    .string({ error: "El nombre de la unidad es obligatorio" })
    .trim()
    .min(1, "El nombre de la unidad es obligatorio")
    .max(120, "El nombre de la unidad no puede superar 120 caracteres"),
  tipoActividad: tipoActividadSchema,
});

export type EditarDepartamento = z.output<typeof editarDepartamentoSchema>;
export type EditarDepartamentoInput = z.input<typeof editarDepartamentoSchema>;

export const desactivarDepartamentoSchema = z.object({
  confirmar: z.boolean().refine((valor) => valor === true, {
    error: "Debe confirmar que desea desactivar el departamento",
  }),
});

export type DesactivarDepartamento = z.output<
  typeof desactivarDepartamentoSchema
>;
export type DesactivarDepartamentoInput = z.input<
  typeof desactivarDepartamentoSchema
>;

export const departamentoSchema = z.object({
  id: z.number(),
  nombreUnidad: z.string(),
  tipoActividad: z.string(),
  activo: z.boolean(),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export type DepartamentoRespuesta = z.infer<typeof departamentoSchema>;

export const filtrarDepartamentosSchema = paginarSchema.extend({
  tipoActividad: z.string().trim().max(120).optional(),
  activo: z.boolean().optional(),
});

export type FiltrarDepartamentos = z.output<typeof filtrarDepartamentosSchema>;

export type ResultadoPaginadoDepartamentos =
  ResultadoPaginado<DepartamentoRespuesta>;
