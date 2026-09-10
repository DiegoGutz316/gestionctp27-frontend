import type { Metadata } from "next";

import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { InventarioAnimales } from "@/features/pecuaria/inventario/components/inventario-animales";

export const metadata: Metadata = {
  title: "Inventario Especies Menores | GestiónCTP27",
};

export default function InventarioEspeciesMenoresPage() {
  return (
    <RequerirPermiso modulo="PECUARIA" nivel="LECTURA">
      <InventarioAnimales tipo="especies-menores" />
    </RequerirPermiso>
  );
}
