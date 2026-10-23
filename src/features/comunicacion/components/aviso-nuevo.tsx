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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AvisoForm } from "./aviso-form";

export function AvisoNuevo() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
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
              render={<Link href="/dashboard/comunicacion/avisos" />}
            >
              Avisos
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Publicar aviso</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Publicar aviso institucional
        </h1>

        <p className="mt-0.5 text-sm text-muted-foreground">
          Informe sobre actividades, fechas importantes o comunicados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del aviso</CardTitle>

          <CardDescription>
            El aviso queda a su nombre y con la fecha de publicación.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AvisoForm />
        </CardContent>
      </Card>
    </section>
  );
}
