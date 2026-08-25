import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";

export default function LibroCajaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RequerirPermiso modulo="LIBRO_CAJA">{children}</RequerirPermiso>;
}
