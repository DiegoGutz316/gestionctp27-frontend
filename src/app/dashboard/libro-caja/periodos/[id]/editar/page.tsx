import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { PeriodoEditar } from "@/features/libro-caja/periodo/components/periodo-editar";

export const metadata: Metadata = {
  title: "Editar periodo | Libro de caja | GestiónCTP27",
};

export default async function EditarPeriodoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const periodoId = Number(id);

  if (!Number.isInteger(periodoId) || periodoId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso modulo="LIBRO_CAJA" nivel="COMPLETO">
      <PeriodoEditar id={periodoId} />
    </RequerirPermiso>
  );
}
