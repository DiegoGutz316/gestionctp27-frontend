/**
 * Normalización de montos en colones para el Libro de Caja.
 *
 * Regla adoptada (entrada humana → número):
 * 1. Se permiten espacios y el símbolo ₡ (se ignoran).
 * 2. Si hay punto y coma, el **último** separador es el decimal;
 *    el otro actúa como miles.
 * 3. Si solo hay coma o solo hay punto:
 *    - exactamente 3 dígitos después → separador de miles
 *      (ej. `85,000` o `85.000` → 85000);
 *    - en otro caso → separador decimal
 *      (ej. `85,5` → 85.5; `12.50` → 12.5).
 * 4. Varios grupos de miles (`1.234.567` / `1,234,567`) se aceptan.
 *
 * Así `85,000` no se interpreta como 85 ni como 85000000.
 */

export function normalizarMontoColones(valor: string): number | null {
  const limpio = valor
    .trim()
    .replace(/[₡\s]/g, "")
    .replace(/^\+/, "");

  if (limpio === "") return 0;
  if (!/^-?\d{1,3}([.,]\d{3})*([.,]\d{1,2})?$|^-?\d+([.,]\d{1,2})?$/.test(limpio)) {
    // Permite formas simples y con miles; el refine de zod cubre finitos.
    if (!/^[\d.,]+$/.test(limpio)) return null;
  }

  const ultimoPunto = limpio.lastIndexOf(".");
  const ultimaComa = limpio.lastIndexOf(",");

  let normalizado = limpio;
  if (ultimoPunto >= 0 && ultimaComa >= 0) {
    if (ultimaComa > ultimoPunto) {
      // 1.234,56
      normalizado = limpio.replace(/\./g, "").replace(",", ".");
    } else {
      // 1,234.56
      normalizado = limpio.replace(/,/g, "");
    }
  } else if (ultimaComa >= 0) {
    const decimales = limpio.length - ultimaComa - 1;
    normalizado =
      decimales === 3
        ? limpio.replace(/,/g, "")
        : limpio.replace(",", ".");
  } else if (ultimoPunto >= 0) {
    const decimales = limpio.length - ultimoPunto - 1;
    const gruposMiles = /^\d{1,3}(\.\d{3})+$/.test(limpio);
    normalizado =
      gruposMiles || decimales === 3
        ? limpio.replace(/\./g, "")
        : limpio;
  }

  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : null;
}
