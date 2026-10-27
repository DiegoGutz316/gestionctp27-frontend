import { api, getMensajeDeError } from "@/lib/api";

import {
  parsearEspecialidades,
  type CrearEspecialidad,
  type EspecialidadRespuesta,
} from "../validacion/especialidad.validacion";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function urlFotoEspecialidad(id: number): string {
  return `${API_URL}/landing/especialidades/${id}/foto`;
}

export function urlFotoEspecialidadGestion(id: number): string {
  return `${API_URL}/landing/especialidades/${id}/foto/gestion`;
}

export function urlFotoVisible(especialidad: EspecialidadRespuesta): string {
  if (especialidad.tieneFoto) {
    return urlFotoEspecialidad(especialidad.id);
  }
  return especialidad.fotoEstatica ?? "/landing/especialidades/produccion-pecuaria-campo.jpg";
}

export async function listarEspecialidadesPublicas() {
  const datos = await api.get<unknown>("/landing/especialidades/publicas");
  return parsearEspecialidades(datos);
}

export async function listarEspecialidadesGestion() {
  const datos = await api.get<unknown>("/landing/especialidades");
  return parsearEspecialidades(datos);
}

export function crearEspecialidad(datos: CrearEspecialidad) {
  return api.post<EspecialidadRespuesta>("/landing/especialidades", datos);
}

export function editarEspecialidad(id: number, datos: CrearEspecialidad) {
  return api.patch<EspecialidadRespuesta>(`/landing/especialidades/${id}`, datos);
}

export function desactivarEspecialidad(id: number) {
  return api.delete<EspecialidadRespuesta>(`/landing/especialidades/${id}`);
}

export function reactivarEspecialidad(id: number) {
  return api.post<EspecialidadRespuesta>(
    `/landing/especialidades/${id}/reactivar`,
  );
}

export function subirFotoEspecialidad(id: number, archivo: File) {
  const datos = new FormData();
  datos.append("foto", archivo);
  return api.enviarArchivo<EspecialidadRespuesta>(
    `/landing/especialidades/${id}/foto`,
    datos,
  );
}

export function quitarFotoEspecialidad(id: number) {
  return api.delete<EspecialidadRespuesta>(`/landing/especialidades/${id}/foto`);
}

export { getMensajeDeError };
