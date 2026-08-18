import type { Metadata } from "next";
import { ProductosGestion } from "@/features/inventario/producto/components/productos-gestion";

export const metadata: Metadata = {
  title: "Inventario | GestiónCTP27",
};

export default function InventarioPage() {
  return <ProductosGestion />;
}
