import type { Metadata } from "next";
import { UsuariosGestion } from "@/features/usuarios/components/usuarios-gestion";

export const metadata: Metadata = {
  title: "Usuarios | GestiónCTP27",
};

export default function UsuariosPage() {
  return <UsuariosGestion />;
}
