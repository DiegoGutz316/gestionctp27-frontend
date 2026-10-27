import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { EspecialidadesGestion } from "@/features/landing/especialidades/components/especialidades-gestion";

export const metadata: Metadata = {
  title: "Especialidades landing | GestiónCTP27",
};

export default function EspecialidadesLandingPage() {
  return (
    <RequerirPermiso modulo="REPORTES" nivel="COMPLETO">
      <EspecialidadesGestion />
    </RequerirPermiso>
  );
}
