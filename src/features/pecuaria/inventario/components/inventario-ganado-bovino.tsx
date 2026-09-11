"use client";

import {
  CATEGORIAS_BOVINAS,
  type AnimalRespuesta,
} from "@/features/pecuaria/animal/models/animal.model";

import {
  cantidadPorCategoria,
  observacionInventario,
  type PieInventarioMep,
} from "../models/inventario.model";
import {
  EncabezadoInventarioMep,
  FirmasInventarioMep,
} from "./inventario-mep";

function mostrarCantidad(valor: number): string {
  return valor > 0 ? String(valor) : "";
}

export function InventarioGanadoBovino({
  animales,
  pie,
  onPieChange,
}: {
  animales: AnimalRespuesta[];
  pie: PieInventarioMep;
  onPieChange: (pie: PieInventarioMep) => void;
}) {
  const totales = {
    TORO: 0,
    NOVILLA: 0,
    VACA: 0,
    TERNERO: 0,
    TORETE: 0,
  };

  for (const animal of animales) {
    for (const categoria of CATEGORIAS_BOVINAS) {
      totales[categoria] += cantidadPorCategoria(animal, categoria);
    }
  }

  const totalGeneral =
    totales.TORO +
    totales.NOVILLA +
    totales.VACA +
    totales.TERNERO +
    totales.TORETE;

  return (
    <article
      className="informe-udp w-full bg-white text-black"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <table
        className="w-full table-fixed border-collapse border-2 border-black text-[10pt] leading-tight"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <colgroup>
          <col style={{ width: "8%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "19%" }} />
        </colgroup>
        <tbody>
          <EncabezadoInventarioMep
            colSpan={9}
            titulo="Inventario Ganado Bovino-UDP"
            pie={pie}
            onPieChange={onPieChange}
          />
          <tr>
            <th
              rowSpan={2}
              className="border border-black bg-[#deeaf6] px-1 py-1 text-center align-middle text-[9pt] font-bold"
            >
              Asiento
            </th>
            <th
              rowSpan={2}
              className="border border-black bg-[#deeaf6] px-1 py-1 text-center align-middle text-[9pt] font-bold"
            >
              N° de identificación
            </th>
            <th
              colSpan={5}
              className="border border-black bg-[#deeaf6] px-1 py-1 text-center align-middle text-[9pt] font-bold"
            >
              Cantidad de animales
            </th>
            <th
              rowSpan={2}
              className="border border-black bg-[#deeaf6] px-1 py-1 text-center align-middle text-[9pt] font-bold"
            >
              Raza
            </th>
            <th
              rowSpan={2}
              className="border border-black bg-[#deeaf6] px-1 py-1 text-center align-middle text-[9pt] font-bold"
            >
              Observaciones
            </th>
          </tr>
          <tr>
            <th className="border border-black bg-[#deeaf6] px-1 py-1 text-center align-middle text-[9pt] font-bold">
              Toro
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 py-1 text-center align-middle text-[9pt] font-bold">
              Novilla
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 py-1 text-center align-middle text-[9pt] font-bold">
              Vaca
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 py-1 text-center align-middle text-[9pt] font-bold">
              Ternero/a
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 py-1 text-center align-middle text-[9pt] font-bold">
              Torete
            </th>
          </tr>
          {animales.map((animal, indice) => (
            <tr key={animal.id}>
              <td className="border border-black px-1 py-1 text-center align-middle">
                {indice + 1}
              </td>
              <td className="border border-black px-1 py-1 text-center align-middle">
                {animal.nombre}
              </td>
              {CATEGORIAS_BOVINAS.map((categoria) => (
                <td
                  key={categoria}
                  className="border border-black px-1 py-1 text-center align-middle"
                >
                  {mostrarCantidad(cantidadPorCategoria(animal, categoria))}
                </td>
              ))}
              <td className="border border-black px-1 py-1 text-center align-middle">
                {animal.raza}
              </td>
              <td className="border border-black px-1 py-1 text-left align-middle">
                {observacionInventario(animal)}
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan={2}
              className="border border-black bg-[#ffff99] px-1 py-1 text-center align-middle text-[10pt] font-bold"
            >
              TOTALES
            </td>
            {CATEGORIAS_BOVINAS.map((categoria) => (
              <td
                key={categoria}
                className="border border-black bg-[#ffff99] px-1 py-1 text-center align-middle font-bold"
              >
                {mostrarCantidad(totales[categoria])}
              </td>
            ))}
            <td className="border border-black bg-[#ffff99]" />
            <td className="border border-black bg-[#ffff99]" />
          </tr>
          <tr>
            <td
              colSpan={2}
              className="border border-black px-1 py-1 text-center align-middle font-bold"
            >
              Total General
            </td>
            <td
              colSpan={7}
              className="border border-black px-1 py-1 text-center align-middle font-bold"
            >
              {totalGeneral}
            </td>
          </tr>
          <FirmasInventarioMep
            colSpan={9}
            pie={pie}
            onPieChange={onPieChange}
          />
        </tbody>
      </table>
    </article>
  );
}
