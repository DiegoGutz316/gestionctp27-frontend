"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Home, PlusIcon } from "lucide-react";

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
import { INVERNADEROS } from "@/features/agricola/validacion/cama-cultivo.validacion";
import { useSiembras } from "@/features/agricola/siembra/hooks/siembra-hooks";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import { useTratamientos } from "../hooks/tratamiento-hooks";
import {
  ETIQUETA_TIPO_TRATAMIENTO,
  nombreDeCama,
  TIPOS_TRATAMIENTO,
  type TipoTratamiento,
} from "../models/tratamiento.model";
import { TratamientosTabla } from "./tratamientos-tabla";

const TODAS_LAS_CAMAS = "TODAS";
const TODOS_LOS_TIPOS = "TODOS";

export function TratamientosGestion() {
  const [ubicacion, setUbicacion] = useState("");
  const [camaId, setCamaId] = useState("");
  const [tipo, setTipo] = useState("");

  const siembras = useSiembras();
  const activas = useMemo(
    () => (siembras.data ?? []).filter((siembra) => !siembra.finalizadaEn),
    [siembras.data],
  );

  const camasDeLaUbicacion = ubicacion
    ? activas.filter(
        (siembra) =>
          siembra.cama.ubicacion.toLowerCase() === ubicacion.toLowerCase(),
      )
    : activas;

  const consulta = useTratamientos({
    ubicacion: ubicacion || undefined,
    camaId: camaId ? Number(camaId) : undefined,
    tipo: (tipo || undefined) as TipoTratamiento | undefined,
  });

  const tratamientos = consulta.data ?? [];
  const hayFiltros = Boolean(ubicacion || camaId || tipo);

  const ubicacionesItems = INVERNADEROS.map((nombre) => ({
    value: nombre,
    label: nombre,
  }));

  /**
   * Varias siembras activas pueden compartir cama, así que la lista de
   * siembras trae camas repetidas: el desplegable mostraba la misma cama dos
   * veces y React avisaba de claves duplicadas. Se agrupan por id conservando
   * el orden en que aparecen.
   */
  const camasUnicas = [
    ...new Map(
      camasDeLaUbicacion.map((siembra) => [siembra.cama.id, siembra.cama]),
    ).values(),
  ];

  const camasItems = [
    { value: TODAS_LAS_CAMAS, label: "Todas las camas" },
    ...camasUnicas.map((cama) => ({
      value: String(cama.id),
      label: `${nombreDeCama(cama.codigo)} — ${cama.ubicacion}`,
    })),
  ];

  const tiposItems = [
    { value: TODOS_LOS_TIPOS, label: "Todos los tipos" },
    ...TIPOS_TRATAMIENTO.map((valor) => ({
      value: valor,
      label: ETIQUETA_TIPO_TRATAMIENTO[valor],
    })),
  ];

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
            <BreadcrumbLink render={<Link href="/dashboard/agricola" />}>
              Gestión agrícola
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tratamientos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Fertilizantes y tratamientos
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Consulte los tratamientos aplicados a las siembras activas por cama.
          </p>
        </div>

        <MostrarSiPuede modulo="AGRICOLA" nivel="COMPLETO">
          <Button
            className="w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/dashboard/agricola/tratamientos/nuevo" />}
          >
            <PlusIcon data-icon="inline-start" />
            Registrar tratamiento
          </Button>
        </MostrarSiPuede>
      </div>

      <AgricolaVistasNav />

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="filtro-ubicacion">Ubicación</Label>
            <Select
              items={ubicacionesItems}
              value={ubicacion !== "" ? ubicacion : null}
              onValueChange={(valor) => {
                const siguiente = (valor as string | null) ?? "";
                setUbicacion(siguiente);

                if (siguiente && camaId) {
                  const sigue = activas.some(
                    (siembra) =>
                      String(siembra.cama.id) === camaId &&
                      siembra.cama.ubicacion.toLowerCase() ===
                        siguiente.toLowerCase(),
                  );

                  if (!sigue) setCamaId("");
                }
              }}
            >
              <SelectTrigger id="filtro-ubicacion" className="w-full">
                <SelectValue placeholder="Invernadero 1 o 2" />
              </SelectTrigger>
              <SelectContent>
                {ubicacionesItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filtro-cama">Cama de cultivo</Label>
            <Select
              items={camasItems}
              value={camaId !== "" ? camaId : TODAS_LAS_CAMAS}
              onValueChange={(valor) => {
                const elegida = (valor as string | null) ?? TODAS_LAS_CAMAS;
                setCamaId(elegida === TODAS_LAS_CAMAS ? "" : elegida);
              }}
              disabled={siembras.isLoading}
            >
              <SelectTrigger id="filtro-cama" className="w-full">
                <SelectValue
                  placeholder={
                    siembras.isLoading ? "Cargando camas…" : "Todas las camas"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {camasItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filtro-tipo">Tipo de tratamiento</Label>
            <Select
              items={tiposItems}
              value={tipo !== "" ? tipo : TODOS_LOS_TIPOS}
              onValueChange={(valor) => {
                const elegida = (valor as string | null) ?? TODOS_LOS_TIPOS;
                setTipo(elegida === TODOS_LOS_TIPOS ? "" : elegida);
              }}
            >
              <SelectTrigger id="filtro-tipo" className="w-full">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                {tiposItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <TratamientosTabla
        cargando={consulta.isLoading}
        error={consulta.isError}
        tratamientos={tratamientos}
        hayFiltros={hayFiltros}
      />
    </section>
  );
}
