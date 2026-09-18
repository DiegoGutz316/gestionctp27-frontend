import { api } from "@/lib/api";

import type {
  ConsultarTratamientos,
  RegistrarTratamiento,
  TratamientoRespuesta,
} from "../models/tratamiento.model";

export function registrarTratamiento(
  datos: RegistrarTratamiento,
) {
  return api.post<TratamientoRespuesta>(
    "/agricola/tratamientos",
    datos,
  );
}

export function consultarTratamientos(
  filtros: ConsultarTratamientos,
) {
  return api.get<TratamientoRespuesta[]>(
    "/agricola/tratamientos",
    filtros,
  );
}

export {
  getMensajeDeError,
} from "@/lib/api";