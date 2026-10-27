import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { EspecialidadForm } from "@/features/landing/especialidades/components/especialidad-form";

export const metadata: Metadata = {
  title: "Nueva especialidad | GestiónCTP27",
};

export default function NuevaEspecialidadPage() {
  return (
    <RequerirPermiso modulo="REPORTES" nivel="COMPLETO">
      <section className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                render={<Link href="/dashboard" />}
                className="flex items-center gap-1.5"
              >
                <Home className="size-3.5" />
                Inicio
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                render={<Link href="/dashboard/landing/especialidades" />}
              >
                Especialidades
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Nueva</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Nueva especialidad
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Se mostrará en la sección de especialidades de la landing.
          </p>
        </div>

        <EspecialidadForm />
      </section>
    </RequerirPermiso>
  );
}
