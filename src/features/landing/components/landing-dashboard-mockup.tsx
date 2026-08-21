import { Boxes, FileBarChart, Leaf, PawPrint, Users } from "lucide-react";

const SIDEBAR_ITEMS = [
  { icon: Leaf, active: true },
  { icon: PawPrint, active: false },
  { icon: Boxes, active: false },
  { icon: FileBarChart, active: false },
  { icon: Users, active: false },
];

const METRICAS = [
  { label: "Cultivos activos", valor: "18", acento: "#52634D" },
  { label: "Lotes pecuarios", valor: "42", acento: "#C76F57" },
  { label: "Insumos en stock", valor: "312", acento: "#C7A35D" },
];

const ACTIVIDAD = [
  { texto: "Registro de cosecha — Lote 4", tiempo: "Hoy" },
  { texto: "Ingreso de insumos veterinarios", tiempo: "Ayer" },
  { texto: "Reporte mensual generado", tiempo: "Hace 2 días" },
];

export function LandingDashboardMockup() {
  return (
    <div
      aria-hidden
      className="relative w-full max-w-md rounded-3xl border border-[#252624]/10 bg-white p-3 shadow-[0_30px_70px_-25px_rgba(37,38,36,0.35)] sm:max-w-lg"
    >
      <div className="flex overflow-hidden rounded-2xl border border-[#252624]/10">
        {/* Mini sidebar */}
        <div className="flex w-14 flex-col items-center gap-3 bg-[#252624] py-4">
          {SIDEBAR_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                item.active ? "bg-[#C7A35D] text-[#252624]" : "text-[#F7F5F0]/50"
              }`}
            >
              <item.icon className="h-4 w-4" />
            </div>
          ))}
        </div>

        {/* Panel principal */}
        <div className="flex-1 space-y-4 bg-[#F7F5F0] p-4">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-24 rounded-full bg-[#252624]/15" />
            <div className="h-6 w-6 rounded-full bg-[#896A78]/30" />
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-3 gap-2">
            {METRICAS.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-[#252624]/8 bg-white p-2.5"
              >
                <div
                  className="mb-1.5 h-1.5 w-6 rounded-full"
                  style={{ backgroundColor: m.acento }}
                />
                <p className="text-sm font-semibold text-[#252624]">{m.valor}</p>
                <p className="text-[9px] leading-tight text-[#252624]/50">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Gráfica simulada */}
          <div className="rounded-xl border border-[#252624]/8 bg-white p-3">
            <div className="mb-2 h-2 w-20 rounded-full bg-[#252624]/10" />
            <div className="flex h-16 items-end gap-1.5">
              {[40, 65, 50, 80, 60, 90, 55].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${h}%`,
                    backgroundColor: i === 5 ? "#C76F57" : "#52634D33",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Actividad */}
          <div className="space-y-2 rounded-xl border border-[#252624]/8 bg-white p-3">
            {ACTIVIDAD.map((a) => (
              <div key={a.texto} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C7A35D]" />
                  <span className="text-[10px] text-[#252624]/70">{a.texto}</span>
                </div>
                <span className="shrink-0 text-[9px] text-[#252624]/40">{a.tiempo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
