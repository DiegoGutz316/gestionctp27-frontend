import { api } from "@/lib/api";

import type {
  ConsultaProduccion,
  ConsultarProduccion,
  ProduccionRespuesta,
  RegistrarProduccion,
} from "../validacion/produccion.validacion";

export function registrarProduccion(datos: RegistrarProduccion) {
  return api.post<ProduccionRespuesta>(
    "/pecuaria/produccion",
    datos,
  );
}

export function consultarProduccion(filtros: ConsultarProduccion) {
  return api.get<ConsultaProduccion>(
    "/pecuaria/produccion",
    filtros,
  );
}

export { getMensajeDeError } from "@/lib/api";
