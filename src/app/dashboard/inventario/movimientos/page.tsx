import type { Metadata } from "next";
import { MovimientosGestion } from "@/features/inventario/components/movimientos-gestion";

export const metadata: Metadata = {
  title: "Movimientos de inventario | GestiónCTP27",
};

/**
 * Backlogs 4.5 y 4.6. La consulta solo exige LECTURA (la hereda del layout de
 * inventario); los botones para registrar sí piden COMPLETO.
 */
export default function MovimientosPage() {
  return <MovimientosGestion />;
}
