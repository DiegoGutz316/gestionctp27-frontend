import { api } from "@/lib/api";

export type FormatoExportacion = "pdf" | "excel";

export type TipoReporteExportable =
  | "produccion-pecuaria"
  | "produccion-agricola"
  | "inventario";

export type FiltrosExportacion = Record<
  string,
  string | number | undefined | null
>;

/**
 * Nombre con el que se guarda el archivo.
 *
 * Lo manda el backend en `Content-Disposition`, que es quien sabe el período
 * exportado. El nombre genérico es solo una red por si la cabecera no llega.
 */
function obtenerNombreArchivo(
  response: Response,
  reporte: TipoReporteExportable,
  formato: FormatoExportacion,
): string {
  const disposition = response.headers.get("Content-Disposition");

  const coincidencia = disposition?.match(/filename="?([^"]+)"?/i);

  if (coincidencia?.[1]) {
    return coincidencia[1];
  }

  return `reporte-${reporte}.${formato === "pdf" ? "pdf" : "xlsx"}`;
}

/** Dispara la descarga en el navegador con el archivo ya recibido. */
function guardarArchivo(archivo: Blob, nombre: string): void {
  const url = URL.createObjectURL(archivo);

  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = nombre;

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  URL.revokeObjectURL(url);
}

/**
 * Descarga un reporte en PDF o Excel.
 *
 * Pasa por el cliente central (`api.descargar`) y no por `fetch` directo: así
 * la URL base, la cookie de sesión y el manejo de errores son los mismos que
 * en el resto de la aplicación, y los cambios del cliente alcanzan también a
 * las exportaciones.
 */
export async function descargarReporte(
  reporte: TipoReporteExportable,
  formato: FormatoExportacion,
  filtros: FiltrosExportacion,
): Promise<void> {
  const response = await api.descargar(
    `/reportes/exportacion/${reporte}/${formato}`,
    filtros,
  );

  const archivo = await response.blob();

  guardarArchivo(archivo, obtenerNombreArchivo(response, reporte, formato));
}

export { getMensajeDeError } from "@/lib/api";
