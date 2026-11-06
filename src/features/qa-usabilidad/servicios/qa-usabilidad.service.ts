import { api, apiFetch, getMensajeDeError } from "@/lib/api";

import type {
  CatalogoUsab,
  ParticipanteUsab,
  ResultadoUsab,
  RolPerfilParticipante,
  ResumenUsab,
  SesionUsab,
} from "../models/qa-usabilidad.model";

const BASE = "/qa/usabilidad";

export function obtenerCatalogoUsab() {
  return api.get<CatalogoUsab>(`${BASE}/catalogo`);
}

export function obtenerResumenUsab() {
  return api.get<ResumenUsab>(`${BASE}/resumen`);
}

export function listarParticipantesUsab() {
  return api.get<ParticipanteUsab[]>(`${BASE}/participantes`);
}

export function crearParticipanteUsab(datos: {
  codigo: string;
  rolPerfil: RolPerfilParticipante;
  notas?: string;
}) {
  return api.post<ParticipanteUsab>(`${BASE}/participantes`, datos);
}

export function listarSesionesUsab() {
  return api.get<SesionUsab[]>(`${BASE}/sesiones`);
}

export function obtenerSesionUsab(id: number) {
  return api.get<SesionUsab>(`${BASE}/sesiones/${id}`);
}

export function crearSesionUsab(datos: {
  participanteId: number;
  pruebaCodigo: string;
  fechaEjecucion: string;
  horaInicio?: string;
  horaFin?: string;
  tiempoMinutos?: number;
  resultado?: ResultadoUsab;
  errores?: number;
  ayudas?: number;
  observaciones?: string;
}) {
  return api.post<SesionUsab>(`${BASE}/sesiones`, datos);
}

export function actualizarSesionUsab(
  id: number,
  datos: {
    horaInicio?: string;
    horaFin?: string;
    tiempoMinutos?: number;
    resultado?: ResultadoUsab;
    errores?: number;
    ayudas?: number;
    observaciones?: string;
    motivoCambio?: string;
  },
) {
  return api.patch<SesionUsab>(`${BASE}/sesiones/${id}`, datos);
}

export function finalizarSesionUsab(id: number) {
  return api.post<SesionUsab>(`${BASE}/sesiones/${id}/finalizar`);
}

export function adjuntarEvidenciaUsab(sesionId: number, archivo: File) {
  const body = new FormData();
  body.append("archivo", archivo);
  return apiFetch<{
    id: number;
    nombreArchivo: string;
    mime: string;
    tamanoBytes: number;
    subidoEn: string;
  }>(`${BASE}/sesiones/${sesionId}/evidencias`, {
    method: "POST",
    body,
  });
}

export async function descargarInformeUsab() {
  const response = await api.descargar(`${BASE}/informe.md`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "informe-usabilidad-ctp27.md";
  a.click();
  URL.revokeObjectURL(url);
}

export async function descargarEvidenciaUsab(
  id: number,
  nombreArchivo: string,
) {
  const response = await api.descargar(`${BASE}/evidencias/${id}/archivo`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
}

export { getMensajeDeError };
