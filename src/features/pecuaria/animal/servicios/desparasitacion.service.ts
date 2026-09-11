import { api } from "@/lib/api";

import type {
  CrearDesparasitacion,
  DesparasitacionRespuesta,
} from "../validacion/desparasitacion.validacion";

export function crearDesparasitacion(
  datos: CrearDesparasitacion,
) {
  return api.post<DesparasitacionRespuesta>(
    "/pecuaria/desparasitaciones",
    datos,
  );
}

export function listarDesparasitacionesDeAnimal(
  animalId: number,
) {
  return api.get<DesparasitacionRespuesta[]>(
    `/pecuaria/animales/${animalId}/desparasitaciones`,
  );
}

export { getMensajeDeError } from "@/lib/api";
