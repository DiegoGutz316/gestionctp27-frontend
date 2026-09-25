import { api } from "@/lib/api";

import type {
  CamaCultivoRespuesta,
  CrearCamaCultivo,
  FiltrarCamasCultivo,
} from "../validacion/cama-cultivo.validacion";

export function crearCamaCultivo(datos: CrearCamaCultivo) {
  return api.post<CamaCultivoRespuesta>("/agricola/camas", datos);
}

export function listarCamasCultivo(
  filtros: FiltrarCamasCultivo = {},
) {
  return api.get<CamaCultivoRespuesta[]>("/agricola/camas", {
    q: filtros.q,
    ubicacion: filtros.ubicacion,
    camaId: filtros.camaId,
  });
}

/** Solo camas sin siembras: el backend responde 409 si está en uso. */
export function eliminarCamaCultivo(id: number) {
  return api.delete<void>(`/agricola/camas/${id}`);
}

export function obtenerCamaCultivo(id: number) {
  return api.get<CamaCultivoRespuesta>(`/agricola/camas/${id}`);
}

export function editarCamaCultivo(
  id: number,
  datos: CrearCamaCultivo,
) {
  return api.patch<CamaCultivoRespuesta>(
    `/agricola/camas/${id}`,
    datos,
  );
}

export { getMensajeDeError } from "@/lib/api";
