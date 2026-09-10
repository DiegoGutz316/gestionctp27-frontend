import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { VacunaNueva } from "@/features/pecuaria/components/vacuna-nueva";

export const metadata: Metadata = {
  title: "Registrar vacuna | GestiónCTP27",
};

export default function NuevaVacunaPage() {
  return (
    <RequerirPermiso
      modulo="PECUARIA"
      nivel="COMPLETO"
    >
      <VacunaNueva />
    </RequerirPermiso>
  );
}
