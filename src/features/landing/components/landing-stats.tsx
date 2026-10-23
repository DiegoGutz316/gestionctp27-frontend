import { History, Layers, MapPin, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  ANIOS_TRAYECTORIA,
  ESPECIALIDADES,
  ESTUDIANTES_APROX,
} from "../datos-institucionales";

const DATOS: { icono: LucideIcon; numero: string; texto: string }[] = [
  { icono: History, numero: ANIOS_TRAYECTORIA, texto: "años formando jóvenes" },
  { icono: Users, numero: ESTUDIANTES_APROX, texto: "estudiantes aproximadamente" },
  { icono: Layers, numero: String(ESPECIALIDADES.length), texto: "especialidades técnicas" },
  { icono: MapPin, numero: "Santa Cruz", texto: "Veintisiete de Abril, Guanacaste" },
];

export function LandingStats() {
  return (
    <section aria-labelledby="datos-titulo" className="relative z-20 bg-landing">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-2 sm:px-8 sm:pb-20">
        <h2 id="datos-titulo" className="sr-only">
          Datos institucionales
        </h2>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {DATOS.map((dato) => (
            <li
              key={dato.texto}
              className="group flex items-center gap-4 rounded-2xl border border-tinta/8 bg-tarjeta px-5 py-5 shadow-[0_10px_30px_-18px_rgba(37,38,36,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-18px_rgba(37,38,36,0.3)] sm:px-6"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-oliva/10 text-oliva transition-colors group-hover:bg-oliva/15">
                <dato.icono className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="truncate ampliada:overflow-visible ampliada:whitespace-normal text-xl font-semibold tracking-tight text-oliva sm:text-2xl">
                  {dato.numero}
                </p>
                <p className="mt-0.5 text-sm leading-snug text-tinta/60">{dato.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
