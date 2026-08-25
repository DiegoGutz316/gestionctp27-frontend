import type { Metadata } from "next";
import { DepartamentosGestion } from "@/features/libro-caja/departamento/components/departamentos-gestion";

export const metadata: Metadata = {
  title: "Departamentos | Libro de caja | GestiónCTP27",
};

export default function DepartamentosPage() {
  return <DepartamentosGestion />;
}
