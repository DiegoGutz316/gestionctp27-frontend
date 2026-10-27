import {
  ETIQUETA_ESPECIE_ANIMAL,
  type EspecieAnimal,
} from "../../animal/models/animal.model";

export const TIPOS_PRODUCCION = ["LECHE", "HUEVOS", "CARNE"] as const;

export type TipoProduccion = (typeof TIPOS_PRODUCCION)[number];

export const ETIQUETA_TIPO_PRODUCCION: Record<TipoProduccion, string> = {
  LECHE: "Leche",
  HUEVOS: "Huevos",
  CARNE: "Carne",
};

export const UNIDAD_TIPO_PRODUCCION: Record<TipoProduccion, string> = {
  LECHE: "L",
  HUEVOS: "unid.",
  CARNE: "kg",
};

/**
 * Tipos de producción que admite cada especie. Replica la regla del backend,
 * que rechaza con 400 cualquier otra combinación.
 */
export const TIPOS_PRODUCCION_POR_ESPECIE: Record<
  EspecieAnimal,
  readonly TipoProduccion[]
> = {
  VACA: ["LECHE", "CARNE"],
  CABRA: ["LECHE"],
  GALLINA: ["HUEVOS", "CARNE"],
  POLLO: ["CARNE"],
  CHANCHO: ["CARNE"],
};

/** Tipos permitidos para la especie; vacío si la especie no es conocida. */
export function tiposProduccionDeEspecie(
  especie: string | undefined,
): readonly TipoProduccion[] {
  if (!especie) return [];
  return TIPOS_PRODUCCION_POR_ESPECIE[especie as EspecieAnimal] ?? [];
}

export function etiquetaEspecieProduccion(especie: string): string {
  return ETIQUETA_ESPECIE_ANIMAL[especie as EspecieAnimal] ?? especie;
}

export function fechaHoyLocal(): string {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export function formatearFecha(valor: string): string {
  const iso = valor.slice(0, 10);
  const [anio, mes, dia] = iso.split("-").map(Number);
  if (!anio || !mes || !dia) return iso;
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-CR");
}

export function formatearCantidad(valor: number): string {
  return valor.toLocaleString("es-CR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function esAnimalActivo(estado: string): boolean {
  return estado.trim().toUpperCase() === "ACTIVO";
}

export type {
  ConsultaProduccion,
  ConsultarProduccion,
  ProduccionRespuesta,
  RegistrarProduccion,
  RegistrarProduccionInput,
} from "../validacion/produccion.validacion";
