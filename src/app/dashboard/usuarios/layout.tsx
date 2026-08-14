import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";

/**
 * Backlog 1.6: toda la sección de usuarios exige permiso sobre USUARIOS, que en
 * la matriz sembrada solo tiene el rol ADMINISTRADOR. Al ponerlo en el layout
 * queda cubierto el listado y las páginas de crear y editar.
 */
export default function UsuariosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RequerirPermiso modulo="USUARIOS">{children}</RequerirPermiso>;
}
