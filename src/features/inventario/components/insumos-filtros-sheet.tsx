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
import type { CategoriaInsumoRespuesta } from "../models/inventario.model";

export const TODAS_LAS_CATEGORIAS = "todas";

type InsumosFiltrosSheetProps = {
  abierto: boolean;
  onAbiertoChange: (abierto: boolean) => void;
  filtrosActivos: number;
  categoriaId: string;
  categorias: CategoriaInsumoRespuesta[];
  cargandoCategorias: boolean;
  onCategoriaChange: (categoriaId: string) => void;
  onLimpiar: () => void;
};

export function InsumosFiltrosSheet({
  abierto,
  onAbiertoChange,
  filtrosActivos,
  categoriaId,
  categorias,
  cargandoCategorias,
  onCategoriaChange,
  onLimpiar,
}: InsumosFiltrosSheetProps) {
  const categoriasItems = [
    { value: TODAS_LAS_CATEGORIAS, label: "Todas las categorías" },
    ...categorias.map((categoria) => ({
      value: String(categoria.id),
      label: categoria.nombre,
    })),
  ];

  return (
    <Sheet open={abierto} onOpenChange={onAbiertoChange}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-10 shrink-0 gap-2"
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
            Refine el listado por categoría de insumo.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 px-4">
          <Field>
            <FieldLabel htmlFor="filtro-categoria">Categoría</FieldLabel>
            <Select
              items={categoriasItems}
              value={categoriaId}
              onValueChange={(valor) => {
                onCategoriaChange(valor ?? TODAS_LAS_CATEGORIAS);
              }}
              disabled={cargandoCategorias}
            >
              <SelectTrigger id="filtro-categoria" className="w-full">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                {categoriasItems.map((item) => (
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
