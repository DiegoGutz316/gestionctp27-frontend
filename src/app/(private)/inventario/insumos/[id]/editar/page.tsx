import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { InsumoEditar } from "@/features/inventario/components/insumo-editar";

export const metadata: Metadata = {
  title: "Editar insumo | GestiónCTP27",
};

// Backlog 1.6: editar es escritura, exige COMPLETO sobre INVENTARIO.
export default async function EditarInsumoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const insumoId = Number(id);

  if (!Number.isInteger(insumoId) || insumoId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso modulo="INVENTARIO" nivel="COMPLETO">
      <main className="mx-auto w-full max-w-lg p-6">
        <Link
          href="/inventario/insumos"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Volver al listado de insumos
        </Link>
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Editar insumo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Actualice la información administrativa del insumo.
          </p>
        </header>
        <InsumoEditar id={insumoId} />
      </main>
    </RequerirPermiso>
  );
}
