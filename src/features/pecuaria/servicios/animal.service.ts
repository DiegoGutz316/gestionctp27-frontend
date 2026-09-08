import { api } from "@/lib/api";

import type {
  AnimalRespuesta,
  CrearAnimal,
} from "../validacion/animal.validacion";

export function crearAnimal(datos: CrearAnimal) {
  return api.post<AnimalRespuesta>(
    "/pecuaria/animales",
    datos,
  );
}

export { getMensajeDeError } from "@/lib/api";