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
      <main className="mx-auto w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-color-company">
            Editar departamento
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Actualice el nombre de la unidad y el tipo de actividad.
          </p>
        </header>
        <DepartamentoEditar id={departamentoId} />
      </main>
    </RequerirPermiso>
  );
}
