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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { EstadoAviso } from "../validacion/aviso.validacion";

export type FiltroEstadoAviso = "TODOS" | EstadoAviso;

const filtroEstadoItems: { value: FiltroEstadoAviso; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "ACTIVO", label: "Activos" },
  { value: "INACTIVO", label: "Inactivos" },
];

type AvisosFiltrosSheetProps = {
  abierto: boolean;
  onAbiertoChange: (abierto: boolean) => void;
  estado: FiltroEstadoAviso;
  onEstadoChange: (estado: FiltroEstadoAviso) => void;
  onLimpiar: () => void;
};

export function AvisosFiltrosSheet({
  abierto,
  onAbiertoChange,
  estado,
  onEstadoChange,
  onLimpiar,
}: AvisosFiltrosSheetProps) {
  const filtrosActivos = estado === "TODOS" ? 0 : 1;

  return (
    <Dialog open={abierto} onOpenChange={onAbiertoChange}>
      <DialogTrigger
        render={
          <Button type="button" variant="outline" className="shrink-0 gap-2" />
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
            Refine el listado por estado del aviso.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="filtro-estado-aviso">Estado</FieldLabel>
            <Select
              items={filtroEstadoItems}
              value={estado}
              onValueChange={(valor) => {
                onEstadoChange((valor as FiltroEstadoAviso) ?? "TODOS");
              }}
            >
              <SelectTrigger id="filtro-estado-aviso" className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {filtroEstadoItems.map((item) => (
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
