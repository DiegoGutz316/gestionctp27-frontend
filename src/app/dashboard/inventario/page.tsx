import type { Metadata } from "next";
import { InventarioGestion } from "@/features/inventario/components/inventario-gestion";

export const metadata: Metadata = {
  title: "Inventario | GestiónCTP27",
};

export default function InventarioPage() {
  return <InventarioGestion />;
}
