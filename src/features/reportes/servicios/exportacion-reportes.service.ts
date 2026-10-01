const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

export type FormatoExportacion =
  | "pdf"
  | "excel";

export type TipoReporteExportable =
  | "produccion-pecuaria"
  | "produccion-agricola"
  | "inventario";

export type FiltrosExportacion = Record<
  string,
  string | number | undefined | null
>;

function construirParametros(
  filtros: FiltrosExportacion,
): URLSearchParams {
  const parametros =
    new URLSearchParams();

  for (const [clave, valor] of Object.entries(
    filtros,
  )) {
    if (
      valor === undefined ||
      valor === null ||
      valor === ""
    ) {
      continue;
    }

    parametros.set(
      clave,
      String(valor),
    );
  }

  return parametros;
}

function obtenerNombreArchivo(
  response: Response,
  reporte: TipoReporteExportable,
  formato: FormatoExportacion,
): string {
  const disposition =
    response.headers.get(
      "Content-Disposition",
    );

  const coincidencia =
    disposition?.match(
      /filename="?([^"]+)"?/i,
    );

  if (coincidencia?.[1]) {
    return coincidencia[1];
  }

  const extension =
    formato === "pdf"
      ? "pdf"
      : "xlsx";

  return `reporte-${reporte}.${extension}`;
}

export async function descargarReporte(
  reporte: TipoReporteExportable,
  formato: FormatoExportacion,
  filtros: FiltrosExportacion,
): Promise<void> {
  const parametros =
    construirParametros(filtros);

  const response = await fetch(
    `${API_URL}/reportes/exportacion/${reporte}/${formato}?${parametros.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const body =
      await response
        .text()
        .catch(() => "");

    let mensaje =
      "No se pudo exportar el reporte.";

    if (body) {
      try {
        const error = JSON.parse(
          body,
        ) as {
          message?:
            | string
            | string[];
        };

        if (
          typeof error.message ===
          "string"
        ) {
          mensaje =
            error.message;
        } else if (
          Array.isArray(
            error.message,
          )
        ) {
          mensaje =
            error.message[0] ??
            mensaje;
        }
      } catch {
        mensaje = body;
      }
    }

    throw new Error(mensaje);
  }

  const archivo =
    await response.blob();

  const nombre =
    obtenerNombreArchivo(
      response,
      reporte,
      formato,
    );

  const url =
    URL.createObjectURL(
      archivo,
    );

  const enlace =
    document.createElement(
      "a",
    );

  enlace.href = url;
  enlace.download = nombre;

  document.body.appendChild(
    enlace,
  );

  enlace.click();
  enlace.remove();

  URL.revokeObjectURL(url);
}