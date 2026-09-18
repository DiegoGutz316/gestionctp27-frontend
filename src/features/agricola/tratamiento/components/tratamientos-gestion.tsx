"use client";

import { useMemo, useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AgricolaVistasNav } from "@/features/agricola/components/agricola-vistas-nav";
import { useSiembras } from "@/features/agricola/siembra/hooks/siembra-hooks";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { useTratamientos } from "../hooks/tratamiento-hooks";
import { TratamientosTabla } from "./tratamientos-tabla";

export function TratamientosGestion() {
  const [cultivo, setCultivo] =
    useState("");

  const siembras = useSiembras();

  const cultivos = useMemo(() => {
    const valores = new Set(
      (siembras.data ?? []).map(
        (siembra) =>
          siembra.tipoCultivo.trim(),
      ),
    );

    return Array.from(valores)
      .filter(Boolean)
      .sort((a, b) =>
        a.localeCompare(b, "es"),
      );
  }, [siembras.data]);

  const consulta = useTratamientos({
    cultivo,
  });

  const tratamientos =
    consulta.data ?? [];

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
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
                <Link href="/dashboard/agricola" />
              }
            >
              Gestión agrícola
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              Tratamientos
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Fertilizantes y tratamientos
          </h1>

          <p className="mt-0.5 text-sm text-muted-foreground">
            {cultivo === ""
              ? "Seleccione un cultivo para consultar su historial."
              : consulta.isLoading
                ? "Cargando tratamientos…"
                : `${tratamientos.length} tratamiento${
                    tratamientos.length ===
                    1
                      ? ""
                      : "s"
                  } encontrado${
                    tratamientos.length ===
                    1
                      ? ""
                      : "s"
                  }`}
          </p>
        </div>

        <MostrarSiPuede
          modulo="AGRICOLA"
          nivel="COMPLETO"
        >
          <Button
            className="w-full sm:w-auto"
            nativeButton={false}
            render={
              <Link href="/dashboard/agricola/tratamientos/nuevo" />
            }
          >
            <PlusIcon data-icon="inline-start" />
            Registrar tratamiento
          </Button>
        </MostrarSiPuede>
      </div>

      <AgricolaVistasNav />

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="max-w-md space-y-2">
          <Label htmlFor="filtro-cultivo">
            Cultivo
          </Label>

          <Select
            items={cultivos.map(
              (item) => ({
                value: item,
                label: item,
              }),
            )}
            value={
              cultivo === ""
                ? null
                : cultivo
            }
            onValueChange={(valor) =>
              setCultivo(
                (valor as
                  | string
                  | null) ?? "",
              )
            }
          >
            <SelectTrigger
              id="filtro-cultivo"
              className="w-full"
              disabled={
                siembras.isLoading ||
                cultivos.length === 0
              }
            >
              <SelectValue
                placeholder={
                  siembras.isLoading
                    ? "Cargando cultivos…"
                    : "Seleccione un cultivo"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {cultivos.map(
                (item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          {siembras.isError ? (
            <p className="text-sm text-destructive">
              No se pudieron cargar los
              cultivos.
            </p>
          ) : null}

          {!siembras.isLoading &&
          !siembras.isError &&
          cultivos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No existen siembras
              registradas.
            </p>
          ) : null}
        </div>
      </div>

      <TratamientosTabla
        cargando={
          cultivo !== "" &&
          consulta.isLoading
        }
        error={consulta.isError}
        tratamientos={tratamientos}
        cultivoSeleccionado={
          cultivo !== ""
        }
      />
    </section>
  );
}