import { api } from "@/lib/api";

import type {
  ConsultarCultivos,
  CultivoRespuesta,
  EditarCultivo,
  RegistrarCultivo,
} from "../models/cultivo.model";

export function registrarCultivo(datos: RegistrarCultivo) {
  return api.post<CultivoRespuesta>("/agricola/cultivos", datos);
}

export function consultarCultivos(filtros: ConsultarCultivos = {}) {
  return api.get<CultivoRespuesta[]>("/agricola/cultivos", filtros);
}

export function obtenerCultivo(id: number) {
  return api.get<CultivoRespuesta>(`/agricola/cultivos/${id}`);
}

export function editarCultivo(id: number, datos: EditarCultivo) {
  return api.patch<CultivoRespuesta>(`/agricola/cultivos/${id}`, datos);
}

/** El backend responde 409 si alguna siembra usa el cultivo. */
export function eliminarCultivo(id: number) {
  return api.delete<void>(`/agricola/cultivos/${id}`);
}

export { getMensajeDeError } from "@/lib/api";
