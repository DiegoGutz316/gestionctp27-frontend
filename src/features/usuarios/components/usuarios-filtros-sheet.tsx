"use client";

import {
  ListFilterIcon,
} from "lucide-react";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ETIQUETA_ROL,
  ROLES_USUARIO,
  type RolUsuario,
} from "../models/usuario.model";

const filtroRolItems = [
  { value: "todos", label: "Todos los roles" },
  ...ROLES_USUARIO.map((rol) => ({
    value: rol,
    label: ETIQUETA_ROL[rol],
  })),
];

const filtroActivoItems = [
  { value: "todos", label: "Todos" },
  { value: "true", label: "Activos" },
  { value: "false", label: "Inactivos" },
];

const filtroOrdenItems = [
  { value: "ASC", label: "Nombre A–Z" },
  { value: "DESC", label: "Nombre Z–A" },
];

type UsuariosFiltrosSheetProps = {
  abierto: boolean;
  onAbiertoChange: (abierto: boolean) => void;
  filtrosActivos: number;
  rol: RolUsuario | "todos";
  activo: "todos" | "true" | "false";
  order: "ASC" | "DESC";
  onRolChange: (rol: RolUsuario | "todos") => void;
  onActivoChange: (activo: "todos" | "true" | "false") => void;
  onOrderChange: (order: "ASC" | "DESC") => void;
  onLimpiar: () => void;
};

export function UsuariosFiltrosSheet({
  abierto,
  onAbiertoChange,
  filtrosActivos,
  rol,
  activo,
  order,
  onRolChange,
  onActivoChange,
  onOrderChange,
  onLimpiar,
}: UsuariosFiltrosSheetProps) {
  return (
    <Dialog open={abierto} onOpenChange={onAbiertoChange}>
      <DialogTrigger
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
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription>
            Refine el listado por rol, estado u orden.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="filtro-rol">Rol</FieldLabel>
            <Select
              items={filtroRolItems}
              value={rol}
              onValueChange={(valor) => {
                onRolChange((valor as RolUsuario | "todos") ?? "todos");
              }}
            >
              <SelectTrigger id="filtro-rol" className="w-full">
                <SelectValue placeholder="Todos los roles" />
              </SelectTrigger>
              <SelectContent>
                {filtroRolItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="filtro-activo">Estado</FieldLabel>
            <Select
              items={filtroActivoItems}
              value={activo}
              onValueChange={(valor) => {
                onActivoChange(
                  (valor as "todos" | "true" | "false") ?? "todos",
                );
              }}
            >
              <SelectTrigger id="filtro-activo" className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {filtroActivoItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="filtro-orden">Orden</FieldLabel>
            <Select
              items={filtroOrdenItems}
              value={order}
              onValueChange={(valor) => {
                onOrderChange((valor as "ASC" | "DESC") ?? "ASC");
              }}
            >
              <SelectTrigger id="filtro-orden" className="w-full">
                <SelectValue placeholder="Nombre A–Z" />
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
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onLimpiar}
            disabled={filtrosActivos === 0}
          >
            Limpiar filtros
          </Button>
          <DialogClose render={<Button type="button" />}>
            Ver resultados
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
