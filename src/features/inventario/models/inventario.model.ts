export const UNIDADES_MEDIDA = [
  "kg",
  "g",
  "L",
  "mL",
  "unidad",
  "saco",
  "caja",
] as const;

export type UnidadMedida = (typeof UNIDADES_MEDIDA)[number];

export const TIPOS_MOVIMIENTO = ["ENTRADA", "SALIDA"] as const;

export type TipoMovimiento = (typeof TIPOS_MOVIMIENTO)[number];

export const ETIQUETA_TIPO_MOVIMIENTO: Record<TipoMovimiento, string> = {
  ENTRADA: "Entrada",
  SALIDA: "Salida",
};

export type {
  CrearCategoriaInsumo,
  CrearInsumo,
  CrearInsumoInput,
  CategoriaInsumoRespuesta,
  InsumoRespuesta,
  FiltrarInsumos,
  EditarInsumo,
  EditarInsumoInput,
  RegistrarEntrada,
  RegistrarEntradaInput,
  MovimientoRespuesta,
  RegistrarSalida,
  RegistrarSalidaInput,
  MovimientoHistorial,
  ConsultarMovimientos,
} from "../validacion/inventario.validacion";

// Ojo: aquí solo se re-exportan **tipos**, que desaparecen al compilar. Un
// re-export de valores crearía un ciclo en tiempo de ejecución, porque
// `validacion` importa las constantes de este archivo: al cargarse `models`
// primero, `validacion` encontraría UNIDADES_MEDIDA todavía sin inicializar.
