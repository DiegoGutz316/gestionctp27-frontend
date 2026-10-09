import {
  CATEGORIAS_AVISO,
  ETIQUETA_CATEGORIA_AVISO,
  type AvisoPublico,
  type CategoriaAviso,
} from "@/features/comunicacion/validacion/aviso.validacion";

export type { CategoriaAviso };
export { CATEGORIAS_AVISO, ETIQUETA_CATEGORIA_AVISO as ETIQUETA_CATEGORIA };

export type FiltroAviso = "TODOS" | CategoriaAviso;

const CATALOGO = new Set<string>(CATEGORIAS_AVISO);

/** Usa solo la categoría guardada. Sin ella, el aviso no entra en un filtro. */
export function categoriaDeAviso(aviso: AvisoPublico): CategoriaAviso | null {
  if (aviso.categoria && CATALOGO.has(aviso.categoria)) return aviso.categoria;
  return null;
}

export function etiquetaCategoria(aviso: AvisoPublico): string | null {
  const categoria = categoriaDeAviso(aviso);
  return categoria ? ETIQUETA_CATEGORIA_AVISO[categoria] : null;
}

/**
 * Conserva el orden del endpoint público. Solo reordena si algún aviso trae
 * prioridad institucional numérica; en ese caso la prioridad va primero y
 * el resto mantiene la secuencia que ya envió el backend.
 */
export function prepararAvisosPublicos(avisos: AvisoPublico[]): AvisoPublico[] {
  const activos = avisos.filter(
    (aviso) => aviso.estado == null || aviso.estado === "ACTIVO",
  );

  const hayPrioridad = activos.some(
    (aviso) => typeof aviso.prioridad === "number" && aviso.prioridad > 0,
  );
  if (!hayPrioridad) return activos;

  return activos
    .map((aviso, indice) => ({ aviso, indice }))
    .sort((a, b) => {
      const prioridadA = a.aviso.prioridad ?? 0;
      const prioridadB = b.aviso.prioridad ?? 0;
      if (prioridadA !== prioridadB) return prioridadB - prioridadA;
      return a.indice - b.indice;
    })
    .map(({ aviso }) => aviso);
}

export function formatearFechaAviso(valor: string): string {
  const [anio, mes, dia] = valor.slice(0, 10).split("-").map(Number);
  if (!anio || !mes || !dia) return valor;

  return new Date(anio, mes - 1, dia).toLocaleDateString("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function fechasDelAviso(aviso: AvisoPublico): {
  publicacion: string;
  actividad: string | null;
} {
  const actividadExplicita = aviso.fechaActividad?.trim() || null;
  const publicacion = aviso.creadoEn?.trim() || aviso.fecha;
  const actividad = aviso.creadoEn
    ? actividadExplicita ?? aviso.fecha
    : actividadExplicita;

  if (actividad && actividad.slice(0, 10) === publicacion.slice(0, 10)) {
    return { publicacion, actividad: null };
  }

  return { publicacion, actividad };
}
