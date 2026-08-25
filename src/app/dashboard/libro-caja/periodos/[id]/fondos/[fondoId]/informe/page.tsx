import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InformeEconomico } from "@/features/libro-caja/periodo/components/informe-economico";

export const metadata: Metadata = {
  title: "Informe Económico-UDP | GestiónCTP27",
};

export default async function InformeEconomicoPage({
  params,
}: {
  params: Promise<{ id: string; fondoId: string }>;
}) {
  const { id, fondoId } = await params;
  const periodoId = Number(id);
  const fondo = Number(fondoId);

  if (
    !Number.isInteger(periodoId) ||
    periodoId <= 0 ||
    !Number.isInteger(fondo) ||
    fondo <= 0
  ) {
    notFound();
  }

  return <InformeEconomico periodoId={periodoId} fondoId={fondo} />;
}
