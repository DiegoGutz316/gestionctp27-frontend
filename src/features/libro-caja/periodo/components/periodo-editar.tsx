"use client";

import Link from "next/link";
import { getMensajeDeError } from "../servicios/periodo.service";
import { usePeriodo } from "../hooks/hooks";
import { PeriodoEditarForm } from "./periodo-editar-form";

export function PeriodoEditar({ id }: { id: number }) {
  const periodo = usePeriodo(id);

  if (periodo.isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando periodo…</p>;
  }

  if (periodo.isError || !periodo.data) {
    return (
      <p className="text-sm text-destructive">
        {getMensajeDeError(periodo.error)}
      </p>
    );
  }

  if (periodo.data.estado === "CERRADO") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          El periodo &quot;{periodo.data.nombre}&quot; está cerrado y no se
          puede editar.
        </p>
        <Link
          href={`/dashboard/libro-caja/periodos/${id}`}
          className="text-sm font-medium text-color-company underline-offset-4 hover:underline"
        >
          Volver al detalle
        </Link>
      </div>
    );
  }

  return <PeriodoEditarForm periodo={periodo.data} />;
}
