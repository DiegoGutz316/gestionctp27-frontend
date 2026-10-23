"use client";

import {
  formatearColones,
  formatearFechaInstantePlantilla,
  formatearFechaPlantilla,
  formatearFechaTotalesInforme,
} from "@/features/libro-caja/formato";
import type { ColegioRespuesta } from "@/features/libro-caja/colegio/validacion/colegio.validacion";
import type { LibroDepartamentoRespuesta } from "../validacion/asiento.validacion";

const AMARILLO = "#ffff99";

export type PieInformeUdp = {
  observaciones: [string, string, string];
  director: string;
  presidente: string;
  tesorera: string;
  firmaDirector: string;
  firmaPresidente: string;
  firmaTesorera: string;
  coordinador: string;
};

export const PIE_INFORME_VACIO: PieInformeUdp = {
  observaciones: ["", "", ""],
  director: "",
  presidente: "",
  tesorera: "",
  firmaDirector: "",
  firmaPresidente: "",
  firmaTesorera: "",
  coordinador: "",
};

function CampoInforme({
  value,
  onChange,
  ariaLabel,
  maxLength,
  className = "",
}: {
  value: string;
  onChange: (valor: string) => void;
  ariaLabel: string;
  maxLength: number;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      aria-label={ariaLabel}
      maxLength={maxLength}
      className={`w-full ${className}`}
      onChange={(evento) => onChange(evento.target.value)}
    />
  );
}

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

function celdaMonto(valor: number | string, extra = "", vacioSiCero = false) {
  const texto =
    typeof valor === "number"
      ? vacioSiCero && valor === 0
        ? ""
        : formatearColones(valor)
      : valor;
  return (
    <td
      className={`border border-black px-1 py-0.5 text-right align-middle ${extra}`}
    >
      {texto}
    </td>
  );
}

export function InformeEconomicoUdp({
  colegio,
  libro,
  pie,
  onPieChange,
}: {
  colegio: ColegioRespuesta;
  libro: LibroDepartamentoRespuesta;
  pie: PieInformeUdp;
  onPieChange: (pie: PieInformeUdp) => void;
}) {
  function actualizarPie(cambio: Partial<PieInformeUdp>) {
    onPieChange({ ...pie, ...cambio });
  }

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
          <col style={{ width: "14%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "26.8%" }} />
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
              {celdaMonto(asiento.ingresos, "", true)}
              {celdaMonto(asiento.egresos, "", true)}
              {celdaMonto(asiento.saldo, "bg-[#deeaf6]")}
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
              className="fuente-calibri h-7 border border-black px-2 py-1.5"
            >
              <CampoInforme
                value={pie.observaciones[0]}
                ariaLabel="Observación 1"
                maxLength={300}
                onChange={(valor) =>
                  actualizarPie({
                    observaciones: [valor, pie.observaciones[1], pie.observaciones[2]],
                  })
                }
              />
            </td>
          </tr>
          <tr>
            <td
              colSpan={5}
              className="fuente-calibri h-7 border border-black px-2 py-1.5"
            >
              <CampoInforme
                value={pie.observaciones[1]}
                ariaLabel="Observación 2"
                maxLength={300}
                onChange={(valor) =>
                  actualizarPie({
                    observaciones: [pie.observaciones[0], valor, pie.observaciones[2]],
                  })
                }
              />
            </td>
          </tr>
          <tr>
            <td
              colSpan={5}
              className="fuente-calibri h-7 border border-black px-2 py-1.5"
            >
              <CampoInforme
                value={pie.observaciones[2]}
                ariaLabel="Observación 3"
                maxLength={300}
                onChange={(valor) =>
                  actualizarPie({
                    observaciones: [pie.observaciones[0], pie.observaciones[1], valor],
                  })
                }
              />
            </td>
          </tr>

          <tr>
            <td
              colSpan={3}
              className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
            >
              <span className="whitespace-nowrap">Nombre y apellidos:</span>{" "}
              <CampoInforme
                value={pie.director}
                ariaLabel="Nombre del director o directora"
                maxLength={120}
                className="inline w-[calc(100%-8rem)]"
                onChange={(valor) => actualizarPie({ director: valor })}
              />
            </td>
            <td className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]">
              <span className="whitespace-nowrap">Nombre y apellidos:</span>{" "}
              <CampoInforme
                value={pie.presidente}
                ariaLabel="Nombre del presidente de la Junta Administrativa"
                maxLength={120}
                className="inline w-[calc(100%-8rem)]"
                onChange={(valor) => actualizarPie({ presidente: valor })}
              />
            </td>
            <td
              colSpan={3}
              className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
            >
              <span className="whitespace-nowrap">Nombre y apellidos:</span>{" "}
              <CampoInforme
                value={pie.tesorera}
                ariaLabel="Nombre de la tesorera o contadora"
                maxLength={120}
                className="inline w-[calc(100%-8rem)]"
                onChange={(valor) => actualizarPie({ tesorera: valor })}
              />
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
              <span>Firma:</span>{" "}
              <CampoInforme
                value={pie.firmaDirector}
                ariaLabel="Firma del director o directora"
                maxLength={120}
                className="inline w-[calc(100%-3rem)]"
                onChange={(valor) => actualizarPie({ firmaDirector: valor })}
              />
            </td>
            <td className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]">
              <span>Firma:</span>{" "}
              <CampoInforme
                value={pie.firmaPresidente}
                ariaLabel="Firma del presidente de la Junta Administrativa"
                maxLength={120}
                className="inline w-[calc(100%-3rem)]"
                onChange={(valor) => actualizarPie({ firmaPresidente: valor })}
              />
            </td>
            <td
              colSpan={3}
              className="border border-black px-2 py-1.5 text-left align-middle text-[9pt]"
            >
              <span>Firma:</span>{" "}
              <CampoInforme
                value={pie.firmaTesorera}
                ariaLabel="Firma de la tesorera o contadora"
                maxLength={120}
                className="inline w-[calc(100%-3rem)]"
                onChange={(valor) => actualizarPie({ firmaTesorera: valor })}
              />
            </td>
          </tr>
          <tr>
            <td
              colSpan={7}
              className="border border-black py-1.5 text-center align-middle text-[9pt] font-bold"
            >
              Elaborado por Coordinador Técnico:{" "}
              <CampoInforme
                value={pie.coordinador}
                ariaLabel="Nombre del coordinador técnico"
                maxLength={120}
                className="inline w-[16rem] text-center font-bold"
                onChange={(valor) => actualizarPie({ coordinador: valor })}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
