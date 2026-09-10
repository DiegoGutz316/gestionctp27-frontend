import { api } from "@/lib/api";

import type {
  AnimalRespuesta,
  CrearAnimal,
  FiltrarAnimales,
} from "../validacion/animal.validacion";

export function crearAnimal(datos: CrearAnimal) {
  return api.post<AnimalRespuesta>(
    "/pecuaria/animales",
    datos,
  );
}

export function listarAnimales(
  filtros: FiltrarAnimales = {},
) {
  return api.get<AnimalRespuesta[]>(
    "/pecuaria/animales",
    {
      q: filtros.q,
      incluirInactivos: filtros.incluirInactivos,
      orden: filtros.orden,
    },
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

export function desactivarAnimal(id: number) {
  return api.patch<AnimalRespuesta>(
    `/pecuaria/animales/${id}/desactivar`,
  );
}

export { getMensajeDeError } from "@/lib/api";