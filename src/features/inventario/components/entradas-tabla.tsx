"use client";

import { useState } from "react";
import { ControlesPaginacion } from "@/components/controles-paginacion";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMensajeDeError } from "../api";
import { useEntradas, useInsumos } from "../hooks";

const TODOS_LOS_INSUMOS = "todos";

/** Muestra AAAA-MM-DD como DD/MM/AAAA sin pasar por Date (evita corrimientos). */
function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-");
  return dia && mes && anio ? `${dia}/${mes}/${anio}` : fecha;
}

export function EntradasTabla() {
  const [insumoId, setInsumoId] = useState(TODOS_LOS_INSUMOS);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [pagina, setPagina] = useState(1);

  const insumos = useInsumos();

  const filtros = {
    pagina,
    limite: 10,
    insumoId:
      insumoId === TODOS_LOS_INSUMOS ? undefined : Number(insumoId),
    desde: desde || undefined,
    hasta: hasta || undefined,
  };

  const entradas = useEntradas(filtros);

  const hayFiltrosActivos =
    insumoId !== TODOS_LOS_INSUMOS || desde !== "" || hasta !== "";

  function limpiarFiltros() {
    setInsumoId(TODOS_LOS_INSUMOS);
    setDesde("");
    setHasta("");
    setPagina(1);
  }

  const insumosItems = [
    { value: TODOS_LOS_INSUMOS, label: "Todos los insumos" },
    ...(insumos.data ?? []).map((insumo) => ({
      value: String(insumo.id),
      label: insumo.nombre,
    })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-end">
        <div className="grid gap-1.5">
          <Label htmlFor="filtro-insumo">Insumo</Label>
          <Select
            items={insumosItems}
            value={insumoId}
            onValueChange={(valor) => {
              setInsumoId(valor ?? TODOS_LOS_INSUMOS);
              setPagina(1);
            }}
          >
            <SelectTrigger id="filtro-insumo" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {insumosItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="filtro-desde">Desde</Label>
          <Input
            id="filtro-desde"
            type="date"
            value={desde}
            max={hasta || undefined}
            onChange={(evento) => {
              setDesde(evento.target.value);
              setPagina(1);
            }}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="filtro-hasta">Hasta</Label>
          <Input
            id="filtro-hasta"
            type="date"
            value={hasta}
            min={desde || undefined}
            onChange={(evento) => {
              setHasta(evento.target.value);
              setPagina(1);
            }}
          />
        </div>

        {hayFiltrosActivos && (
          <Button variant="ghost" onClick={limpiarFiltros}>
            Limpiar
          </Button>
        )}
      </div>

      {entradas.isError ? (
        <p className="text-sm text-destructive">
          {getMensajeDeError(entradas.error)}
        </p>
      ) : entradas.isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando entradas…</p>
      ) : entradas.data && entradas.data.datos.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Insumo</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Responsable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entradas.data.datos.map((entrada) => (
                <TableRow key={entrada.id}>
                  <TableCell>{formatearFecha(entrada.fecha)}</TableCell>
                  <TableCell className="font-medium">
                    {entrada.insumo.nombre}
                  </TableCell>
                  <TableCell className="text-right">
                    {entrada.cantidad} {entrada.insumo.unidadMedida}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entrada.origen ?? "—"}
                  </TableCell>
                  <TableCell>{entrada.responsable.nombre}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <ControlesPaginacion
            meta={entradas.data.meta}
            onPaginaChange={setPagina}
          />
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          {hayFiltrosActivos
            ? "No se encontraron entradas con los filtros aplicados."
            : "Todavía no se han registrado entradas de inventario."}
        </p>
      )}
    </div>
  );
}
