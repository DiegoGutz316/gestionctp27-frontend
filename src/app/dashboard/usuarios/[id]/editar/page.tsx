import type { Metadata } from "next";
import { UsuarioEditar } from "@/features/usuarios/components/usuario-editar";

export const metadata: Metadata = {
  title: "Editar usuario | GestiónCTP27",
};

export default async function EditarUsuarioPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Editar usuario</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Actualice los datos, el rol o el estado del usuario.
        </p>
      </header>
      <UsuarioEditar id={id} />
    </main>
  );
}
