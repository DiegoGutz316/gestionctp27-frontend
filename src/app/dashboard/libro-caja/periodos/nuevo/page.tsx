import type { Metadata } from "next";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { AbrirPeriodoVista } from "@/features/libro-caja/periodo/components/periodo-form";

export const metadata: Metadata = {
  title: "Abrir periodo | Libro de caja | GestiónCTP27",
};

export default function NuevoPeriodoPage() {
  return (
    <RequerirPermiso modulo="LIBRO_CAJA" nivel="COMPLETO">
      <AbrirPeriodoVista />
    </RequerirPermiso>
  );
}
