import { api, ApiError } from "@/lib/api";
import type { ResultadoPaginado } from "@/lib/paginacion";
import type {
  CategoriaInsumoRespuesta,
  ConsultarEntradas,
  CrearCategoriaInsumo,
  CrearInsumo,
  EditarInsumo,
  EntradaRespuesta,
  FiltrarInsumos,
  InsumoRespuesta,
  MovimientoRespuesta,
  RegistrarEntrada,
} from "./models/inventario.model";

export function obtenerCategorias() {
  return api.get<CategoriaInsumoRespuesta[]>("/inventario/categorias");
}

export function crearCategoria(datos: CrearCategoriaInsumo) {
  return api.post<CategoriaInsumoRespuesta>("/inventario/categorias", datos);
}

export function obtenerInsumos(filtros: FiltrarInsumos = {}) {
  return api.get<InsumoRespuesta[]>("/inventario/insumos", {
    nombre: filtros.nombre,
    categoriaId: filtros.categoriaId,
  });
}

export function crearInsumo(datos: CrearInsumo) {
  return api.post<InsumoRespuesta>("/inventario/insumos", datos);
}

export function obtenerInsumo(id: number) {
  return api.get<InsumoRespuesta>(`/inventario/insumos/${id}`);
}

export function editarInsumo(id: number, datos: EditarInsumo) {
  return api.patch<InsumoRespuesta>(`/inventario/insumos/${id}`, datos);
}

/** Backlog 4.4: registra una entrada; el backend suma la cantidad al stock. */
export function registrarEntrada(datos: RegistrarEntrada) {
  return api.post<MovimientoRespuesta>("/inventario/entradas", datos);
}

/** Backlog 4.5: historial de entradas, paginado y filtrable. */
export function obtenerEntradas(filtros: ConsultarEntradas = {}) {
  return api.get<ResultadoPaginado<EntradaRespuesta>>("/inventario/entradas", {
    pagina: filtros.pagina,
    limite: filtros.limite,
    insumoId: filtros.insumoId,
    desde: filtros.desde,
    hasta: filtros.hasta,
  });
}

/**
 * Extrae un mensaje legible de los errores de la API.
 */
export function getMensajeDeError(error: unknown): string {
  if (error instanceof ApiError) {
    try {
      const body = JSON.parse(error.message) as {
        message?: string | string[];
        errors?: Array<{ message?: string }>;
      };
      if (Array.isArray(body.errors) && body.errors[0]?.message) {
        return body.errors[0].message;
      }
      if (Array.isArray(body.message) && body.message[0]) {
        return body.message[0];
      }
      if (
        typeof body.message === "string" &&
        body.message !== "Validation failed"
      ) {
        return body.message;
      }
    } catch {
      // El body no era JSON.
    }
    return "No se pudo completar la operación. Intente de nuevo.";
  }
  return "Error de conexión con el servidor.";
}
