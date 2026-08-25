import { api } from "@/lib/api";
import type {
  CrearDepartamento,
  DepartamentoRespuesta,
  EditarDepartamento,
  FiltrarDepartamentos,
  ResultadoPaginadoDepartamentos,
} from "../validacion/departamento.validacion";

export function listarDepartamentos(filtros: FiltrarDepartamentos = {}) {
  return api.get<ResultadoPaginadoDepartamentos>(
    "/libro-caja/departamentos",
    {
      q: filtros.q,
      tipoActividad: filtros.tipoActividad,
      activo: filtros.activo,
      pagina: filtros.pagina,
      limite: filtros.limite,
    },
  );
}

export function crearDepartamento(datos: CrearDepartamento) {
  return api.post<DepartamentoRespuesta>("/libro-caja/departamentos", datos);
}

export function obtenerDepartamento(id: number) {
  return api.get<DepartamentoRespuesta>(`/libro-caja/departamentos/${id}`);
}

export function editarDepartamento(id: number, datos: EditarDepartamento) {
  return api.patch<DepartamentoRespuesta>(
    `/libro-caja/departamentos/${id}`,
    datos,
  );
}

export function desactivarDepartamento(id: number) {
  return api.patch<DepartamentoRespuesta>(
    `/libro-caja/departamentos/${id}/desactivar`,
  );
}

export { getMensajeDeError } from "@/lib/api";
