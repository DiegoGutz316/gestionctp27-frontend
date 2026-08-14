import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Insumos | GestiónCTP27",
};

/** La lista vive en /dashboard/inventario (mismo shell que Usuarios). */
export default function InsumosPage() {
  redirect("/dashboard/inventario");
}
