import { redirect } from "next/navigation";

/** Ruta antigua: redirige al historial bajo el dashboard. */
export default function EntradasRedirectPage() {
  redirect("/dashboard/inventario/entradas");
}
