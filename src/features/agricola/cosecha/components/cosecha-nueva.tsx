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

import { CosechaForm } from "./cosecha-form";

export function CosechaNueva() {
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
              render={<Link href="/dashboard/agricola/cosechas" />}
            >
              Cosechas
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Registrar cosecha</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Registrar cosecha
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Registre la producción obtenida de una siembra.
        </p>
      </div>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>Datos de la cosecha</CardTitle>

          <CardDescription>
            Seleccione la siembra e indique la fecha y la cantidad obtenida.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <CosechaForm />
        </CardContent>
      </Card>
    </section>
  );
}
