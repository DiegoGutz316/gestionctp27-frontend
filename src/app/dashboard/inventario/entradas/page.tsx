import type { Metadata } from "next";
import { EntradasGestion } from "@/features/inventario/components/entradas-gestion";

export const metadata: Metadata = {
  title: "Entradas de inventario | GestiónCTP27",
};

/**
 * Backlog 4.5. La consulta solo exige LECTURA (la hereda del layout de
 * inventario); el botón para registrar sí pide COMPLETO.
 */
export default function EntradasPage() {
  return <EntradasGestion />;
}
