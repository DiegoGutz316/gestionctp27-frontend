"use client";

import {
  formatearColones,
  formatearFechaInstante,
  formatearFechaLarga,
  formatearFechaPeriodo,
} from "@/features/libro-caja/formato";
import type { ColegioRespuesta } from "@/features/libro-caja/colegio/validacion/colegio.validacion";
import type { LibroDepartamentoRespuesta } from "../validacion/asiento.validacion";

function cuentaYEntidad(colegio: ColegioRespuesta): string {
  const cuenta = colegio.numeroCuentaBancaria.trim();
  const entidad = colegio.entidadDeposito.trim();
  if (cuenta && entidad) return `${cuenta}  ${entidad}`;
  return cuenta || entidad || "Sin registrar";
}

function fechaSaldoAnterior(libro: LibroDepartamentoRespuesta): string {
  if (libro.fondo.solicitadoEn) {
    return formatearFechaInstante(libro.fondo.solicitadoEn);
  }
  return formatearFechaPeriodo(libro.periodo.fechaInicio);
}

export function InformeEconomicoUdp({
  colegio,
  libro,
}: {
  colegio: ColegioRespuesta;
  libro: LibroDepartamentoRespuesta;
}) {
  const unidad = libro.fondo.departamento.nombreUnidad;
  const tipoActividad = libro.fondo.departamento.tipoActividad;

  const datosColegio = [
    ["Nombre Centro Educativo", colegio.nombre],
    ["Nombre de la Unidad", unidad],
    ["Periodo del Informe", libro.periodo.nombre],
    ["Tipo de Actividad", tipoActividad],
    [
      "N° Cuenta Bancaria y Entidad en que se depositaron los fondos",
      cuentaYEntidad(colegio),
    ],
  ] as const;

  return (
    <article className="informe-udp mx-auto w-full max-w-[210mm] bg-white px-2 py-4 text-black print:max-w-none print:px-0 print:py-0">
      <header className="space-y-0.5 text-center font-[Arial,Helvetica,sans-serif]">
        <p className="text-[12pt] font-bold uppercase">
          Ministerio de Educación Pública
        </p>
        <p className="text-[12pt] font-bold uppercase">
          Departamento de Especialidades Técnicas
        </p>
        <p className="text-[12pt] font-bold uppercase">
          Unidad de Financiamiento y Coordinación Técnica
        </p>
        <h1 className="pt-3 text-[14pt] font-bold">Informe Económico-UDP</h1>
      </header>

      <table className="mt-5 w-full table-fixed border-collapse border border-black font-[Arial,Helvetica,sans-serif] text-[11pt]">
        <colgroup>
          <col className="w-[42%]" />
          <col className="w-[58%]" />
        </colgroup>
        <tbody>
          {datosColegio.map(([etiqueta, valor]) => (
            <tr key={etiqueta}>
              <th className="w-[42%] border border-black px-2 py-1.5 text-left align-middle font-bold leading-tight">
                {etiqueta}
              </th>
              <td className="border border-black px-2 py-1.5 text-center align-middle font-normal">
                {valor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex items-center justify-between bg-[#ffff99] px-3 py-2 font-[Arial,Helvetica,sans-serif] text-[11pt] font-bold">
        <span>{fechaSaldoAnterior(libro)}</span>
        <span className="tabular-nums">
          {formatearColones(libro.fondoInicial)}
        </span>
      </div>

      <table className="mt-0 w-full border-collapse font-[Arial,Helvetica,sans-serif] text-[11pt]">
        <thead>
          <tr className="bg-[#deeaf6]">
            <th className="border border-black px-1 py-2 text-center font-bold">
              Asiento
            </th>
            <th className="border border-black px-1 py-2 text-center font-bold">
              Fecha
            </th>
            <th className="border border-black px-1 py-2 text-center font-bold leading-tight">
              No Factura / N.º Depósito
            </th>
            <th className="border border-black px-1 py-2 text-center font-bold">
              Descripción
            </th>
            <th className="border border-black px-1 py-2 text-center font-bold">
              Ingresos
            </th>
            <th className="border border-black px-1 py-2 text-center font-bold">
              Egresos
            </th>
            <th className="border border-black px-1 py-2 text-center font-bold">
              Saldo
            </th>
          </tr>
        </thead>
        <tbody>
          {libro.asientos.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="border border-black px-2 py-6 text-center text-[10pt]"
              >
                No hay asientos registrados en este periodo.
              </td>
            </tr>
          ) : null}

          {libro.asientos.map((asiento) => (
            <tr key={asiento.id}>
              <td className="border border-black bg-[#deeaf6] px-1 py-1.5 text-center font-bold tabular-nums">
                {asiento.numero}
              </td>
              <td className="border border-black px-1 py-1.5 text-center">
                {formatearFechaPeriodo(asiento.fecha)}
              </td>
              <td className="border border-black px-1 py-1.5 text-center">
                {asiento.numeroFactura}
              </td>
              <td className="border border-black px-2 py-1.5">
                {asiento.descripcion}
              </td>
              <td className="border border-black px-1 py-1.5 text-right tabular-nums">
                {formatearColones(asiento.ingresos)}
              </td>
              <td className="border border-black px-1 py-1.5 text-right tabular-nums">
                {formatearColones(asiento.egresos)}
              </td>
              <td className="border border-black bg-[#deeaf6] px-1 py-1.5 text-right tabular-nums">
                {formatearColones(asiento.saldo)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-[#deeaf6] font-bold">
            <td
              colSpan={4}
              className="border border-black px-2 py-2 text-center"
            >
              Totales al {formatearFechaLarga(libro.periodo.fechaFin)}
            </td>
            <td className="border border-black px-1 py-2 text-right tabular-nums">
              {formatearColones(libro.totales.ingresos)}
            </td>
            <td className="border border-black px-1 py-2 text-right tabular-nums">
              {formatearColones(libro.totales.egresos)}
            </td>
            <td className="border border-black px-1 py-2 text-right tabular-nums">
              {formatearColones(libro.totales.saldo)}
            </td>
          </tr>
        </tfoot>
      </table>

      <section className="mt-4 font-[Arial,Helvetica,sans-serif] text-[11pt]">
        <p className="font-bold">Observaciones:</p>
        <ol className="mt-1 list-decimal space-y-2 pl-8">
          <li className="min-h-5 border-b border-black" />
          <li className="min-h-5 border-b border-black" />
          <li className="min-h-5 border-b border-black" />
        </ol>
      </section>

      <section className="mt-8 grid grid-cols-3 gap-6 font-[Arial,Helvetica,sans-serif] text-[9pt]">
        <Firma rol="Director (a)" />
        <Firma rol="Presidente Junta Administrativa" />
        <Firma rol="Tesorera - Contadora" />
      </section>

      <p className="mt-8 text-center font-[Arial,Helvetica,sans-serif] text-[9pt] font-bold">
        Elaborado por Coordinador Técnico:
        <span className="ml-2 inline-block min-w-[16rem] border-b border-black" />
      </p>
    </article>
  );
}

function Firma({ rol }: { rol: string }) {
  return (
    <div className="space-y-2">
      <p>
        Nombre y apellidos:
        <span className="ml-1 inline-block min-w-[8rem] border-b border-black" />
      </p>
      <p>{rol}</p>
      <p>
        Firma:
        <span className="ml-1 inline-block min-w-[8rem] border-b border-black" />
      </p>
    </div>
  );
}
