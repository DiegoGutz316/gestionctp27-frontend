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
} from "../validacion/inventario.validacion";
