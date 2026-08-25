import type { Metadata } from "next";
import { LibroCajaInicio } from "@/features/libro-caja/libro-caja-inicio";

export const metadata: Metadata = {
  title: "Libro de caja | GestiónCTP27",
};

export default function LibroCajaPage() {
  return <LibroCajaInicio />;
}
