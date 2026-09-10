import { api } from "@/lib/api";

import type {
  CrearVacuna,
  VacunaRespuesta,
} from "../validacion/vacuna.validacion";

export function crearVacuna(datos: CrearVacuna) {
  return api.post<VacunaRespuesta>("/pecuaria/vacunas", datos);
}

export function listarVacunasDeAnimal(animalId: number) {
  return api.get<VacunaRespuesta[]>(
    `/pecuaria/vacunas/animal/${animalId}`,
  );
}

export { getMensajeDeError } from "@/lib/api";
