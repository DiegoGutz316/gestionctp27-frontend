"use client";

import {
  formatearColones,
  formatearFechaInstantePlantilla,
  formatearFechaPlantilla,
  formatearFechaTotalesInforme,
} from "@/features/libro-caja/formato";
import type { ColegioRespuesta } from "@/features/libro-caja/colegio/validacion/colegio.validacion";
import type { LibroDepartamentoRespuesta } from "../validacion/asiento.validacion";

const FILAS_PLANTILLA = 20;
const AMARILLO = "#ffff99";

function cuentaYEntidad(colegio: ColegioRespuesta): string {
  const cuenta = colegio.numeroCuentaBancaria.trim();
  const entidad = colegio.entidadDeposito.trim();
  if (cuenta && entidad) return `${cuenta}  ${entidad}`;
  return cuenta || entidad || "";
}

function fechaSaldoAnterior(libro: LibroDepartamentoRespuesta): string {
  if (libro.fondo.solicitadoEn) {
    return formatearFechaInstantePlantilla(libro.fondo.solicitadoEn);
  }
  return formatearFechaPlantilla(libro.periodo.fechaInicio);
}

function celdaMonto(valor: number | string, extra = "") {
  return (
    <td
      className={`border border-black px-1 py-0.5 text-right align-middle ${extra}`}
    >
      {typeof valor === "number" ? formatearColones(valor) : valor}
    </td>
  );
}

