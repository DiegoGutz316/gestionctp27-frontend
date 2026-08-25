import { z } from "zod";

export const actualizarColegioSchema = z.object({
  nombre: z
    .string({ error: "El nombre del colegio es obligatorio" })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede superar 150 caracteres"),
  numeroCuentaBancaria: z
    .string({ error: "El número de cuenta bancaria es obligatorio" })
    .trim()
    .min(1, "El número de cuenta bancaria es obligatorio")
    .max(50, "El número de cuenta no puede superar 50 caracteres"),
  entidadDeposito: z
    .string({ error: "La entidad de depósito es obligatoria" })
    .trim()
    .min(2, "La entidad de depósito debe tener al menos 2 caracteres")
    .max(150, "La entidad de depósito no puede superar 150 caracteres"),
});

export type ActualizarColegio = z.output<typeof actualizarColegioSchema>;
export type ActualizarColegioInput = z.input<typeof actualizarColegioSchema>;

export const colegioSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  numeroCuentaBancaria: z.string(),
  entidadDeposito: z.string(),
  actualizadoEn: z.string(),
});

export type ColegioRespuesta = z.infer<typeof colegioSchema>;
