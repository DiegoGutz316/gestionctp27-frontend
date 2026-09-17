import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { TratamientosGestion } from "@/features/agricola/tratamiento/components/tratamientos-gestion";

export const metadata: Metadata = {
  title: "Tratamientos | GestiónCTP27",
};

export default function TratamientosPage() {
  return (
    <RequerirPermiso
      modulo="AGRICOLA"
      nivel="LECTURA"
    >
      <TratamientosGestion />
    </RequerirPermiso>
  );
}