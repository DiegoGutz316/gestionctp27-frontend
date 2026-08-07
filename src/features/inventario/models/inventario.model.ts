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

export type {
  CrearCategoriaInsumo,
  CrearInsumo,
  CrearInsumoInput,
  CategoriaInsumoRespuesta,
  InsumoRespuesta,
  FiltrarInsumos,
  EditarInsumo,
  EditarInsumoInput,
} from "../validacion/inventario.validacion";
