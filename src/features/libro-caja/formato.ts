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

const MESES_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

/** Fecha larga en español, p. ej. "30 de junio de 2026". */
export function formatearFechaLarga(valor: string): string {
  const iso = fechaPeriodoIso(valor);
  const [anio, mes, dia] = iso.split("-").map(Number);
  if (!anio || !mes || !dia) return iso;
  const nombreMes = MESES_ES[mes - 1];
  if (!nombreMes) return iso;
  return `${dia} de ${nombreMes} de ${anio}`;
}

/** Fecha de un instante (timestamptz) en calendario local. */
export function formatearFechaInstante(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CR");
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

/** Fecha de calendario en la zona local, sin convertir a UTC. */
export function fechaHoyLocal(): string {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}
