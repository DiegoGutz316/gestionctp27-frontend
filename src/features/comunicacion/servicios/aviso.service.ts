import { ApiError, api } from "@/lib/api";
import type { ResultadoPaginado } from "@/lib/paginacion";

import type {
  AvisoPublico,
  AvisoRespuesta,
  CategoriaAviso,
  ConsultarAvisos,
  RegistrarAviso,
} from "../validacion/aviso.validacion";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function urlFlyerAviso(id: number) {
  return `${API_URL}/comunicacion/avisos/${id}/flyer`;
}

/**
 * Listado público de la landing. No usa el cliente autenticado: la página
 * institucional se consulta sin sesión y este endpoint ya existe.
 */
export async function consultarAvisosPublicos(
  limite = 12,
  categoria?: CategoriaAviso,
): Promise<AvisoPublico[]> {
  const params = new URLSearchParams({ limite: String(limite) });
  if (categoria) params.set("categoria", categoria);

  const respuesta = await fetch(
    `${API_URL}/comunicacion/avisos/publicos?${params.toString()}`,
    { cache: "no-store" },
  );

  if (!respuesta.ok) {
    const body = await respuesta.text().catch(() => "");
    throw new ApiError(
      respuesta.status,
      body || `Error ${respuesta.status} al consultar avisos públicos`,
    );
  }

  const cuerpo = (await respuesta.json()) as { datos?: AvisoPublico[] };
  return cuerpo.datos ?? [];
}

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
