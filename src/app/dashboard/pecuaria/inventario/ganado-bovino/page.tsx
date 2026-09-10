import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { InventarioAnimales } from "@/features/pecuaria/inventario/components/inventario-animales";

export const metadata: Metadata = {
  title: "Inventario Ganado Bovino | GestiónCTP27",
};

export default function InventarioGanadoBovinoPage() {
  return (
    <RequerirPermiso modulo="PECUARIA" nivel="LECTURA">
      <InventarioAnimales tipo="ganado-bovino" />
    </RequerirPermiso>
  );
}
