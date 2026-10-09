import { Boxes, FileBarChart, Leaf, PawPrint, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Modulo = {
  icono: LucideIcon;
  nombre: string;
  descripcion: string;
  acento: string;
  className: string;
};

const MODULOS: Modulo[] = [
  {
    icono: Leaf,
    nombre: "Gestión agrícola",
    descripcion:
      "Seguimiento de cultivos, siembras y cosechas de los lotes productivos del colegio.",
    acento: "#52634D",
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    icono: PawPrint,
    nombre: "Gestión pecuaria",
    descripcion: "Control de animales, lotes y registros sanitarios.",
    acento: "#C76F57",
    className: "lg:col-span-2",
  },
  {
    icono: Boxes,
    nombre: "Inventario e insumos",
    descripcion: "Existencias, entradas y salidas de insumos agrícolas y pecuarios.",
    acento: "#C7A35D",
    className: "",
  },
  {
    icono: FileBarChart,
    nombre: "Reportes y comunicación",
    descripcion: "Información consolidada para la toma de decisiones.",
    acento: "#896A78",
    className: "",
  },
  {
    icono: Users,
    nombre: "Administración de usuarios",
    descripcion: "Roles y permisos para cada área del sistema.",
    acento: "#252624",
    className: "lg:col-span-2",
  },
];

export function LandingModulos() {
  return (
    <section id="modulos" className="bg-crema py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-widest text-malva">
            Módulos
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-tinta sm:text-4xl">
            Un sistema, todas las áreas productivas
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {MODULOS.map((modulo) => (
            <div
              key={modulo.nombre}
              className={`group relative overflow-hidden rounded-2xl border border-tinta/10 bg-tarjeta p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-25px_rgba(37,38,36,0.25)] ${modulo.className}`}
            >
              <div
                aria-hidden
                className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.07] transition-opacity group-hover:opacity-[0.12]"
                style={{ backgroundColor: modulo.acento }}
              />
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${modulo.acento}1A` }}
              >
                <modulo.icono className="h-5 w-5" style={{ color: modulo.acento }} />
              </div>
              <h3 className="mt-5 text-lg font-medium text-tinta">{modulo.nombre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta/60">
                {modulo.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
