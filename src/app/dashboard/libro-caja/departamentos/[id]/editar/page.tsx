import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { DepartamentoEditar } from "@/features/libro-caja/departamento/components/departamento-editar";

export const metadata: Metadata = {
  title: "Editar departamento | Libro de caja | GestiónCTP27",
};

export default async function EditarDepartamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const departamentoId = Number(id);

  if (!Number.isInteger(departamentoId) || departamentoId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso modulo="LIBRO_CAJA" nivel="COMPLETO">
      <DepartamentoEditar id={departamentoId} />
    </RequerirPermiso>
  );
}
