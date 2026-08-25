import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PeriodoDetalle } from "@/features/libro-caja/periodo/components/periodo-detalle";

export const metadata: Metadata = {
  title: "Detalle de periodo | Libro de caja | GestiónCTP27",
};

export default async function PeriodoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const periodoId = Number(id);

  if (!Number.isInteger(periodoId) || periodoId <= 0) {
    notFound();
  }

  return <PeriodoDetalle id={periodoId} />;
}
