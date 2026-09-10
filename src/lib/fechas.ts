/**
 * Fecha de hoy (AAAA-MM-DD) en la zona horaria de Costa Rica.
 *
 * Se fija la zona en vez de usar la del navegador para que coincida con la
 * validación del backend: si el equipo del usuario tuviera otra zona, una
 * fecha válida podría rechazarse como futura, o al revés.
 */
export function fechaHoyCR(): string {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Costa_Rica",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((parte) => parte.type === tipo)?.value ?? "";

  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}
