import { z } from "zod";

export const ROLES_USUARIO = [
  "ADMINISTRADOR",
  "DIRECTORA",
  "DOCENTE_PECUARIO",
  "DOCENTE_AGRICOLA",
  "ESTUDIANTE",
] as const;

export type RolUsuario = (typeof ROLES_USUARIO)[number];

export const ETIQUETA_ROL: Record<RolUsuario, string> = {
  ADMINISTRADOR: "Administrador",
  DIRECTORA: "Dirección",
  DOCENTE_PECUARIO: "Docente pecuario",
  DOCENTE_AGRICOLA: "Docente agrícola",
  ESTUDIANTE: "Estudiante",
};

export const crearUsuarioSchema = z.object({
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
  contrasena: z
    .string({ error: "La contraseña es obligatoria" })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña no puede superar 72 caracteres"),
  rol: z.enum(ROLES_USUARIO, {
    error: "Seleccione un rol válido",
  }),
  activo: z.boolean().optional().default(true),
});

export type CrearUsuario = z.output<typeof crearUsuarioSchema>;
export type CrearUsuarioInput = z.input<typeof crearUsuarioSchema>;

export const editarUsuarioSchema = z.object({
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
  rol: z.enum(ROLES_USUARIO, {
    error: "Seleccione un rol válido",
  }),
  activo: z.boolean({ error: "El estado activo debe ser verdadero o falso" }),
});

export type EditarUsuario = z.output<typeof editarUsuarioSchema>;
export type EditarUsuarioInput = z.input<typeof editarUsuarioSchema>;

export const usuarioSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string(),
  correo: z.string(),
  rol: z.enum(ROLES_USUARIO),
  activo: z.boolean(),
  creadoPor: z.string().uuid().nullable(),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export type UsuarioRespuesta = z.infer<typeof usuarioSchema>;

export const filtrarUsuariosSchema = z.object({
  busqueda: z
    .string()
    .trim()
    .min(1, "Ingrese un texto de búsqueda")
    .max(150, "La búsqueda no puede superar 150 caracteres")
    .optional(),
  rol: z.enum(ROLES_USUARIO).optional(),
  activo: z.boolean().optional(),
});

export type FiltrarUsuarios = z.output<typeof filtrarUsuariosSchema>;
