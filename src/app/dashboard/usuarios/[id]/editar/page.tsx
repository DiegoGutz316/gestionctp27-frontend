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
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <UsuarioEditar id={id} />
    </main>
  );
}
