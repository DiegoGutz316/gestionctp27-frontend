import { api } from "@/lib/api";

import type {
  ConsultarCosechas,
  CosechaRespuesta,
  RegistrarCosecha,
} from "../models/cosecha.model";

export function registrarCosecha(datos: RegistrarCosecha) {
  return api.post<CosechaRespuesta>("/agricola/cosechas", datos);
}

export function consultarCosechas(filtros: ConsultarCosechas = {}) {
  return api.get<CosechaRespuesta[]>("/agricola/cosechas", filtros);
}

export { getMensajeDeError } from "@/lib/api";
