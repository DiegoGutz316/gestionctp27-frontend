import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { AnimalesGestion } from "@/features/pecuaria/components/animales-gestion";

export const metadata: Metadata = {
  title: "Pecuaria | GestiónCTP27",
};

export default function PecuariaPage() {
  return (
    <RequerirPermiso
      modulo="PECUARIA"
      nivel="LECTURA"
    >
      <AnimalesGestion />
    </RequerirPermiso>
  );
}