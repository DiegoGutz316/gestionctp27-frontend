import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { AnimalNuevo } from "@/features/pecuaria/components/animal-nuevo";

export const metadata: Metadata = {
  title: "Registrar animal | GestiónCTP27",
};

export default function NuevoAnimalPage() {
  return (
    <RequerirPermiso
      modulo="PECUARIA"
      nivel="COMPLETO"
    >
      <AnimalNuevo />
    </RequerirPermiso>
  );
}