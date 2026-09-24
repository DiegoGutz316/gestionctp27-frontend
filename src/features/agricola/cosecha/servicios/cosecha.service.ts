import { api } from "@/lib/api";

import type {
  ConsultarCosechas,
  CosechaRespuesta,
  RegistrarCosecha,
  ResultadoCosechas,
} from "../models/cosecha.model";

export function registrarCosecha(
  datos: RegistrarCosecha & { cerrarCiclo?: boolean },
) {
  return api.post<CosechaRespuesta>("/agricola/cosechas", datos);
}

export function consultarCosechas(filtros: ConsultarCosechas = {}) {
  return api.get<ResultadoCosechas>("/agricola/cosechas", filtros);
}

export { getMensajeDeError } from "@/lib/api";
