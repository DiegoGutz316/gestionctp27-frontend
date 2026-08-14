import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";

/**
 * Backlog 1.6: la sección de inventario exige permiso sobre INVENTARIO.
 * El listado basta con LECTURA; crear/editar endurecen a COMPLETO en su página.
 */
export default function InventarioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RequerirPermiso modulo="INVENTARIO">{children}</RequerirPermiso>;
}
