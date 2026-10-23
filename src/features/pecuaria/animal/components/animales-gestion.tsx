"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDownIcon,
  Home,
  ListFilterIcon,
  PlusIcon,
  SearchIcon,
  ShieldPlusIcon,
  SyringeIcon,
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { MenuFlotante } from "@/components/accion-flotante";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { PecuariaVistasNav } from "@/features/pecuaria/components/pecuaria-vistas-nav";

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
            <BreadcrumbPage>Gestión pecuaria</BreadcrumbPage>
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
                } registrado${lista.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <MostrarSiPuede modulo="PECUARIA" nivel="COMPLETO">
          <MenuFlotante
            acciones={[
              {
                href: "/dashboard/pecuaria/nuevo",
                etiqueta: "Registrar animal",
                icono: <PlusIcon className="size-4" />,
              },
              {
                href: "/dashboard/pecuaria/vacunas/nueva",
                etiqueta: "Registrar vacuna",
                icono: <ShieldPlusIcon className="size-4" />,
              },
              {
                href: "/dashboard/pecuaria/desparasitaciones/nueva",
                etiqueta: "Registrar desparasitación",
                icono: <SyringeIcon className="size-4" />,
              },
            ]}
          />
        </MostrarSiPuede>
      </div>

      <PecuariaVistasNav />

      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar por código, nombre o estado…"
            className="pl-9"
            aria-label="Buscar animales"
            maxLength={120}
          />
        </div>

        <Dialog>
          <DialogTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="shrink-0 gap-2 md:hidden"
              />
            }
          >
            <ListFilterIcon className="size-4" />
            Filtros
            {incluirInactivos ? (
              <Badge
                variant="secondary"
                className="h-5 min-w-5 justify-center rounded-full px-1.5"
              >
                1
              </Badge>
            ) : null}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtros</DialogTitle>
              <DialogDescription>Orden y animales inactivos.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="orden-animales-movil">Orden</Label>
                <Select
                  items={itemsOrden}
                  value={orden}
                  onValueChange={(valor) =>
                    setOrden((valor as OrdenAnimales) ?? "NOMBRE")
                  }
                >
                  <SelectTrigger id="orden-animales-movil" className="w-full">
                    <SelectValue placeholder="Nombre" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemsOrden.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="incluir-inactivos-movil"
                  checked={incluirInactivos}
                  onCheckedChange={setIncluirInactivos}
                />
                <Label htmlFor="incluir-inactivos-movil">Ver inactivos</Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" />}>
                Ver resultados
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Select
          items={itemsOrden}
          value={orden}
          onValueChange={(valor) =>
            setOrden((valor as OrdenAnimales) ?? "NOMBRE")
          }
        >
          <SelectTrigger
            id="orden-animales"
            aria-label="Ordenar animales"
            className="hidden w-44 shrink-0 md:flex"
          >
            <ArrowUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
            <SelectValue placeholder="Nombre" />
          </SelectTrigger>
          <SelectContent>
            {itemsOrden.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
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
