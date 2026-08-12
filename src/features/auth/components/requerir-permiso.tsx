"use client";

import { useAuth } from "../context/auth-context";
import { AccesoDenegado } from "./acceso-denegado";
import type { ModuloSistema, NivelPermiso } from "../models/permisos.model";

/**
 * Backlog 1.6: envuelve el contenido de una página y exige un permiso sobre un
 * módulo. Si el rol no lo alcanza, muestra el aviso de acceso denegado en lugar
 * del contenido.
 *
 * Es una ayuda de interfaz, no el control de seguridad: el backend aplica la
 * misma matriz en PermisosGuard y responde 403 aunque alguien llegue por URL.
 */
export function RequerirPermiso({
  modulo,
  nivel = "LECTURA",
  children,
}: {
  modulo: ModuloSistema;
  nivel?: NivelPermiso;
  children: React.ReactNode;
}) {
  const { cargando, puede } = useAuth();

  if (cargando) {
    return (
      <p className="p-6 text-sm text-muted-foreground">Verificando permisos…</p>
    );
  }

  if (!puede(modulo, nivel)) {
    return <AccesoDenegado modulo={modulo} />;
  }

  return <>{children}</>;
}
