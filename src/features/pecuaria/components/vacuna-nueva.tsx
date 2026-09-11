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

import { VacunaForm } from "./vacuna-form";

export function VacunaNueva() {
  return (
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
              render={<Link href="/dashboard/pecuaria" />}
            >
              Gestión pecuaria
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Vacuna</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Registrar vacuna
        </h1>

        <p className="mt-0.5 text-sm text-muted-foreground">
          Registre la vacuna aplicada a un animal activo.
        </p>
      </div>

      <VacunaForm />
    </section>
  );
}
