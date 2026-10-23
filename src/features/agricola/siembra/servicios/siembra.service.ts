import { api } from "@/lib/api";

import type {
  ConsultarSiembras,
  MotivoFinalizacion,
  RegistrarSiembra,
  SiembraDetalle,
  SiembraRespuesta,
} from "../models/siembra.model";

export function finalizarSiembra(
  id: number,
  datos: { motivo: MotivoFinalizacion; detalle?: string },
) {
  return api.patch<SiembraRespuesta>(`/agricola/siembras/${id}/finalizar`, datos);
}

export function registrarSiembra(datos: RegistrarSiembra) {
  return api.post<SiembraRespuesta>("/agricola/siembras", datos);
}

export function consultarSiembras(filtros: ConsultarSiembras = {}) {
  return api.get<SiembraRespuesta[]>("/agricola/siembras", filtros);
}

export function obtenerDetalleSiembra(id: number) {
  return api.get<SiembraDetalle>(`/agricola/siembras/${id}`);
}

export { getMensajeDeError } from "@/lib/api";
