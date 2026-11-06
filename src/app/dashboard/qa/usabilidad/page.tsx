import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { EvaluacionUsabilidadPanel } from "@/features/qa-usabilidad/components/evaluacion-usabilidad-panel";

export const metadata: Metadata = {
  title: "Evaluación de usabilidad | GestiónCTP27",
};

/**
 * Visible solo con NEXT_PUBLIC_QA_USABILIDAD_ENABLED=true.
 * El backend también exige ADMINISTRADOR + QA_USABILIDAD_ENABLED.
 */
export default function EvaluacionUsabilidadPage() {
  if (process.env.NEXT_PUBLIC_QA_USABILIDAD_ENABLED !== "true") {
    redirect("/dashboard");
  }

  return <EvaluacionUsabilidadPanel />;
}
