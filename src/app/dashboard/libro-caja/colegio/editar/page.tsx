import type { Metadata } from "next";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { ColegioEditar } from "@/features/libro-caja/colegio/components/colegio-editar";

export const metadata: Metadata = {
  title: "Editar información del colegio | Libro de caja | GestiónCTP27",
};

export default function EditarColegioPage() {
  return (
    <RequerirPermiso modulo="LIBRO_CAJA" nivel="COMPLETO">
      <main className="mx-auto w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-color-company">
            Editar información del colegio
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Actualice el nombre, la cuenta bancaria y la entidad de depósito.
          </p>
        </header>
        <ColegioEditar />
      </main>
    </RequerirPermiso>
  );
}
