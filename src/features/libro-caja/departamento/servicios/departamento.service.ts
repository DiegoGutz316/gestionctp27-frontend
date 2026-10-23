import { api } from "@/lib/api";
import type {
  CrearDepartamento,
  DepartamentoRespuesta,
  EditarDepartamento,
  FiltrarDepartamentos,
  ResultadoPaginadoDepartamentos,
} from "../validacion/departamento.validacion";

const LIMITE_PAGINA = 100;

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

export async function listarDepartamentosActivos() {
  const primera = await listarDepartamentos({
    pagina: 1,
    limite: LIMITE_PAGINA,
    activo: true,
  });
  const acumulado = [...primera.datos];

  for (let pagina = 2; pagina <= primera.meta.totalPaginas; pagina += 1) {
    const siguiente = await listarDepartamentos({
      pagina,
      limite: LIMITE_PAGINA,
      activo: true,
    });
    acumulado.push(...siguiente.datos);
  }

  return acumulado;
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
