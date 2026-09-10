"use client";

import type { PieInventarioMep } from "../models/inventario.model";

export function CampoInforme({
  value,
  onChange,
  ariaLabel,
  className = "",
  type = "text",
}: {
  value: string;
  onChange: (valor: string) => void;
  ariaLabel: string;
  className?: string;
  type?: "text" | "date";
}) {
  return (
    <input
      type={type}
      value={value}
      aria-label={ariaLabel}
      className={`w-full ${className}`}
      onChange={(evento) => onChange(evento.target.value)}
    />
  );
}

export function EncabezadoInventarioMep({
  colSpan,
  titulo,
  pie,
  onPieChange,
}: {
  colSpan: number;
  titulo: string;
  pie: PieInventarioMep;
  onPieChange: (pie: PieInventarioMep) => void;
}) {
  function actualizar(cambio: Partial<PieInventarioMep>) {
    onPieChange({ ...pie, ...cambio });
  }

  return (
    <>
      <tr>
        <td
          colSpan={colSpan}
          className="h-[72px] border-x-2 border-black p-1 text-left align-top"
        >
          <img
            src="/logo-mep.jpg"
            alt="Ministerio de Educación Pública. Dirección de Educación Técnica y Capacidades Emprendedoras"
            width={254}
            height={69}
            className="h-[69px] w-[254px] object-contain object-left"
          />
        </td>
      </tr>
      <tr>
        <td
          colSpan={colSpan}
          className="border-x-2 border-black py-0.5 text-center text-[12pt] font-bold uppercase"
        >
          Ministerio de Educación Pública
        </td>
      </tr>
      <tr>
        <td
          colSpan={colSpan}
          className="border-x-2 border-black py-0.5 text-center text-[12pt] font-bold uppercase"
        >
          Departamento de&nbsp;&nbsp;Especialidades Técnicas
        </td>
      </tr>
      <tr>
        <td
          colSpan={colSpan}
          className="border-x-2 border-black py-0.5 text-center text-[12pt] font-bold uppercase"
        >
          Unidad de Financiamiento y Coordinación Técnica
        </td>
      </tr>
      <tr>
        <td colSpan={colSpan} className="h-3 border-x-2 border-black p-0" />
      </tr>
      <tr>
        <td
          colSpan={colSpan}
          className="border-x-2 border-black py-1 text-center text-[14pt] font-bold"
        >
          {titulo}
        </td>
      </tr>
      <tr>
        <td colSpan={colSpan} className="h-4 border-x-2 border-black p-0" />
      </tr>
      <tr>
        <th
          colSpan={Math.ceil(colSpan / 2)}
          className="border border-black px-2 py-1.5 text-left align-middle text-[11pt] font-bold"
        >
          Centro Educativo
        </th>
        <td
          colSpan={Math.floor(colSpan / 2)}
          className="border border-black px-2 py-1.5 text-center align-middle text-[11pt] font-normal"
        >
          <CampoInforme
            value={pie.centroEducativo}
            ariaLabel="Centro educativo"
            className="text-center"
            onChange={(valor) => actualizar({ centroEducativo: valor })}
          />
        </td>
      </tr>
      <tr>
        <th
          colSpan={Math.ceil(colSpan / 2)}
          className="border border-black px-2 py-1.5 text-left align-middle text-[11pt] font-bold"
        >
          Fecha
        </th>
        <td
          colSpan={Math.floor(colSpan / 2)}
          className="border border-black px-2 py-1.5 text-center align-middle text-[11pt] font-normal"
        >
          <CampoInforme
            type="date"
            value={pie.fecha}
            ariaLabel="Fecha del inventario"
            className="text-center"
            onChange={(valor) => actualizar({ fecha: valor })}
          />
        </td>
      </tr>
      <tr>
        <th
          colSpan={Math.ceil(colSpan / 2)}
          className="border border-black px-2 py-1.5 text-left align-middle text-[11pt] font-bold"
        >
          Nombre de la Unidad
        </th>
        <td
          colSpan={Math.floor(colSpan / 2)}
          className="border border-black px-2 py-1.5 text-center align-middle text-[11pt] font-normal"
        >
          <CampoInforme
            value={pie.nombreUnidad}
            ariaLabel="Nombre de la unidad productiva"
            className="text-center"
            onChange={(valor) => actualizar({ nombreUnidad: valor })}
          />
        </td>
      </tr>
      <tr>
        <td colSpan={colSpan} className="h-3 border-x-2 border-black p-0" />
      </tr>
    </>
  );
}

export function FirmasInventarioMep({
  colSpan,
  pie,
  onPieChange,
}: {
  colSpan: number;
  pie: PieInventarioMep;
  onPieChange: (pie: PieInventarioMep) => void;
}) {
  const mitadIzquierda = Math.ceil(colSpan / 2);
  const mitadDerecha = colSpan - mitadIzquierda;

  function actualizar(cambio: Partial<PieInventarioMep>) {
    onPieChange({ ...pie, ...cambio });
  }

  return (
    <>
      <tr>
        <td colSpan={colSpan} className="h-4 border-x-2 border-black p-0" />
      </tr>
      <tr>
        <td
          colSpan={mitadIzquierda}
          className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
        >
          <span className="whitespace-nowrap">Nombre y apellidos:</span>{" "}
          <CampoInforme
            value={pie.director}
            ariaLabel="Nombre del director o directora"
            className="inline w-[calc(100%-8rem)]"
            onChange={(valor) => actualizar({ director: valor })}
          />
        </td>
        <td
          colSpan={mitadDerecha}
          className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
        >
          <span className="whitespace-nowrap">Nombre y apellidos:</span>{" "}
          <CampoInforme
            value={pie.presidente}
            ariaLabel="Nombre del presidente de la Junta Administrativa"
            className="inline w-[calc(100%-8rem)]"
            onChange={(valor) => actualizar({ presidente: valor })}
          />
        </td>
      </tr>
      <tr>
        <td
          colSpan={mitadIzquierda}
          className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
        >
          Director (a)
        </td>
        <td
          colSpan={mitadDerecha}
          className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
        >
          Presidente Junta Administrativa
        </td>
      </tr>
      <tr>
        <td
          colSpan={mitadIzquierda}
          className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
        >
          <span>Firma:</span>{" "}
          <CampoInforme
            value={pie.firmaDirector}
            ariaLabel="Firma del director o directora"
            className="inline w-[calc(100%-3rem)]"
            onChange={(valor) => actualizar({ firmaDirector: valor })}
          />
        </td>
        <td
          colSpan={mitadDerecha}
          className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
        >
          <span>Firma:</span>{" "}
          <CampoInforme
            value={pie.firmaPresidente}
            ariaLabel="Firma del presidente de la Junta Administrativa"
            className="inline w-[calc(100%-3rem)]"
            onChange={(valor) => actualizar({ firmaPresidente: valor })}
          />
        </td>
      </tr>
      <tr>
        <td
          colSpan={colSpan}
          className="border border-black py-1.5 text-center align-middle text-[9pt] font-bold"
        >
          Elaborado por Coordinador Técnico:{" "}
          <CampoInforme
            value={pie.coordinador}
            ariaLabel="Nombre del coordinador técnico"
            className="inline w-[16rem] text-center font-bold"
            onChange={(valor) => actualizar({ coordinador: valor })}
          />
        </td>
      </tr>
    </>
  );
}
