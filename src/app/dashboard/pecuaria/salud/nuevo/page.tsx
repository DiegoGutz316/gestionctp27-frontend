import type { Metadata } from "next";
import { Suspense } from "react";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { SaludNueva } from "@/features/pecuaria/salud/components/salud-nueva";

export const metadata: Metadata = {
  title: "Registrar salud | GestiónCTP27",
};

export default function NuevaSaludPage() {
  return (
    <RequerirPermiso modulo="PECUARIA" nivel="COMPLETO">
      <Suspense>
        <SaludNueva />
      </Suspense>
    </RequerirPermiso>
  );
}
