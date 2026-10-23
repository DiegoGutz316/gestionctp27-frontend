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

const ZONA_COSTA_RICA = "America/Costa_Rica";

/** Día de calendario en Costa Rica. Una fecha AAAA-MM-DD no se desplaza. */
export function diaCalendario(valor: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;

  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return valor.slice(0, 10);

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_COSTA_RICA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(fecha);
}

export function formatearFechaAviso(valor: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [anio, mes, dia] = valor.split("-").map(Number);
    if (!anio || !mes || !dia) return valor;

    return new Date(anio, mes - 1, dia).toLocaleDateString("es-CR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return valor;

  return fecha.toLocaleDateString("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONA_COSTA_RICA,
  });
}

export function fechasDelAviso(aviso: AvisoPublico): {
  actividad: string;
  publicacion: string | null;
} {
  const actividad = aviso.fechaActividad?.trim() || aviso.fecha;
  const creado = aviso.creadoEn?.trim() || null;

  if (!creado || diaCalendario(creado) === diaCalendario(actividad)) {
    return { actividad, publicacion: null };
  }

  return { actividad, publicacion: creado };
}
