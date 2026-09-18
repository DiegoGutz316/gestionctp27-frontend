import { api } from "@/lib/api";

import type {
  CosechaRespuesta,
  RegistrarCosecha,
} from "../models/cosecha.model";

export function registrarCosecha(datos: RegistrarCosecha) {
  return api.post<CosechaRespuesta>("/agricola/cosechas", datos);
}

export { getMensajeDeError } from "@/lib/api";
