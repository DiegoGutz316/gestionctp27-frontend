/**
 * Cliente HTTP base para consumir la API (gestionctp27-backend).
 * La URL del backend se lee de la variable de entorno NEXT_PUBLIC_API_URL.
 * credentials: "include" envía/recibe la cookie httpOnly de sesión.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiRequestOptions = Omit<RequestInit, "body" | "method">;

export type ApiQueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

function buildUrl(path: string, params?: ApiQueryParams): string {
  if (!params) return path;

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new ApiError(
      response.status,
      body || `Error ${response.status} al llamar a ${path}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

/** Los errores de cliente no se resuelven repitiendo la misma consulta. */
export function reintentarConsulta(fallos: number, error: unknown): boolean {
  if (error instanceof ApiError) {
    const recuperable =
      error.status === 408 || error.status === 429 || error.status >= 500;
    return recuperable && fallos < 2;
  }

  return error instanceof TypeError && fallos < 2;
}

/** Extrae mensajes de NestJS y conserva una explicación útil por código HTTP. */
export function getMensajeDeError(
  error: unknown,
  mensajesPersonalizados: Partial<Record<number, string>> = {},
): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error && !(error instanceof TypeError)
      ? error.message
      : "Error de conexión con el servidor.";
  }

  try {
    const body = JSON.parse(error.message) as {
      message?: string | string[];
      errors?: Array<{ message?: string }>;
    };
    const mensaje = Array.isArray(body.errors)
      ? body.errors.find((item) => item.message)?.message
      : Array.isArray(body.message)
        ? body.message[0]
        : body.message;

    if (mensaje && mensaje !== "Validation failed") return mensaje;
  } catch {
    if (error.message && !error.message.startsWith("Error ")) {
      return error.message;
    }
  }

  const mensajes: Partial<Record<number, string>> = {
    400: "Los datos enviados no son válidos.",
    401: "La sesión expiró. Inicie sesión nuevamente.",
    403: "No tiene permisos para completar esta operación.",
    404: "El recurso solicitado no existe.",
    409: "La operación entra en conflicto con los datos existentes.",
  };

  return (
    mensajesPersonalizados[error.status] ??
    mensajes[error.status] ??
    "No se pudo completar la operación. Intente de nuevo."
  );
}

/**
 * Descarga un archivo del backend (PDF, Excel) devolviendo la `Response`.
 *
 * `apiFetch` no sirve para esto porque asume JSON: lee el cuerpo como texto y
 * lo parsea. Aquí hace falta el binario, y además la cabecera
 * `Content-Disposition` con el nombre del archivo.
 *
 * Lo que sí comparte con el resto del cliente es lo que importa: la URL base,
 * la cookie de sesión y el mismo `ApiError` con su código de estado, para que
 * `getMensajeDeError` traduzca el fallo igual que en cualquier otra llamada.
 */
export async function apiDescargar(
  path: string,
  params?: ApiQueryParams,
  options: ApiRequestOptions = {},
): Promise<Response> {
  const response = await fetch(`${API_URL}${buildUrl(path, params)}`, {
    ...options,
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");

    throw new ApiError(
      response.status,
      body || `Error ${response.status} al llamar a ${path}`,
    );
  }

  return response;
}

export const api = {
  get: <T>(
    path: string,
    params?: ApiQueryParams,
    options?: ApiRequestOptions,
  ) => apiFetch<T>(buildUrl(path, params), options),
  descargar: (
    path: string,
    params?: ApiQueryParams,
    options?: ApiRequestOptions,
  ) => apiDescargar(path, params, options),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiFetch<T>(path, {
      ...options,
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  put: <T>(path: string, body: unknown, options?: ApiRequestOptions) =>
    apiFetch<T>(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiFetch<T>(path, {
      ...options,
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  delete: <T>(path: string, options?: ApiRequestOptions) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};