export function InformeEconomicoUdp({
  colegio,
  libro,
}: {
  colegio: ColegioRespuesta;
  libro: LibroDepartamentoRespuesta;
}) {
  const filasVacias = Math.max(0, FILAS_PLANTILLA - libro.asientos.length);
  const datosColegio = [
    ["Nombre Centro Educativo", colegio.nombre],
    ["Nombre de la Unidad ", libro.fondo.departamento.nombreUnidad],
    ["Periodo del Informe", libro.periodo.nombre],
    ["Tipo de Actividad", libro.fondo.departamento.tipoActividad],
    [
      "N° Cuenta Bancaria y Entidad en que se depositaron los fondos ",
      cuentaYEntidad(colegio),
    ],
  ] as const;

  return (
    <article
      className="informe-udp w-full bg-white text-black"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <table
        className="w-full table-fixed border-collapse border-2 border-black text-[11pt] leading-tight"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <colgroup>
          <col style={{ width: "5.4%" }} />
          <col style={{ width: "5.4%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "37.4%" }} />
          <col style={{ width: "11.1%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "18.7%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td
              colSpan={7}
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
              colSpan={7}
              className="border-x-2 border-black py-0.5 text-center text-[12pt] font-bold uppercase"
            >
              Ministerio de Educación Pública
            </td>
          </tr>
          <tr>
            <td
              colSpan={7}
              className="border-x-2 border-black py-0.5 text-center text-[12pt] font-bold uppercase"
            >
              Departamento de&nbsp;&nbsp;Especialidades Técnicas
            </td>
          </tr>
          <tr>
            <td
              colSpan={7}
              className="border-x-2 border-black py-0.5 text-center text-[12pt] font-bold uppercase"
            >
              Unidad de Financiamiento y Coordinación Técnica
            </td>
          </tr>
          <tr>
            <td colSpan={7} className="h-3 border-x-2 border-black p-0" />
          </tr>
          <tr>
            <td
              colSpan={7}
              className="border-x-2 border-black py-1 text-center text-[14pt] font-bold"
            >
              Informe Económico-UDP
            </td>
          </tr>
          <tr>
            <td colSpan={7} className="h-4 border-x-2 border-black p-0" />
          </tr>

          {datosColegio.map(([etiqueta, valor], indice) => (
            <tr key={etiqueta}>
              <th
                colSpan={3}
                className={`border border-black px-2 py-1.5 text-left align-middle text-[11pt] font-bold ${
                  indice === 4 ? "h-[37px]" : ""
                }`}
              >
                {etiqueta}
              </th>
              <td
                colSpan={4}
                className="border border-black px-2 py-1.5 text-center align-middle text-[11pt] font-normal"
              >
                {valor}
              </td>
            </tr>
          ))}

          <tr>
            <td colSpan={7} className="h-4 border-x-2 border-black p-0" />
          </tr>

          <tr>
            <td
              colSpan={6}
              className="border border-black px-2 py-1 text-right align-middle text-[11pt] font-bold"
              style={{ backgroundColor: AMARILLO }}
            >
              {fechaSaldoAnterior(libro)}
            </td>
            {celdaMonto(libro.fondoInicial, "bg-[#ffff99] font-bold")}
          </tr>

          <tr>
            <th className="h-12 border border-black bg-[#deeaf6] px-1 text-center align-middle text-[11pt] font-bold">
              Asiento
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 text-center align-middle text-[11pt] font-bold">
              Fecha
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 text-center align-middle text-[11pt] font-bold leading-tight">
              N<sup>o</sup> Factura/
              <br />
              N<sup>0</sup> Depósito
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 text-center align-middle text-[11pt] font-bold">
              Descripción
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 text-center align-middle text-[11pt] font-bold">
              Ingresos
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 text-center align-middle text-[11pt] font-bold">
              Egresos
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 text-center align-middle text-[11pt] font-bold">
              Saldo
            </th>
          </tr>

          {libro.asientos.map((asiento) => (
            <tr key={asiento.id}>
              <td className="border border-black px-1 py-1 text-center align-middle">
                {asiento.numero}
              </td>
              <td className="border border-black px-1 py-1 text-center align-middle">
                {formatearFechaPlantilla(asiento.fecha)}
              </td>
              <td className="border border-black px-1 py-1 text-center align-middle">
                {asiento.numeroFactura}
              </td>
              <td className="border border-black px-2 py-1 text-left align-middle">
                {asiento.descripcion}
              </td>
              {celdaMonto(asiento.ingresos)}
              {celdaMonto(asiento.egresos)}
              {celdaMonto(asiento.saldo, "bg-[#deeaf6]")}
            </tr>
          ))}

          {Array.from({ length: filasVacias }, (_, indice) => (
            <tr key={`vacio-${indice}`}>
              <td className="h-7 border border-black" />
              <td className="border border-black" />
              <td className="border border-black" />
              <td className="border border-black" />
              <td className="border border-black" />
              <td className="border border-black" />
              <td className="border border-black bg-[#deeaf6]" />
            </tr>
          ))}

          <tr className="font-bold">
            <td
              colSpan={4}
              className="border border-black bg-[#deeaf6] px-2 py-1.5 text-center align-middle"
            >
              Totales al {formatearFechaTotalesInforme(libro.periodo.fechaFin)}
            </td>
            {celdaMonto(libro.totales.ingresos, "bg-[#deeaf6] font-bold")}
            {celdaMonto(libro.totales.egresos, "bg-[#deeaf6] font-bold")}
            {celdaMonto(libro.totales.saldo, "bg-[#deeaf6] font-bold")}
          </tr>

          <tr>
            <td
              rowSpan={3}
              colSpan={2}
              className="fuente-calibri border border-black text-center align-middle text-[11pt] font-bold"
            >
              Observaciones:
            </td>
            <td
              colSpan={5}
              className="fuente-calibri border border-black px-2 py-1.5"
            >
              1
            </td>
          </tr>
          <tr>
            <td
              colSpan={5}
              className="fuente-calibri border border-black px-2 py-1.5"
            >
              2
            </td>
          </tr>
          <tr>
            <td
              colSpan={5}
              className="fuente-calibri border border-black px-2 py-1.5"
            >
              3
            </td>
          </tr>

          <tr>
            <td
              colSpan={3}
              className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
            >
              Nombre y apellidos:
            </td>
            <td className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]">
              Nombre y apellidos:
            </td>
            <td
              colSpan={3}
              className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
            >
              Nombre y apellidos:
            </td>
          </tr>
          <tr>
            <td
              colSpan={3}
              className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
            >
              Director (a)
            </td>
            <td className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]">
              Presidente Junta Administrativa
            </td>
            <td
              colSpan={3}
              className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
            >
              Tesorera -&nbsp;&nbsp;Contadora
            </td>
          </tr>
          <tr>
            <td
              colSpan={3}
              className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
            >
              Firma:
            </td>
            <td className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]">
              Firma:
            </td>
            <td
              colSpan={3}
              className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
            >
              Firma:
            </td>
          </tr>
          <tr>
            <td
              colSpan={7}
              className="border border-black py-1.5 text-center align-middle text-[9pt] font-bold"
            >
              Elaborado por Coordinador Técnico:
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
