import Image from "next/image";

export function LandingFooter() {
  return (
    <footer className="border-t border-[#252624]/10 bg-[#F7F5F0]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/escudo-ctp27.png"
            alt="Escudo CTP 27 de Abril"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <div>
            <p className="text-sm font-semibold text-[#252624]">Gestión CTP 27</p>
            <p className="text-xs text-[#252624]/50">
              Colegio Técnico Profesional 27 de Abril
            </p>
          </div>
        </div>

        <p className="max-w-md text-sm leading-relaxed text-[#252624]/55">
          Plataforma institucional para la gestión de los procesos agrícolas,
          pecuarios, de inventario y administrativos del colegio.
        </p>
      </div>

      <div className="border-t border-[#252624]/10 px-5 py-5 sm:px-8">
        <p className="text-xs text-[#252624]/40">
          © {new Date().getFullYear()} Gestión CTP 27. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
