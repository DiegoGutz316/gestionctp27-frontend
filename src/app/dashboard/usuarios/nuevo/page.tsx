import type { Metadata } from "next";
import { UsuarioForm } from "@/features/usuarios/components/usuario-form";

export const metadata: Metadata = {
  title: "Registrar usuario | GestiónCTP27",
};

export default function NuevoUsuarioPage() {
  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Registrar usuario
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Cree una cuenta con rol y estado de acceso al sistema.
        </p>
      </header>
      <UsuarioForm />
    </main>
  );
}
