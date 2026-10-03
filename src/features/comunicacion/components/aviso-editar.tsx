"use client";

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
import { Skeleton } from "@/components/ui/skeleton";

import { useAviso } from "../hooks/aviso-hooks";
import { AvisoForm } from "./aviso-form";

export function AvisoEditar({ id }: { id: string }) {
  const avisoId = Number(id);
  const aviso = useAviso(avisoId);

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
            <BreadcrumbPage>Editar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar aviso institucional
        </h1>

        <p className="mt-0.5 text-sm text-muted-foreground">
          {aviso.isLoading
            ? "Cargando aviso…"
            : "Actualice el título, la descripción, la fecha o el estado."}
        </p>
      </div>

      {aviso.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-40" />
        </div>
      ) : null}

      {aviso.isError || (!aviso.isLoading && !aviso.data) ? (
        <p className="text-sm text-destructive">
          No se pudo cargar el aviso. Verifique el identificador o la conexión
          con el servidor.
        </p>
      ) : null}

      {aviso.data ? (
        <Card>
          <CardHeader>
            <CardTitle>Datos del aviso</CardTitle>
            <CardDescription>
              Si lo deja inactivo, dejará de mostrarse. El registro se
              conserva.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AvisoForm aviso={aviso.data} />
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
