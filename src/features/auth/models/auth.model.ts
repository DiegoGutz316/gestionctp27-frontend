import type { RolUsuario } from "@/features/usuarios/models/usuario.model";

export type { LoginDatos, LoginInput } from "../validacion/auth.validacion";

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
