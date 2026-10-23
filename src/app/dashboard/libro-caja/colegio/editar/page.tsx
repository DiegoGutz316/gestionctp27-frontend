import type { Metadata } from "next";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { ColegioEditar } from "@/features/libro-caja/colegio/components/colegio-editar";

export const metadata: Metadata = {
  title: "Editar información del colegio | Libro de caja | GestiónCTP27",
};

export default function EditarColegioPage() {
  return (
    <RequerirPermiso modulo="LIBRO_CAJA" nivel="COMPLETO">
      <ColegioEditar />
    </RequerirPermiso>
  );
}
