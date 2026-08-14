"use client";

import { useAuth } from "../context/auth-context";
import type { ModuloSistema, NivelPermiso } from "../models/permisos.model";

/**
 * Muestra su contenido solo si el rol alcanza el permiso indicado.
 *
 * A diferencia de `RequerirPermiso`, que protege una pantalla completa y avisa
 * con "acceso denegado", esto es para elementos sueltos —típicamente acciones
 * de escritura dentro de una pantalla de solo lectura—: si no hay permiso
 * simplemente no se dibujan, en vez de ofrecer un botón que terminaría en un
 * rechazo.
 *
 * Igual que el resto de controles de interfaz, es una ayuda de usabilidad: el
 * permiso real lo aplica el backend en `PermisosGuard`.
 */
export function MostrarSiPuede({
  modulo,
  nivel = "LECTURA",
  children,
}: {
  modulo: ModuloSistema;
  nivel?: NivelPermiso;
  children: React.ReactNode;
}) {
  const { puede } = useAuth();

  if (!puede(modulo, nivel)) return null;

  return <>{children}</>;
}
