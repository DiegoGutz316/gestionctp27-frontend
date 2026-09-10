import {
  esAnimalActivo,
  esEspecieMenor,
  esGanadoBovino,
  type CategoriaBovina,
  type AnimalRespuesta,
} from "@/features/pecuaria/animal/models/animal.model";

export type TipoInventarioPecuaria = "especies-menores" | "ganado-bovino";

export type PieInventarioMep = {
  centroEducativo: string;
  nombreUnidad: string;
  fecha: string;
  director: string;
  presidente: string;
  firmaDirector: string;
  firmaPresidente: string;
  coordinador: string;
};

export const UNIDAD_ESPECIES_MENORES =
  "Engorde de cerdos y venta de cerdos de un mes (Especialidad Agropecuaria)";

export const UNIDAD_GANADO_BOVINO = "Ganadería doble propósito";

function fechaLocalIso(): string {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export function pieInventarioInicial(
  tipo: TipoInventarioPecuaria,
): PieInventarioMep {
  return {
    centroEducativo: "",
    nombreUnidad:
      tipo === "ganado-bovino" ? UNIDAD_GANADO_BOVINO : UNIDAD_ESPECIES_MENORES,
    fecha: fechaLocalIso(),
    director: "",
    presidente: "",
    firmaDirector: "",
    firmaPresidente: "",
    coordinador: "",
  };
}

export function animalesDelInventario(
  animales: AnimalRespuesta[],
  tipo: TipoInventarioPecuaria,
): AnimalRespuesta[] {
  return animales.filter((animal) => {
    if (!esAnimalActivo(animal.estado)) return false;
    return tipo === "ganado-bovino"
      ? esGanadoBovino(animal.especie)
      : esEspecieMenor(animal.especie);
  });
}

export function observacionInventario(animal: AnimalRespuesta): string {
  return animal.observaciones?.trim() ?? "";
}

export function cantidadPorCategoria(
  animal: AnimalRespuesta,
  categoria: CategoriaBovina,
): number {
  return animal.categoriaBovina === categoria ? 1 : 0;
}

export const FILAS_MINIMAS_INVENTARIO = 10;
