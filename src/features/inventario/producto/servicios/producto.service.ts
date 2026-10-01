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
      orden: filtros.orden,
      pagina: filtros.pagina,
      limite: filtros.limite,
    })
    .then(parsearProductos);
}

/** Tope que acepta el backend en una sola página. */
const LIMITE_POR_PAGINA = 100;

/**
 * Freno de seguridad: 100 páginas son 10 000 productos, muy por encima de lo
 * que maneja el colegio. Evita un bucle infinito si la meta viniera mal.
 */
const PAGINAS_MAXIMAS = 100;

/**
 * Todos los productos, recorriendo las páginas que haga falta.
 *
 * Una sola consulta no alcanza: el backend acota `limite` a 100, así que a
 * partir del producto 101 quedaban fuera y no se podían elegir en los
 * selectores que filtran por producto.
 */
export async function listarTodosLosProductos(
  filtros: Omit<FiltrarProductos, "pagina" | "limite"> = {},
): Promise<ProductoRespuesta[]> {
  const productos: ProductoRespuesta[] = [];

  for (let pagina = 1; pagina <= PAGINAS_MAXIMAS; pagina += 1) {
    const respuesta = await listarProductos({
      ...filtros,
      pagina,
      limite: LIMITE_POR_PAGINA,
    });

    productos.push(...respuesta.datos);

    if (!respuesta.meta.tieneSiguiente) break;
  }

  return productos;
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
