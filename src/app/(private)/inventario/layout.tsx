import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";

/**
 * Backlog 1.6: consultar el inventario exige LECTURA sobre INVENTARIO. Las
 * pantallas de registrar y editar exigen COMPLETO por su cuenta, porque son
 * operaciones de escritura.
 */
export default function InventarioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RequerirPermiso modulo="INVENTARIO">{children}</RequerirPermiso>;
}
