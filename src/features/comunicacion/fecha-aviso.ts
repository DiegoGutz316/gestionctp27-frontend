const ZONA_COSTA_RICA = "America/Costa_Rica";

/**
 * Día en que se publicó el aviso, en Costa Rica.
 * Un instante ISO recortado a AAAA-MM-DD usa el día UTC y se adelanta
 * si la publicación fue después de las 6 de la tarde.
 */
export function formatearFechaPublicacion(valor: string): string {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return valor;

  const dia = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_COSTA_RICA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(fecha);

  const [anio, mes, numero] = dia.split("-").map(Number);
  if (!anio || !mes || !numero) return valor;

  return new Date(anio, mes - 1, numero).toLocaleDateString("es-CR");
}
