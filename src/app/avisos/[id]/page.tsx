import type { Metadata } from "next";

import { AvisoPublicoPagina } from "@/features/landing/components/aviso-publico-pagina";

export const metadata: Metadata = {
  title: "Aviso | GestiónCTP27",
};

export default async function PaginaAvisoPublico({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  return <AvisoPublicoPagina id={id} />;
}
