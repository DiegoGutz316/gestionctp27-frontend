const INDICADORES = [
  { numero: "05", texto: "Áreas de gestión centralizadas en una sola plataforma" },
  { numero: "01", texto: "Sistema de acceso según roles y permisos institucionales" },
  { numero: "24/7", texto: "Información disponible para el seguimiento continuo de procesos" },
];

const BLOQUES = [
  {
    titulo: "Centralización de la información",
    texto:
      "Los datos agrícolas, pecuarios, de inventario y administrativos conviven en un mismo lugar, sin dispersión entre planillas y registros aislados.",
  },
  {
    titulo: "Seguimiento de procesos",
    texto:
      "Cada actividad productiva queda registrada y trazable, desde la siembra o el ingreso de un lote hasta la elaboración de reportes.",
  },
  {
    titulo: "Acceso según roles",
    texto:
      "Docentes, encargados de área y administración cuentan con vistas y permisos adaptados a su responsabilidad dentro del colegio.",
  },
];

export function LandingBeneficios() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-[#896A78]">
              Qué centraliza
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#252624] sm:text-4xl">
              Todo lo que sostiene la operación diaria del colegio
            </h2>

            <dl className="mt-12 space-y-8">
              {INDICADORES.map((item) => (
                <div key={item.texto} className="flex gap-5 border-t border-[#252624]/10 pt-5">
                  <dt className="w-16 shrink-0 text-2xl font-semibold text-[#C7A35D]">
                    {item.numero}
                  </dt>
                  <dd className="text-sm leading-relaxed text-[#252624]/65">{item.texto}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-10">
            {BLOQUES.map((bloque) => (
              <div key={bloque.titulo} className="flex gap-5">
                <span className="mt-1.5 h-px w-8 shrink-0 bg-[#252624]/25" />
                <div>
                  <h3 className="text-lg font-medium text-[#252624]">{bloque.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#252624]/60">{bloque.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
