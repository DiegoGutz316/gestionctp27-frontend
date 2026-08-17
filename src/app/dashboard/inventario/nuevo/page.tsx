import type { Metadata } from "next";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { ProductoForm } from "@/features/inventario/producto/components/producto-form";

export const metadata: Metadata = {
  title: "Registrar producto | GestiónCTP27",
};

// Backlog 1.6: registrar es escritura, exige COMPLETO sobre INVENTARIO.
export default function NuevoProductoPage() {
  return (
    <RequerirPermiso modulo="INVENTARIO" nivel="COMPLETO">
      <main className="mx-auto w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Registrar producto
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Agregue un producto al catálogo de inventario del colegio.
          </p>
        </header>
        <ProductoForm />
      </main>
    </RequerirPermiso>
  );
}
