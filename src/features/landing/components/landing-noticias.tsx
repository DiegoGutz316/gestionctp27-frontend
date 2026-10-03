const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type AvisoPublico = {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  tieneFlyer: boolean;
};

function formatearFecha(valor: string): string {
  const [anio, mes, dia] = valor.slice(0, 10).split("-").map(Number);
  if (!anio || !mes || !dia) return valor;

  return new Date(anio, mes - 1, dia).toLocaleDateString("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function cargarAvisos(): Promise<AvisoPublico[]> {
  try {
    const respuesta = await fetch(
      `${API_URL}/comunicacion/avisos/publicos?limite=12`,
      { cache: "no-store" },
    );

    if (!respuesta.ok) return [];

    const cuerpo = (await respuesta.json()) as { datos?: AvisoPublico[] };
    return cuerpo.datos ?? [];
  } catch {
    return [];
  }
}

export async function LandingNoticias() {
  const avisos = await cargarAvisos();

  return (
    <section id="avisos" className="bg-[#F7F5F0] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-widest text-[#896A78]">
            Familias
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#252624] sm:text-4xl">
            Avisos institucionales
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#252624]/50">
            Comunicados y actividades del colegio para madres, padres y
            encargados.
          </p>
        </div>

        {avisos.length === 0 ? (
          <p className="mt-12 text-sm text-[#252624]/55">
            No hay avisos publicados en este momento.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {avisos.map((aviso) => (
              <article
                key={aviso.id}
                className="overflow-hidden rounded-2xl border border-[#252624]/10 bg-white"
              >
                {aviso.tieneFlyer ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${API_URL}/comunicacion/avisos/${aviso.id}/flyer`}
                    alt={`Flyer de ${aviso.titulo}`}
                    className="max-h-96 w-full bg-[#F7F5F0] object-contain"
                  />
                ) : null}
                <div className="p-6">
                <time
                  dateTime={aviso.fecha}
                  className="text-xs font-medium uppercase tracking-widest text-[#C7A35D]"
                >
                  {formatearFecha(aviso.fecha)}
                </time>
                <h3 className="mt-2 text-lg font-medium text-[#252624]">
                  {aviso.titulo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-[#252624]/70">
                  {aviso.descripcion}
                </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
