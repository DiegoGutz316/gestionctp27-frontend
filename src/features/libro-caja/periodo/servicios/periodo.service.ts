import { api } from "@/lib/api";
import type {
  AbrirPeriodo,
  EditarPeriodo,
  FiltrarPeriodos,
  FondoRespuesta,
  PeriodoDetalleRespuesta,
  ResultadoPaginadoPeriodos,
  SolicitarFondo,
} from "../validacion/periodo.validacion";

export function listarPeriodos(filtros: FiltrarPeriodos = {}) {
  return api.get<ResultadoPaginadoPeriodos>("/libro-caja/periodos", {
    q: filtros.q,
    estado: filtros.estado,
    pagina: filtros.pagina,
    limite: filtros.limite,
  });
}

export function abrirPeriodo(datos: AbrirPeriodo) {
  return api.post<PeriodoDetalleRespuesta>("/libro-caja/periodos", datos);
}

export function obtenerPeriodo(id: number) {
  return api.get<PeriodoDetalleRespuesta>(`/libro-caja/periodos/${id}`);
}

export function editarPeriodo(id: number, datos: EditarPeriodo) {
  return api.patch<PeriodoDetalleRespuesta>(`/libro-caja/periodos/${id}`, datos);
}

export function cerrarPeriodo(id: number) {
  return api.post<PeriodoDetalleRespuesta>(`/libro-caja/periodos/${id}/cerrar`);
}

export function solicitarFondo(
  periodoId: number,
  fondoId: number,
  datos: SolicitarFondo,
) {
  return api.post<FondoRespuesta>(
    `/libro-caja/periodos/${periodoId}/fondos/${fondoId}/solicitar`,
    datos,
  );
}

export { getMensajeDeError } from "@/lib/api";
