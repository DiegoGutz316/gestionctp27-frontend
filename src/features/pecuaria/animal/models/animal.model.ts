export const ESPECIES_ANIMAL = [
  "VACA",
  "CHANCHO",
  "GALLINA",
  "POLLO",
  "CABRA",
] as const;

export type EspecieAnimal = (typeof ESPECIES_ANIMAL)[number];

export const ETIQUETA_ESPECIE_ANIMAL: Record<EspecieAnimal, string> = {
  VACA: "Vaca",
  CHANCHO: "Chancho",
  GALLINA: "Gallina",
  POLLO: "Pollo",
  CABRA: "Cabra",
};

export const ESTADOS_ANIMAL = ["ACTIVO", "INACTIVO"] as const;

export type EstadoAnimal = (typeof ESTADOS_ANIMAL)[number];

export const ETIQUETA_ESTADO_ANIMAL: Record<EstadoAnimal, string> = {
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
};

export function etiquetaEspecie(especie: string): string {
  return ETIQUETA_ESPECIE_ANIMAL[especie as EspecieAnimal] ?? especie;
}

export const CATEGORIAS_BOVINAS = [
  "TORO",
  "NOVILLA",
  "VACA",
  "TERNERO",
  "TORETE",
] as const;

export type CategoriaBovina = (typeof CATEGORIAS_BOVINAS)[number];

export const ETIQUETA_CATEGORIA_BOVINA: Record<CategoriaBovina, string> = {
  TORO: "Toro",
  NOVILLA: "Novilla",
  VACA: "Vaca",
  TERNERO: "Ternero/a",
  TORETE: "Torete",
};

export const ESPECIES_MENORES = [
  "CHANCHO",
  "GALLINA",
  "POLLO",
  "CABRA",
] as const;

export function etiquetaCategoriaBovina(categoria: string | null | undefined): string {
  if (!categoria) return "—";
  return ETIQUETA_CATEGORIA_BOVINA[categoria as CategoriaBovina] ?? categoria;
}

export function esAnimalActivo(estado: string): boolean {
  return estado.trim().toUpperCase() === "ACTIVO";
}

export function esEspecieMenor(especie: string): boolean {
  return (ESPECIES_MENORES as readonly string[]).includes(especie);
}

export function esGanadoBovino(especie: string): boolean {
  return especie === "VACA";
}

export function edadEnAnios(fechaNacimiento: string, al = new Date()): number {
  const iso = fechaNacimiento.slice(0, 10);
  const [anio, mes, dia] = iso.split("-").map(Number);
  if (!anio || !mes || !dia) return 0;

  const nacimiento = new Date(anio, mes - 1, dia);
  const milisegundos = al.getTime() - nacimiento.getTime();
  if (milisegundos < 0) return 0;

  return Math.round((milisegundos / (365.25 * 24 * 60 * 60 * 1000)) * 10) / 10;
}

export function formatearEdadAnios(fechaNacimiento: string, al?: Date): string {
  return edadEnAnios(fechaNacimiento, al).toLocaleString("es-CR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}

export type {
  AnimalRespuesta,
  CrearAnimal,
  CrearAnimalInput,
} from "../validacion/animal.validacion";
