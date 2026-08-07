"use client";

import Link from "next/link";
import { useAuth } from "../context/auth-context";

/** Protege rutas privadas: sin sesión válida muestra acceso a login. */
export function RequerirAuth({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Verificando sesión…
      </div>
    );
  }

  if (!usuario) {
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
