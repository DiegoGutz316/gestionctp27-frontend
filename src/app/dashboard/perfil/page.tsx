import type { Metadata } from "next";

import { MiPerfil } from "@/features/auth/components/mi-perfil";

export const metadata: Metadata = {
  title: "Mi perfil | GestiónCTP27",
};

export default function PerfilPage() {
  return <MiPerfil />;
}
