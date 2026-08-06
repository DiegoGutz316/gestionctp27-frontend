/**
 * Cliente HTTP (Axios) para consumir la API (gestionctp27-backend).
 * La URL del backend se lee de NEXT_PUBLIC_API_URL.
 */

import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const ACCESS_TOKEN_KEY = "ctp27_access_token";
const LOGIN_PATH = "/login";
const DEFAULT_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Token JWT en localStorage (solo cliente). */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // Activar si el backend usa cookies de sesión (httpOnly) en lugar de Bearer.
  // withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // FormData: dejar que el navegador ponga el boundary del multipart.
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      config.headers.delete("Content-Type");
    }

    const token = getAccessToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearAccessToken();
      const onLoginPage = window.location.pathname.startsWith(LOGIN_PATH);
      if (!onLoginPage) {
        const returnTo = `${window.location.pathname}${window.location.search}`;
        const search = returnTo && returnTo !== "/"
          ? `?returnTo=${encodeURIComponent(returnTo)}`
          : "";
        window.location.assign(`${LOGIN_PATH}${search}`);
      }
    }

    return Promise.reject(error);
  },
);

function toApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;

    let message: string;
    if (typeof data === "string" && data.length > 0) {
      message = data;
    } else if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    ) {
      message = (data as { message: string }).message;
    } else if (error.code === "ECONNABORTED") {
      message = "La solicitud superó el tiempo de espera.";
    } else if (!error.response) {
      message = "No se pudo conectar con el servidor.";
    } else {
      message = error.message || `Error ${status}`;
    }

    throw new ApiError(status, message, data);
  }

  throw error;
}

async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await axiosInstance.request<T>(config);
    return response.data;
  } catch (error) {
    toApiError(error);
  }
}

export const api = {
  get: <T>(path: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "GET", url: path }),
  post: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "POST", url: path, data: body }),
  put: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "PUT", url: path, data: body }),
  patch: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "PATCH", url: path, data: body }),
  delete: <T>(path: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "DELETE", url: path }),
};
