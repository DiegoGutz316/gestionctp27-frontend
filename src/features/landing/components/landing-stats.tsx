const DATOS = [
  { numero: "50+", texto: "años de trayectoria" },
  { numero: "630", texto: "estudiantes aprox." },
  { numero: "5", texto: "especialidades técnicas" },
  { numero: "Guanacaste", texto: "Veintisiete de Abril, Santa Cruz" },
];

export function LandingStats() {
  return (
    <section className="relative z-20 bg-[var(--landing-background)]">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {DATOS.map((dato) => (
            <div
              key={dato.texto}
              className="rounded-3xl border border-[#252624]/8 bg-white/55 px-5 py-6 shadow-[0_10px_30px_rgba(37,38,36,0.05)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="text-2xl font-semibold tracking-tight text-[#52634D] sm:text-3xl">
                {dato.numero}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#252624]/65">
                {dato.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}