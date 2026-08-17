import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { ProductoEditar } from "@/features/inventario/producto/components/producto-editar";

export const metadata: Metadata = {
  title: "Editar producto | GestiónCTP27",
};

/**
 * Backlog 1.6: editar es escritura, exige COMPLETO sobre INVENTARIO.
 *
 * Vive bajo /dashboard para conservar el shell con el menú lateral, igual que
 * el resto del módulo y que la edición de usuarios. El enlace de volver lo
 * aporta el propio listado, así que aquí no se repite.
 */
export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productoId = Number(id);

  if (!Number.isInteger(productoId) || productoId <= 0) {
    notFound();
  }

  return (
    <RequerirPermiso modulo="INVENTARIO" nivel="COMPLETO">
      <main className="mx-auto w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Editar producto
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Actualice la información del producto.
          </p>
        </header>
        <ProductoEditar id={productoId} />
      </main>
    </RequerirPermiso>
  );
}
