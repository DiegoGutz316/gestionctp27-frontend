import { api, getMensajeDeError, reintentarConsulta } from "@/lib/api";
import type {
  CrearAsiento,
  LibroDepartamentoRespuesta,
} from "../validacion/asiento.validacion";

export function listarAsientos(periodoId: number, fondoId: number) {
  return api.get<LibroDepartamentoRespuesta>(
    `/libro-caja/periodos/${periodoId}/fondos/${fondoId}/asientos`,
  );
}

export function crearAsiento(
  periodoId: number,
  fondoId: number,
  datos: CrearAsiento,
  idempotencyKey: string,
) {
  return api.post<LibroDepartamentoRespuesta>(
    `/libro-caja/periodos/${periodoId}/fondos/${fondoId}/asientos`,
    datos,
    { headers: { "Idempotency-Key": idempotencyKey } },
  );
}

export function actualizarAsiento(
  periodoId: number,
  fondoId: number,
  asientoId: number,
  datos: CrearAsiento,
) {
  return api.patch<LibroDepartamentoRespuesta>(
    `/libro-caja/periodos/${periodoId}/fondos/${fondoId}/asientos/${asientoId}`,
    datos,
  );
}

export function eliminarAsiento(
  periodoId: number,
  fondoId: number,
  asientoId: number,
) {
  return api.delete<LibroDepartamentoRespuesta>(
    `/libro-caja/periodos/${periodoId}/fondos/${fondoId}/asientos/${asientoId}`,
  );
}

export { getMensajeDeError, reintentarConsulta };
