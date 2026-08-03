"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMensajeDeError } from "../api";
import { useCategorias, useInsumos } from "../hooks";

const TODAS_LAS_CATEGORIAS = "todas";

export function InsumosTable() {
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState(TODAS_LAS_CATEGORIAS);
  const nombreDebounced = useDebouncedValue(nombre, 300);

  const categorias = useCategorias();
  const hayFiltrosActivos =
    nombreDebounced.trim() !== "" || categoriaId !== TODAS_LAS_CATEGORIAS;

  const insumos = useInsumos({
    nombre: nombreDebounced.trim() || undefined,
    categoriaId:
      categoriaId === TODAS_LAS_CATEGORIAS ? undefined : Number(categoriaId),
  });

  const categoriasItems = [
    { value: TODAS_LAS_CATEGORIAS, label: "Todas las categorías" },
    ...(categorias.data ?? []).map((categoria) => ({
      value: String(categoria.id),
      label: categoria.nombre,
    })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Buscar insumo por nombre"
            placeholder="Buscar por nombre…"
            className="pl-8"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
          />
        </div>
        <Select
          items={categoriasItems}
          value={categoriaId}
          onValueChange={(valor) => setCategoriaId(valor ?? TODAS_LAS_CATEGORIAS)}
        >
          <SelectTrigger aria-label="Filtrar por categoría" className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoriasItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {insumos.isError ? (
        <p className="text-sm text-destructive">
          {getMensajeDeError(insumos.error)}
        </p>
      ) : insumos.isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando insumos…</p>
      ) : insumos.data && insumos.data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {insumos.data.map((insumo) => (
              <TableRow key={insumo.id}>
                <TableCell className="font-medium">{insumo.nombre}</TableCell>
                <TableCell>{insumo.categoria.nombre}</TableCell>
                <TableCell>{insumo.unidadMedida}</TableCell>
                <TableCell className="text-right">{insumo.cantidad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground">
          {hayFiltrosActivos
            ? "No se encontraron insumos que coincidan con la búsqueda."
            : "Todavía no hay insumos registrados."}
        </p>
      )}
    </div>
  );
}
