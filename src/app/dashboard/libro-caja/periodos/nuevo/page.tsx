import type { Metadata } from "next";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { PeriodoForm } from "@/features/libro-caja/periodo/components/periodo-form";

export const metadata: Metadata = {
  title: "Abrir periodo | Libro de caja | GestiónCTP27",
};

export default function NuevoPeriodoPage() {
  return (
    <RequerirPermiso modulo="LIBRO_CAJA" nivel="COMPLETO">
      <main className="mx-auto w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-color-company">
            Abrir periodo
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Defina las fechas y escriba el fondo de cada departamento (saldo
            que queda de periodos anteriores).
          </p>
        </header>
        <PeriodoForm />
      </main>
    </RequerirPermiso>
  );
}
