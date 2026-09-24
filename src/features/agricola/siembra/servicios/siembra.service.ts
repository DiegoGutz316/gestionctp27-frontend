import { api } from "@/lib/api";

import type { ConsultarSiembras, RegistrarSiembra, SiembraRespuesta } from "../models/siembra.model";

export function finalizarSiembra(id: number) {
  return api.patch<SiembraRespuesta>(`/agricola/siembras/${id}/finalizar`);
}

export function registrarSiembra(datos: RegistrarSiembra) {
  return api.post<SiembraRespuesta>("/agricola/siembras", datos);
}

export function consultarSiembras(filtros: ConsultarSiembras = {}) {
  return api.get<SiembraRespuesta[]>("/agricola/siembras", filtros);
}

export { getMensajeDeError } from "@/lib/api";
