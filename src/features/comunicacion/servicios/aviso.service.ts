import { ApiError, api } from "@/lib/api";
import type { ResultadoPaginado } from "@/lib/paginacion";

import type {
  AvisoPublico,
  AvisoRespuesta,
  ConsultarAvisos,
  RegistrarAviso,
} from "../validacion/aviso.validacion";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function urlFlyerAviso(id: number) {
  return `${API_URL}/comunicacion/avisos/${id}/flyer`;
}

const LIMITE_PAGINA_PUBLICA = 100;
const MAX_PAGINAS_CALENDARIO = 10;

/**
 * Avisos activos para el calendario de la landing. Recorre las páginas del
 * endpoint público (tope 100 por página) para no quedarse en el primer lote.
 */
export async function consultarAvisosParaCalendario(): Promise<AvisoPublico[]> {
  const acumulado: AvisoPublico[] = [];

  for (let pagina = 1; pagina <= MAX_PAGINAS_CALENDARIO; pagina += 1) {
    const params = new URLSearchParams({
      limite: String(LIMITE_PAGINA_PUBLICA),
      pagina: String(pagina),
    });

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

    const cuerpo = (await respuesta.json()) as {
      datos?: AvisoPublico[];
      meta?: { totalPaginas?: number };
    };
    const datos = cuerpo.datos ?? [];
    acumulado.push(...datos);

    const totalPaginas = Math.max(1, cuerpo.meta?.totalPaginas ?? 1);
    if (pagina >= totalPaginas || datos.length === 0) break;
  }

  return acumulado;
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
