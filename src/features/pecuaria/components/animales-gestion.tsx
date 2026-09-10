"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDownIcon,
  Home,
  PlusIcon,
  SearchIcon,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";

import {
  ETIQUETA_ORDEN_ANIMALES,
  ORDENES_ANIMALES,
  type OrdenAnimales,
} from "../validacion/animal.validacion";
import { useAnimales } from "../hooks/hooks";
import { AnimalesTabla } from "./animales-tabla";

const itemsOrden = ORDENES_ANIMALES.map((valor) => ({
  value: valor,
  label: ETIQUETA_ORDEN_ANIMALES[valor],
}));

export function AnimalesGestion() {
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<OrdenAnimales>("NOMBRE");
  const [incluirInactivos, setIncluirInactivos] = useState(false);

  // Se espera a que el usuario deje de escribir para no consultar en cada tecla.
  const busquedaDebounced = useDebouncedValue(busqueda.trim(), 300);

  const animales = useAnimales({
    q: busquedaDebounced || undefined,
    orden,
    incluirInactivos: incluirInactivos || undefined,
  });

  const lista = animales.data ?? [];
  const hayFiltros = busquedaDebounced !== "";

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

      {/* Backlog 2.2: "El sistema permite buscar animales por código, nombre o
          estado" y "Ordenar animales por nombre, código o estado". */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(event) =>
              setBusqueda(event.target.value)
            }
            placeholder="Buscar por código, nombre o estado…"
            className="pl-9"
            aria-label="Buscar animales"
            maxLength={120}
          />
        </div>

        <Select
          items={itemsOrden}
          value={orden}
          onValueChange={(valor) =>
            setOrden(
              (valor as OrdenAnimales) ?? "NOMBRE",
            )
          }
        >
          <SelectTrigger
            id="orden-animales"
            aria-label="Ordenar animales"
            className="w-44 shrink-0"
          >
            <ArrowUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
            <SelectValue placeholder="Nombre" />
          </SelectTrigger>
          <SelectContent>
            {itemsOrden.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* La baja es lógica, así que los animales dados de baja siguen
            consultables cuando se pidan expresamente. */}
        <div className="flex shrink-0 items-center gap-2">
          <Switch
            id="incluir-inactivos"
            checked={incluirInactivos}
            onCheckedChange={setIncluirInactivos}
          />
          <Label
            htmlFor="incluir-inactivos"
            className="text-sm font-normal text-muted-foreground"
          >
            Ver inactivos
          </Label>
        </div>
      </div>

      <AnimalesTabla
        cargando={animales.isLoading}
        error={animales.isError}
        animales={lista}
        vacioConFiltros={hayFiltros}
      />
    </section>
  );
}