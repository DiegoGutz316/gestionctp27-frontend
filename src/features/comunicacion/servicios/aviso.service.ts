import { api } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function urlFlyerAviso(id: number) {
  return `${API_URL}/comunicacion/avisos/${id}/flyer`;
}
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

export function obtenerAviso(id: number) {
  return api.get<AvisoRespuesta>(`/comunicacion/avisos/${id}`);
}

export function editarAviso(id: number, datos: RegistrarAviso) {
  return api.patch<AvisoRespuesta>(`/comunicacion/avisos/${id}`, datos);
}

export function desactivarAviso(id: number) {
  return api.patch<AvisoRespuesta>(`/comunicacion/avisos/${id}/desactivar`);
}

export function subirFlyerAviso(id: number, archivo: File) {
  const datos = new FormData();
  datos.append("flyer", archivo);
  return api.enviarArchivo<AvisoRespuesta>(
    `/comunicacion/avisos/${id}/flyer`,
    datos,
  );
}

export function quitarFlyerAviso(id: number) {
  return api.delete<AvisoRespuesta>(`/comunicacion/avisos/${id}/flyer`);
}

export { getMensajeDeError } from "@/lib/api";
