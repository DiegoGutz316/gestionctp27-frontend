import Link from "next/link";
import { Home } from "lucide-react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { SiembraForm } from "./siembra-form";

export function SiembraNueva() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />} className="flex items-center gap-1.5">
              <Home className="size-3.5" />Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink render={<Link href="/dashboard/agricola/siembras" />}>Siembras</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Registrar</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Registrar siembra</h1>
        <p className="mt-1 text-sm text-muted-foreground">Asocie el nuevo cultivo con una cama registrada.</p>
      </div>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>Datos de la siembra</CardTitle>
          <CardDescription>Todos los campos son obligatorios.</CardDescription>
        </CardHeader>
        <CardContent><SiembraForm /></CardContent>
      </Card>
    </section>
  );
}
