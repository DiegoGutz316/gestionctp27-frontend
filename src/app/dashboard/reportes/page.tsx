import type { Metadata } from "next";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { ReportesInicio } from "@/features/reportes/components/reportes-inicio";

export const metadata: Metadata = {
  title: "Reportes | GestiónCTP27",
};

export default function ReportesPage() {
  return (
    <RequerirPermiso modulo="REPORTES">
      <ReportesInicio />
    </RequerirPermiso>
  );
}
