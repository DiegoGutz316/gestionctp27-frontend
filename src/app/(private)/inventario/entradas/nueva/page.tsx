import { redirect } from "next/navigation";

/** Ruta antigua: redirige al registro bajo el dashboard. */
export default function NuevaEntradaRedirectPage() {
  redirect("/dashboard/inventario/entradas/nueva");
}
