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

export const actualizarPerfilSchema = z.object({
  nombre: z
    .string({ error: "El nombre es obligatorio" })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre no puede superar 120 caracteres"),
  correo: z
    .string({ error: "El correo es obligatorio" })
    .trim()
    .min(1, "El correo es obligatorio")
    .max(150, "El correo no puede superar 150 caracteres")
    .email("Debe ingresar un correo válido")
    .transform((valor) => valor.toLowerCase()),
});

export type ActualizarPerfil = z.output<typeof actualizarPerfilSchema>;
export type ActualizarPerfilInput = z.input<typeof actualizarPerfilSchema>;

export const cambiarContrasenaSchema = z
  .object({
    contrasenaActual: z
      .string({ error: "La contraseña actual es obligatoria" })
      .min(1, "La contraseña actual es obligatoria")
      .max(72, "La contraseña no puede superar 72 caracteres"),
    contrasenaNueva: z
      .string({ error: "La nueva contraseña es obligatoria" })
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(72, "La contraseña no puede superar 72 caracteres"),
    confirmar: z
      .string({ error: "Confirme la nueva contraseña" })
      .min(1, "Confirme la nueva contraseña"),
  })
  .refine((datos) => datos.contrasenaNueva === datos.confirmar, {
    path: ["confirmar"],
    error: "Las contraseñas no coinciden",
  })
  .refine((datos) => datos.contrasenaNueva !== datos.contrasenaActual, {
    path: ["contrasenaNueva"],
    error: "La nueva contraseña debe ser distinta a la actual",
  });

export type CambiarContrasena = z.output<typeof cambiarContrasenaSchema>;
export type CambiarContrasenaInput = z.input<typeof cambiarContrasenaSchema>;

export const solicitarRestablecimientoSchema = z.object({
  correo: z
    .string({ error: "El correo es obligatorio" })
    .trim()
    .min(1, "El correo es obligatorio")
    .email("Debe ingresar un correo válido")
    .transform((valor) => valor.toLowerCase()),
});

export type SolicitarRestablecimiento = z.output<
  typeof solicitarRestablecimientoSchema
>;
export type SolicitarRestablecimientoInput = z.input<
  typeof solicitarRestablecimientoSchema
>;

export const restablecerContrasenaSchema = z
  .object({
    token: z
      .string({ error: "El enlace de restablecimiento no es válido" })
      .trim()
      .min(1, "El enlace de restablecimiento no es válido"),
    contrasenaNueva: z
      .string({ error: "La nueva contraseña es obligatoria" })
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(72, "La contraseña no puede superar 72 caracteres"),
    confirmar: z
      .string({ error: "Confirme la nueva contraseña" })
      .min(1, "Confirme la nueva contraseña"),
  })
  .refine((datos) => datos.contrasenaNueva === datos.confirmar, {
    path: ["confirmar"],
    error: "Las contraseñas no coinciden",
  });

export type RestablecerContrasena = z.output<typeof restablecerContrasenaSchema>;
export type RestablecerContrasenaInput = z.input<typeof restablecerContrasenaSchema>;
