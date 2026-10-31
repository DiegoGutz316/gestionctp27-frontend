"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/auth-context";

/**
 * Protege rutas privadas.
 *
 * Distingue los dos motivos por los que no hay usuario: sin la cookie válida
 * hay que volver a entrar, pero si el que no responde es el servidor la sesión
 * puede estar bien y lo que corresponde es reintentar, no mandar al login.
 */
export function RequerirAuth({ children }: { children: React.ReactNode }) {
  const { usuario, cargando, motivoSinUsuario, refrescar } = useAuth();
  const [reintentando, setReintentando] = useState(false);

  if (cargando) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Verificando sesión…
      </div>
    );
  }

  if (!usuario) {
    if (motivoSinUsuario === "sin-servidor") {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-4 text-center text-sm text-muted-foreground">
          <p>
            No se pudo conectar con el servidor. Su sesión sigue abierta:
            intente de nuevo en unos momentos.
          </p>
          <button
            type="button"
            disabled={reintentando}
            onClick={() => {
              setReintentando(true);
              void refrescar().finally(() => setReintentando(false));
            }}
            className="text-primary underline-offset-4 hover:underline disabled:opacity-60"
          >
            {reintentando ? "Reintentando…" : "Reintentar"}
          </button>
        </div>
      );
    }

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-4 text-center text-sm text-muted-foreground">
        <p>Su sesión no es válida o ha expirado.</p>
        <Link
          href="/login"
          className="text-primary underline-offset-4 hover:underline"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
