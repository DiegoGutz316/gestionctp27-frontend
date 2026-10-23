import { redirect } from "next/navigation";

export default async function DetalleAvisoRedireccion({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  redirect(`/dashboard/comunicacion/avisos/detalle/${id}`);
}
