"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Home, ListFilterIcon, PlusIcon } from "lucide-react";

import { AccionFlotante } from "@/components/accion-flotante";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { PecuariaVistasNav } from "@/features/pecuaria/components/pecuaria-vistas-nav";

import { useAnimales } from "@/features/pecuaria/animal/hooks/hooks";
import { useProduccion } from "../hooks/hooks";
import {
  ETIQUETA_TIPO_PRODUCCION,
  TIPOS_PRODUCCION,
  UNIDAD_TIPO_PRODUCCION,
  etiquetaEspecieProduccion,
  formatearCantidad,
  formatearFecha,
  type TipoProduccion,
} from "../models/produccion.model";
import { getMensajeDeError } from "../servicios/produccion.service";

const TODOS_LOS_TIPOS = "todos";

const tiposFiltro = [
  {
    value: TODOS_LOS_TIPOS,
    label: "Todos los tipos",
  },
  ...TIPOS_PRODUCCION.map((tipo) => ({
    value: tipo,
    label: ETIQUETA_TIPO_PRODUCCION[tipo],
  })),
];

export function ProduccionConsulta() {
  const searchParams = useSearchParams();
  const animalInicial = searchParams.get("animalId") ?? "";

  const [animalId, setAnimalId] = useState(animalInicial);
  const [desde, setDesde] = useState("");
  const [tipoProduccion, setTipoProduccion] = useState<
    TipoProduccion | ""
  >("");

  const animales = useAnimales();
  const consulta = useProduccion({
    animalId: Number(animalId) || 0,
    desde: desde || undefined,
    tipoProduccion: tipoProduccion || undefined,
  });

  const animalesItems = (animales.data ?? []).map((animal) => ({
    value: String(animal.id),
    label: `${animal.codigo} — ${animal.nombre} (${etiquetaEspecieProduccion(animal.especie)})`,
  }));

  const registros = consulta.data?.registros ?? [];
  const totales = consulta.data?.totales ?? [];
  const animalSeleccionado = Number(animalId) > 0;

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
            <BreadcrumbLink
              render={<Link href="/dashboard/pecuaria" />}
            >
              Gestión pecuaria
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Producción</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Producción pecuaria
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Consulte la producción registrada de cada animal.
          </p>
        </div>

        <MostrarSiPuede modulo="PECUARIA" nivel="COMPLETO">
          <Button
            className="hidden md:inline-flex"
            nativeButton={false}
            render={
              <Link
                href={
                  animalId
                    ? `/dashboard/pecuaria/produccion/nuevo?animalId=${animalId}`
                    : "/dashboard/pecuaria/produccion/nuevo"
                }
              />
            }
          >
            <PlusIcon data-icon="inline-start" />
            Registrar producción
          </Button>
          <AccionFlotante
            href={
              animalId
                ? `/dashboard/pecuaria/produccion/nuevo?animalId=${animalId}`
                : "/dashboard/pecuaria/produccion/nuevo"
            }
            etiqueta="Registrar producción"
          />
        </MostrarSiPuede>
      </div>

      <PecuariaVistasNav />

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger
            render={<Button type="button" variant="outline" className="gap-2" />}
          >
            <ListFilterIcon className="size-4" />
            Filtros
            {[animalId, desde, tipoProduccion].filter(Boolean).length > 0 ? (
              <Badge variant="secondary" className="h-5 min-w-5 justify-center rounded-full px-1.5">
                {[animalId, desde, tipoProduccion].filter(Boolean).length}
              </Badge>
            ) : null}
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>Animal, fecha y tipo de producción.</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4">
              <div className="space-y-2">
                <Label htmlFor="filtro-animal-movil">Animal</Label>
                <Select
                  items={animalesItems}
                  value={animalId === "" ? null : animalId}
                  onValueChange={(valor) => setAnimalId((valor as string | null) ?? "")}
                >
                  <SelectTrigger id="filtro-animal-movil" className="w-full" disabled={animales.isLoading}>
                    <SelectValue placeholder="Seleccione un animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {animalesItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filtro-desde-movil">A partir de</Label>
                <Input id="filtro-desde-movil" type="date" value={desde} onChange={(event) => setDesde(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filtro-tipo-movil">Tipo</Label>
                <Select
                  items={tiposFiltro}
                  value={tipoProduccion === "" ? TODOS_LOS_TIPOS : tipoProduccion}
                  onValueChange={(valor) => {
                    const seleccionado = (valor as string | null) ?? TODOS_LOS_TIPOS;
                    setTipoProduccion(seleccionado === TODOS_LOS_TIPOS ? "" : (seleccionado as TipoProduccion));
                  }}
                >
                  <SelectTrigger id="filtro-tipo-movil" className="w-full">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposFiltro.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SheetFooter>
              <SheetClose render={<Button type="button" />}>Ver resultados</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden gap-4 rounded-xl border bg-card p-4 shadow-sm md:grid sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="filtro-animal">Animal</Label>
          <Select
            items={animalesItems}
            value={animalId === "" ? null : animalId}
            onValueChange={(valor) =>
              setAnimalId((valor as string | null) ?? "")
            }
          >
            <SelectTrigger
              id="filtro-animal"
              className="w-full"
              disabled={animales.isLoading}
            >
              <SelectValue placeholder="Seleccione un animal" />
            </SelectTrigger>
            <SelectContent>
              {animalesItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filtro-desde">A partir de</Label>
          <Input
            id="filtro-desde"
            type="date"
            value={desde}
            onChange={(event) => setDesde(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filtro-tipo">Tipo</Label>
          <Select
            items={tiposFiltro}
            value={tipoProduccion === "" ? TODOS_LOS_TIPOS : tipoProduccion}
            onValueChange={(valor) => {
              const seleccionado = (valor as string | null) ?? TODOS_LOS_TIPOS;
              setTipoProduccion(
                seleccionado === TODOS_LOS_TIPOS
                  ? ""
                  : (seleccionado as TipoProduccion),
              );
            }}
          >
            <SelectTrigger id="filtro-tipo" className="w-full">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              {tiposFiltro.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!animalSeleccionado ? (
        <p className="rounded-xl border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          Seleccione un animal para consultar su producción.
        </p>
      ) : null}

      {animalSeleccionado && consulta.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : null}

      {animalSeleccionado && consulta.isError ? (
        <p className="text-sm text-destructive">
          {getMensajeDeError(consulta.error)}
        </p>
      ) : null}

      {animalSeleccionado && consulta.data ? (
        <>
          {totales.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {totales.map((total) => (
                <Card key={total.tipoProduccion} className="shadow-xs">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total {ETIQUETA_TIPO_PRODUCCION[total.tipoProduccion]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold tabular-nums tracking-tight">
                      {formatearCantidad(total.cantidad)}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        {UNIDAD_TIPO_PRODUCCION[total.tipoProduccion]}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo de producción</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-16 text-center text-sm text-muted-foreground"
                    >
                      No existen registros de producción para el filtro
                      aplicado.
                    </TableCell>
                  </TableRow>
                ) : (
                  registros.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell>{formatearFecha(registro.fecha)}</TableCell>
                      <TableCell>
                        {ETIQUETA_TIPO_PRODUCCION[registro.tipoProduccion]}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatearCantidad(registro.cantidad)}{" "}
                        {UNIDAD_TIPO_PRODUCCION[registro.tipoProduccion]}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      ) : null}
    </section>
  );
}
