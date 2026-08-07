import { z } from "zod";
import type { RolUsuario } from "@/features/usuarios/models/usuario.model";

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

export type UsuarioSesion = {
  id: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
};

export type RespuestaLogin = {
  expiraEn: string;
  usuario: UsuarioSesion;
};
