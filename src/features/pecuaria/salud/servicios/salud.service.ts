import { api } from "@/lib/api";

import type {
  HistorialSalud,
  RegistrarSalud,
  SaludRespuesta,
} from "../validacion/salud.validacion";

export function registrarSalud(datos: RegistrarSalud) {
  return api.post<SaludRespuesta>("/pecuaria/salud", datos);
}

export function consultarSalud(animalId: number) {
  return api.get<HistorialSalud>("/pecuaria/salud", { animalId });
}

export { getMensajeDeError } from "@/lib/api";
