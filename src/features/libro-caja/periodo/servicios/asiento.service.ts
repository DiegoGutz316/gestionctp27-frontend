import { api } from "@/lib/api";
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
) {
  return api.post<LibroDepartamentoRespuesta>(
    `/libro-caja/periodos/${periodoId}/fondos/${fondoId}/asientos`,
    datos,
  );
}

export { getMensajeDeError } from "@/lib/api";
