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

export type {
  CrearUsuario,
  CrearUsuarioInput,
  EditarUsuario,
  EditarUsuarioInput,
  DesactivarUsuario,
  DesactivarUsuarioInput,
  UsuarioRespuesta,
  PaginarUsuarios,
  ResultadoPaginadoUsuarios,
} from "../validacion/usuario.validacion";
