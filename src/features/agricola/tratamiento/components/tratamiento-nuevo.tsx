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

import { TratamientoForm } from "./tratamiento-form";

export function TratamientoNuevo() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={
                <Link href="/dashboard" />
              }
              className="flex items-center gap-1.5"
            >
              <Home className="size-3.5" />
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink
              render={
                <Link href="/dashboard/agricola/tratamientos" />
              }
            >
              Tratamientos
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              Registrar
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Registrar tratamiento
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Registre fertilizantes o
          tratamientos aplicados a una
          siembra.
        </p>
      </div>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>
            Datos del tratamiento
          </CardTitle>

          <CardDescription>
            Seleccione la siembra e
            indique el producto, fecha y
            cantidad aplicada.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TratamientoForm />
        </CardContent>
      </Card>
    </section>
  );
}