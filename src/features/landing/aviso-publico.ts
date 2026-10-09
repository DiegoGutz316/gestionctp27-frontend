import {
  CATEGORIAS_AVISO,
  ETIQUETA_CATEGORIA_AVISO,
  type AvisoPublico,
  type CategoriaAviso,
} from "@/features/comunicacion/validacion/aviso.validacion";

const CATALOGO = new Set<string>(CATEGORIAS_AVISO);

/** Usa solo la categoría guardada. */
export function categoriaDeAviso(aviso: AvisoPublico): CategoriaAviso | null {
  if (aviso.categoria && CATALOGO.has(aviso.categoria)) return aviso.categoria;
  return null;
}

export function etiquetaCategoria(aviso: AvisoPublico): string | null {
  const categoria = categoriaDeAviso(aviso);
  return categoria ? ETIQUETA_CATEGORIA_AVISO[categoria] : null;
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
