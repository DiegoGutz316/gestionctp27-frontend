import { api } from "@/lib/api";
import type {
  ActualizarColegio,
  ColegioRespuesta,
} from "../validacion/colegio.validacion";

export function obtenerColegio() {
  return api.get<ColegioRespuesta>("/libro-caja/colegio");
}

export function actualizarColegio(datos: ActualizarColegio) {
  return api.put<ColegioRespuesta>("/libro-caja/colegio", datos);
}

export { getMensajeDeError } from "@/lib/api";
