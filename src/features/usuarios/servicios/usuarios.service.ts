import { api } from "@/lib/api";
import type {
  CrearUsuario,
  EditarUsuario,
  PaginarUsuarios,
  ResultadoPaginadoUsuarios,
  UsuarioRespuesta,
} from "../validacion/usuario.validacion";

export function listarUsuarios(filtros: PaginarUsuarios = {}) {
  return api.get<ResultadoPaginadoUsuarios>("/usuarios", {
    pagina: filtros.pagina,
    limite: filtros.limite,
    q: filtros.q,
    rol: filtros.rol,
    activo: filtros.activo,
    order: filtros.order,
  });
}

export function crearUsuario(datos: CrearUsuario) {
  return api.post<UsuarioRespuesta>("/usuarios", datos);
}

export function obtenerUsuario(id: string) {
  return api.get<UsuarioRespuesta>(`/usuarios/${id}`);
}

export function editarUsuario(id: string, datos: EditarUsuario) {
  return api.patch<UsuarioRespuesta>(`/usuarios/${id}`, datos);
}

/** Desactivación lógica: PATCH /usuarios/:id/desactivar */
export function desactivarUsuario(id: string) {
  return api.patch<UsuarioRespuesta>(`/usuarios/${id}/desactivar`);
}

export { getMensajeDeError } from "@/lib/api";
