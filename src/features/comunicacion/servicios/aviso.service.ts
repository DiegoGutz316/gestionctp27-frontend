import { api } from "@/lib/api";
import type { ResultadoPaginado } from "@/lib/paginacion";

import type {
  AvisoRespuesta,
  ConsultarAvisos,
  RegistrarAviso,
} from "../validacion/aviso.validacion";

export function consultarAvisos(filtros: ConsultarAvisos = {}) {
  return api.get<ResultadoPaginado<AvisoRespuesta>>(
    "/comunicacion/avisos",
    filtros,
  );
}

export function registrarAviso(datos: RegistrarAviso) {
  return api.post<AvisoRespuesta>("/comunicacion/avisos", datos);
}

export { getMensajeDeError } from "@/lib/api";
