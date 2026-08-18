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
import { Badge } from "@/components/ui/badge";
import {
  ETIQUETA_TIPO_MOVIMIENTO,
  TIPOS_MOVIMIENTO,
  type TipoMovimiento,
} from "../models/inventario.model";
import { getMensajeDeError } from "../api";
import { useInsumos, useMovimientos } from "../hooks";

const TODOS_LOS_INSUMOS = "todos";
const TODOS_LOS_TIPOS = "todos";

/** Muestra AAAA-MM-DD como DD/MM/AAAA sin pasar por Date (evita corrimientos). */
function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-");
  return dia && mes && anio ? `${dia}/${mes}/${anio}` : fecha;
}

export function MovimientosTabla() {
  const [tipo, setTipo] = useState<string>(TODOS_LOS_TIPOS);
  const [insumoId, setInsumoId] = useState(TODOS_LOS_INSUMOS);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [pagina, setPagina] = useState(1);

  const insumos = useInsumos();

  const filtros = {
    pagina,
    limite: 10,
    tipo: tipo === TODOS_LOS_TIPOS ? undefined : (tipo as TipoMovimiento),
    insumoId:
      insumoId === TODOS_LOS_INSUMOS ? undefined : Number(insumoId),
    desde: desde || undefined,
    hasta: hasta || undefined,
  };

  const movimientos = useMovimientos(filtros);

  const hayFiltrosActivos =
    tipo !== TODOS_LOS_TIPOS ||
    insumoId !== TODOS_LOS_INSUMOS ||
    desde !== "" ||
    hasta !== "";

  // Cualquier cambio de filtro vuelve a la primera página: la página 5 del
  // resultado anterior no tiene por qué existir en el nuevo.
  function cambiarFiltro(aplicar: () => void) {
    aplicar();
    setPagina(1);
  }

  function limpiarFiltros() {
    setTipo(TODOS_LOS_TIPOS);
    setInsumoId(TODOS_LOS_INSUMOS);
    setDesde("");
    setHasta("");
    setPagina(1);
  }

  const tiposItems = [
    { value: TODOS_LOS_TIPOS, label: "Entradas y salidas" },
    ...TIPOS_MOVIMIENTO.map((t) => ({
      value: t,
      label: ETIQUETA_TIPO_MOVIMIENTO[t],
    })),
  ];

  const insumosItems = [
    { value: TODOS_LOS_INSUMOS, label: "Todos los insumos" },
    ...(insumos.data ?? []).map((insumo) => ({
      value: String(insumo.id),
      label: insumo.nombre,
    })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] sm:items-end">
        <div className="grid gap-1.5">
          <Label htmlFor="filtro-tipo">Tipo</Label>
          <Select
            items={tiposItems}
            value={tipo}
            onValueChange={(valor) =>
              cambiarFiltro(() => setTipo(valor ?? TODOS_LOS_TIPOS))
            }
          >
            <SelectTrigger id="filtro-tipo" className="w-full sm:w-48">
              <SelectValue />
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

        <div className="grid gap-1.5">
          <Label htmlFor="filtro-insumo">Insumo</Label>
          <Select
            items={insumosItems}
            value={insumoId}
            onValueChange={(valor) =>
              cambiarFiltro(() => setInsumoId(valor ?? TODOS_LOS_INSUMOS))
            }
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
            onChange={(evento) =>
              cambiarFiltro(() => setDesde(evento.target.value))
            }
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="filtro-hasta">Hasta</Label>
          <Input
            id="filtro-hasta"
            type="date"
            value={hasta}
            min={desde || undefined}
            onChange={(evento) =>
              cambiarFiltro(() => setHasta(evento.target.value))
            }
          />
        </div>

        {hayFiltrosActivos && (
          <Button variant="ghost" onClick={limpiarFiltros}>
            Limpiar
          </Button>
        )}
      </div>

      {movimientos.isError ? (
        <p className="text-sm text-destructive">
          {getMensajeDeError(movimientos.error)}
        </p>
      ) : movimientos.isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando movimientos…</p>
      ) : movimientos.data && movimientos.data.datos.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Insumo</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead>Origen / Motivo</TableHead>
                <TableHead>Responsable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimientos.data.datos.map((movimiento) => {
                const esEntrada = movimiento.tipo === "ENTRADA";

                return (
                  <TableRow key={movimiento.id}>
                    <TableCell>{formatearFecha(movimiento.fecha)}</TableCell>
                    <TableCell>
                      <Badge variant={esEntrada ? "secondary" : "outline"}>
                        {ETIQUETA_TIPO_MOVIMIENTO[movimiento.tipo]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {movimiento.insumo.nombre}
                    </TableCell>
                    {/* El signo hace legible de un vistazo si el stock subió o
                    bajó, sin tener que leer la columna de tipo. */}
                    <TableCell className="text-right tabular-nums">
                      {esEntrada ? "+" : "−"}
                      {movimiento.cantidad} {movimiento.insumo.unidadMedida}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(esEntrada ? movimiento.origen : movimiento.motivo) ??
                        "—"}
                    </TableCell>
                    <TableCell>{movimiento.responsable.nombre}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <ControlesPaginacion
            meta={movimientos.data.meta}
            onPaginaChange={setPagina}
          />
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          {hayFiltrosActivos
            ? "No se encontraron movimientos con los filtros aplicados."
            : "Todavía no se han registrado movimientos de inventario."}
        </p>
      )}
    </div>
  );
}
