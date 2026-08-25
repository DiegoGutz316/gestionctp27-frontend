import type { Metadata } from "next";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { ProductoNuevo } from "@/features/inventario/producto/components/producto-nuevo";

export const metadata: Metadata = {
  title: "Registrar producto | GestiónCTP27",
};

// Backlog 1.6: registrar es escritura, exige COMPLETO sobre INVENTARIO.
export default function NuevoProductoPage() {
  return (
    <RequerirPermiso modulo="INVENTARIO" nivel="COMPLETO">
      <ProductoNuevo />
    </RequerirPermiso>
  );
}
