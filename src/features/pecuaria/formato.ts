/**
 * Fecha de calendario (AAAA-MM-DD, como la entrega el backend) en formato
 * DD/MM/AAAA.
 *
 * Se trabaja sobre el texto y no con `new Date(...)`: una fecha sin hora se
 * interpreta como medianoche UTC, y en Costa Rica (UTC-6) se mostraría el día
 * anterior.
 */
export function formatearFecha(fecha: string): string {
  const partes = fecha.split("-");
  if (partes.length !== 3) return fecha;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
