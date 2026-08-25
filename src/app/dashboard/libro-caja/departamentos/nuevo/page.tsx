import type { Metadata } from "next";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { DepartamentoNuevo } from "@/features/libro-caja/departamento/components/departamento-nuevo";

export const metadata: Metadata = {
  title: "Registrar departamento | Libro de caja | GestiónCTP27",
};

export default function NuevoDepartamentoPage() {
  return (
    <RequerirPermiso modulo="LIBRO_CAJA" nivel="COMPLETO">
      <DepartamentoNuevo />
    </RequerirPermiso>
  );
}
