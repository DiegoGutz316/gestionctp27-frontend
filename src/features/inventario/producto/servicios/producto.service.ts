import { api } from "@/lib/api";
import { parsearProductos } from "../validacion/producto.validacion";
import type {
  CrearProducto,
  EditarProducto,
  FiltrarProductos,
  ProductoRespuesta,
} from "../validacion/producto.validacion";

export function listarProductos(filtros: FiltrarProductos = {}) {
  return api
    .get<unknown>("/inventario/productos", {
      nombre: filtros.nombre,
      tipoProducto: filtros.tipoProducto,
      departamento: filtros.departamento,
      ubicacion: filtros.ubicacion,
      pagina: filtros.pagina,
      limite: filtros.limite,
    })
    .then(parsearProductos);
}

export function crearProducto(datos: CrearProducto) {
  return api.post<ProductoRespuesta>("/inventario/productos", datos);
}

export function obtenerProducto(id: number) {
  return api.get<ProductoRespuesta>(`/inventario/productos/${id}`);
}

export function editarProducto(id: number, datos: EditarProducto) {
  return api.patch<ProductoRespuesta>(`/inventario/productos/${id}`, datos);
}

export { getMensajeDeError } from "@/lib/api";
