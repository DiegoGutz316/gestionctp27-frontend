import { redirect } from "next/navigation";

/** Ruta antigua: el historial ahora muestra entradas y salidas juntas. */
export default function EntradasRedirectPage() {
  redirect("/dashboard/inventario/movimientos");
}
