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

export function listarAnimales() {
  return api.get<AnimalRespuesta[]>(
    "/pecuaria/animales",
  );
}

export function obtenerAnimal(id: number) {
  return api.get<AnimalRespuesta>(
    `/pecuaria/animales/${id}`,
  );
}

export function editarAnimal(
  id: number,
  datos: CrearAnimal,
) {
  return api.patch<AnimalRespuesta>(
    `/pecuaria/animales/${id}`,
    datos,
  );
}

export { getMensajeDeError } from "@/lib/api";