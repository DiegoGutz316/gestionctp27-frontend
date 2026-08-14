import { redirect } from "next/navigation";

/** Ruta antigua: redirige al registro bajo el dashboard. */
export default function NuevoInsumoRedirectPage() {
  redirect("/dashboard/inventario/nuevo");
}
