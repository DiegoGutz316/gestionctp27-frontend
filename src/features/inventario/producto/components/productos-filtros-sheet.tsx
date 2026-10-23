"use client";

import { ListFilterIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DEPARTAMENTOS,
  ETIQUETA_DEPARTAMENTO,
  ETIQUETA_TIPO_PRODUCTO,
  ETIQUETA_ORDEN_PRODUCTOS,
  ETIQUETA_UBICACION,
  ORDENES_PRODUCTOS,
  TIPOS_PRODUCTO,
  UBICACIONES,
  type Departamento,
  type OrdenProductos,
  type TipoProducto,
  type Ubicacion,
} from "../models/producto.model";

export const TODOS = "todos";

const filtroTipoItems = [
  { value: TODOS, label: "Todos los tipos" },
  ...TIPOS_PRODUCTO.map((tipo) => ({
    value: tipo,
    label: ETIQUETA_TIPO_PRODUCTO[tipo],
  })),
];

const filtroDepartamentoItems = [
  { value: TODOS, label: "Todos los departamentos" },
  ...DEPARTAMENTOS.map((departamento) => ({
    value: departamento,
    label: ETIQUETA_DEPARTAMENTO[departamento],
  })),
];

const filtroOrdenItems = ORDENES_PRODUCTOS.map((orden) => ({
  value: orden,
  label: ETIQUETA_ORDEN_PRODUCTOS[orden],
}));

const filtroUbicacionItems = [
  { value: TODOS, label: "Todas las ubicaciones" },
  ...UBICACIONES.map((ubicacion) => ({
    value: ubicacion,
    label: ETIQUETA_UBICACION[ubicacion],
  })),
];

type ProductosFiltrosSheetProps = {
  abierto: boolean;
  onAbiertoChange: (abierto: boolean) => void;
  filtrosActivos: number;
  tipoProducto: TipoProducto | "todos";
  departamento: Departamento | "todos";
  ubicacion: Ubicacion | "todos";
  orden: OrdenProductos;
  onTipoProductoChange: (valor: TipoProducto | "todos") => void;
  onDepartamentoChange: (valor: Departamento | "todos") => void;
  onUbicacionChange: (valor: Ubicacion | "todos") => void;
  onOrdenChange: (valor: OrdenProductos) => void;
  onLimpiar: () => void;
};

export function ProductosFiltrosSheet({
  abierto,
  onAbiertoChange,
  filtrosActivos,
  tipoProducto,
  departamento,
  ubicacion,
  orden,
  onTipoProductoChange,
  onDepartamentoChange,
  onUbicacionChange,
  onOrdenChange,
  onLimpiar,
}: ProductosFiltrosSheetProps) {
  return (
    <Sheet open={abierto} onOpenChange={onAbiertoChange}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="shrink-0 gap-2"
          />
        }
      >
        <ListFilterIcon className="size-4" />
        Filtros
        {filtrosActivos > 0 ? (
          <Badge
            variant="secondary"
            className="h-5 min-w-5 justify-center rounded-full px-1.5"
          >
            {filtrosActivos}
          </Badge>
        ) : null}
      </SheetTrigger>
      <SheetContent side="right" className="gap-0">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Refine el listado por tipo, departamento o ubicación.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 px-4">
          <Field className="md:hidden">
            <FieldLabel htmlFor="filtro-orden">Orden</FieldLabel>
            <Select
              items={filtroOrdenItems}
              value={orden}
              onValueChange={(valor) => {
                onOrdenChange((valor as OrdenProductos) ?? "NOMBRE");
              }}
            >
              <SelectTrigger id="filtro-orden" className="w-full">
                <SelectValue placeholder="Nombre" />
              </SelectTrigger>
              <SelectContent>
                {filtroOrdenItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="filtro-tipo">Tipo de producto</FieldLabel>
            <Select
              items={filtroTipoItems}
              value={tipoProducto}
              onValueChange={(valor) => {
                onTipoProductoChange(
                  (valor as TipoProducto | "todos") ?? TODOS,
                );
              }}
            >
              <SelectTrigger id="filtro-tipo" className="w-full">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                {filtroTipoItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="filtro-departamento">Departamento</FieldLabel>
            <Select
              items={filtroDepartamentoItems}
              value={departamento}
              onValueChange={(valor) => {
                onDepartamentoChange(
                  (valor as Departamento | "todos") ?? TODOS,
                );
              }}
            >
              <SelectTrigger id="filtro-departamento" className="w-full">
                <SelectValue placeholder="Todos los departamentos" />
              </SelectTrigger>
              <SelectContent>
                {filtroDepartamentoItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="filtro-ubicacion">Ubicación</FieldLabel>
            <Select
              items={filtroUbicacionItems}
              value={ubicacion}
              onValueChange={(valor) => {
                onUbicacionChange((valor as Ubicacion | "todos") ?? TODOS);
              }}
            >
              <SelectTrigger id="filtro-ubicacion" className="w-full">
                <SelectValue placeholder="Todas las ubicaciones" />
              </SelectTrigger>
              <SelectContent>
                {filtroUbicacionItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onLimpiar}
            disabled={filtrosActivos === 0}
          >
            Limpiar filtros
          </Button>
          <SheetClose render={<Button type="button" />}>
            Ver resultados
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
