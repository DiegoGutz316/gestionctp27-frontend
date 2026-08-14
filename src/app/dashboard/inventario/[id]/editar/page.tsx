import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { InsumoEditar } from "@/features/inventario/components/insumo-editar";

export const metadata: Metadata = {
  title: "Editar insumo | GestiónCTP27",
};

/**
 * Backlog 1.6: editar es escritura, exige COMPLETO sobre INVENTARIO.
 *
 * Vive bajo /dashboard para conservar el shell con el menú lateral, igual que
 * el resto del módulo y que la edición de usuarios. El enlace de volver lo
 * aporta el propio listado, así que aquí no se repite.
 */
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
      <main className="mx-auto w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Editar insumo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Actualice la información administrativa del insumo.
          </p>
        </header>
        <InsumoEditar id={insumoId} />
      </main>
    </RequerirPermiso>
  );
}
