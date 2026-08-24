const DATOS = [
  { numero: "50+", texto: "años de trayectoria" },
  { numero: "630", texto: "estudiantes aprox." },
  { numero: "5", texto: "especialidades técnicas" },
  { numero: "Guanacaste", texto: "Veintisiete de Abril, Santa Cruz" },
];

export function LandingStats() {
  return (
    <section className="border-y border-[#252624]/10 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-0">
          {DATOS.map((dato, i) => (
            <div
              key={dato.texto}
              className={`text-center sm:text-left ${
                i > 0 ? "sm:border-l sm:border-[#252624]/10 sm:pl-6" : ""
              }`}
            >
              <p className="text-2xl font-semibold tracking-tight text-[#52634D] sm:text-3xl">
                {dato.numero}
              </p>
              <p className="mt-1 text-xs leading-snug text-[#252624]/60 sm:text-sm">
                {dato.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
