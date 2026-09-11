"use client";

import {
  formatearEdadAnios,
  type AnimalRespuesta,
} from "@/features/pecuaria/animal/models/animal.model";

import {
  observacionInventario,
  type PieInventarioMep,
} from "../models/inventario.model";
import {
  EncabezadoInventarioMep,
  FirmasInventarioMep,
} from "./inventario-mep";

export function InventarioEspeciesMenores({
  animales,
  pie,
  onPieChange,
}: {
  animales: AnimalRespuesta[];
  pie: PieInventarioMep;
  onPieChange: (pie: PieInventarioMep) => void;
}) {
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
          <col style={{ width: "10%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "28%" }} />
        </colgroup>
        <tbody>
          <EncabezadoInventarioMep
            colSpan={5}
            titulo="Inventario Especies Menores"
            pie={pie}
            onPieChange={onPieChange}
          />
          <tr>
            <th className="border border-black bg-[#deeaf6] px-1 py-2 text-center align-middle text-[10pt] font-bold">
              Asiento
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 py-2 text-center align-middle text-[10pt] font-bold">
              Identificación del Animal
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 py-2 text-center align-middle text-[10pt] font-bold">
              Edad (años)
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 py-2 text-center align-middle text-[10pt] font-bold">
              Raza
            </th>
            <th className="border border-black bg-[#deeaf6] px-1 py-2 text-center align-middle text-[10pt] font-bold">
              Observaciones
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
              <td className="border border-black px-1 py-1 text-center align-middle">
                {formatearEdadAnios(animal.fechaNacimiento)}
              </td>
              <td className="border border-black px-1 py-1 text-center align-middle">
                {animal.raza}
              </td>
              <td className="border border-black px-1 py-1 text-left align-middle">
                {observacionInventario(animal)}
              </td>
            </tr>
          ))}
          <FirmasInventarioMep
            colSpan={5}
            pie={pie}
            onPieChange={onPieChange}
          />
        </tbody>
      </table>
    </article>
  );
}
