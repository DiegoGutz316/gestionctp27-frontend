"use client";

import Link from "next/link";
import {
  Home,
  PlusIcon,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { useAnimales } from "../hooks/hooks";
import { AnimalesTabla } from "./animales-tabla";

export function AnimalesGestion() {
  const animales = useAnimales();

  const lista = animales.data ?? [];

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
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
            <BreadcrumbPage>
              Gestión pecuaria
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gestión de animales
          </h1>

          <p className="mt-0.5 text-sm text-muted-foreground">
            {animales.isLoading
              ? "Cargando animales…"
              : `${lista.length} animal${
                  lista.length === 1 ? "" : "es"
                } registrado${
                  lista.length === 1 ? "" : "s"
                }`}
          </p>
        </div>

        <MostrarSiPuede
          modulo="PECUARIA"
          nivel="COMPLETO"
        >
          <Button
            className="w-full sm:w-auto"
            nativeButton={false}
            render={
              <Link href="/dashboard/pecuaria/nuevo" />
            }
          >
            <PlusIcon data-icon="inline-start" />
            Registrar animal
          </Button>
        </MostrarSiPuede>
      </div>

      <AnimalesTabla
        cargando={animales.isLoading}
        error={animales.isError}
        animales={lista}
      />
    </section>
  );
}