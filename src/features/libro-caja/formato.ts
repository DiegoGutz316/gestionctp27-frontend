/** Fechas de periodo son `date` (AAAA-MM-DD), no timestamptz: no convertir zona. */
export function fechaPeriodoIso(valor: string): string {
  return valor.slice(0, 10);
}

export function formatearFechaPeriodo(valor: string): string {
  const iso = fechaPeriodoIso(valor);
  const [anio, mes, dia] = iso.split("-").map(Number);
  if (!anio || !mes || !dia) return iso;
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-CR");
}

export function formatearFechaHora(iso: string): string {
  return new Date(iso).toLocaleString("es-CR");
}

export function formatearColones(monto: number): string {
  return `₡${monto.toLocaleString("es-CR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
