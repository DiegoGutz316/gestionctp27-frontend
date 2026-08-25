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
      <main className="mx-auto w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-color-company">
            Editar periodo
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Actualice el nombre y las fechas de un periodo abierto.
          </p>
        </header>
        <PeriodoEditar id={periodoId} />
      </main>
    </RequerirPermiso>
  );
}
