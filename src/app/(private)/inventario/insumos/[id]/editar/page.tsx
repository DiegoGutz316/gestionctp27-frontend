import { redirect } from "next/navigation";

/** Ruta antigua: redirige a la edición bajo el dashboard, conservando el id. */
export default async function EditarInsumoRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/inventario/${id}/editar`);
}
