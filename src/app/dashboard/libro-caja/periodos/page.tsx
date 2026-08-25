import type { Metadata } from "next";
import { PeriodosGestion } from "@/features/libro-caja/periodo/components/periodos-gestion";

export const metadata: Metadata = {
  title: "Periodos | Libro de caja | GestiónCTP27",
};

export default function PeriodosPage() {
  return <PeriodosGestion />;
}
