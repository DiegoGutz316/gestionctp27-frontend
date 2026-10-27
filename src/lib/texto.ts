/**
 * Cuenta los caracteres igual que el backend y la base de datos.
 *
 * `"🌽".length` da 2 porque JavaScript mide unidades UTF-16, mientras que
 * PostgreSQL (`varchar(120)`) y class-validator cuentan un punto de código
 * como uno solo. Sin esto, el formulario corta nombres que el servidor sí
 * acepta y deja pasar textos que el servidor rechaza.
 */
export function contarCaracteres(texto: string): number {
  return [...texto].length;
}

/** Recorta a `maximo` caracteres sin partir un emoji por la mitad. */
export function recortarCaracteres(texto: string, maximo: number): string {
  const caracteres = [...texto];

  return caracteres.length <= maximo
    ? texto
    : caracteres.slice(0, maximo).join("");
}
