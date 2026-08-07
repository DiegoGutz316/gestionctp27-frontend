import { z } from "zod";

export const loginSchema = z.object({
  correo: z
    .string({ error: "El correo es obligatorio" })
    .trim()
    .min(1, "El correo es obligatorio")
    .email("Debe ingresar un correo válido")
    .transform((valor) => valor.toLowerCase()),
  contrasena: z
    .string({ error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria"),
});

export type LoginInput = z.input<typeof loginSchema>;
export type LoginDatos = z.output<typeof loginSchema>;
