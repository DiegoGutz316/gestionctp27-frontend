import Image from "next/image";
import { Clock, Link2, Mail, MapPin, Phone } from "lucide-react";

const FACEBOOK_URL = "https://www.facebook.com/abril.c.santacruz/?locale=es_LA";
const MAPS_URL = "https://maps.app.goo.gl/aNgqKiZekCDtEGKJA";

const ENLACES = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#especialidades", label: "Especialidades" },
  { href: "#calendario", label: "Calendario" },
  { href: "#contacto", label: "Contacto" },
];

const TITULO_COLUMNA = "text-xs font-semibold uppercase tracking-[0.16em] text-pie-texto/55";
const ENLACE =
  "transition-colors hover:text-pie-texto focus-visible:outline-none focus-visible:underline";

export function LandingFooter() {
  return (
    <footer id="contacto" className="scroll-mt-20 bg-pie text-pie-texto">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.1fr_1fr] lg:gap-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-tarjeta/95 p-1.5 shadow-sm">
              <Image
                src="/escudo-ctp27.png"
                alt="Escudo CTP 27 de Abril"
                width={40}
                height={40}
                className="size-9 object-contain"
              />
            </div>
            <p className="text-sm font-semibold leading-snug">
              Colegio Técnico Profesional 27 de Abril
            </p>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-pie-texto/70">
            Educación técnica al servicio de nuestra comunidad, en Veintisiete
            de Abril, Santa Cruz, Guanacaste.
          </p>
        </div>

        <nav aria-label="Enlaces rápidos">
          <p className={TITULO_COLUMNA}>Enlaces rápidos</p>
          <ul className="mt-5 space-y-3 text-sm text-pie-texto/75">
            {ENLACES.map((enlace) => (
              <li key={enlace.href}>
                <a href={enlace.href} className={ENLACE}>
                  {enlace.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={TITULO_COLUMNA}>Contacto</p>
          <ul className="mt-5 space-y-3.5 text-sm text-pie-texto/75">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-pie-texto/60" aria-hidden />
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={ENLACE}
              >
                Veintisiete de Abril, Santa Cruz, Guanacaste
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-pie-texto/60" aria-hidden />
              <a href="tel:+50626580054" className={ENLACE}>
                +506 2658-0054
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-pie-texto/60" aria-hidden />
              <a href="mailto:ctp.27deabril@mep.go.cr" className={`${ENLACE} break-all`}>
                ctp.27deabril@mep.go.cr
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className={TITULO_COLUMNA}>Horario de atención</p>
          <p className="mt-5 flex items-start gap-3 text-sm text-pie-texto/75">
            <Clock className="mt-0.5 size-4 shrink-0 text-pie-texto/60" aria-hidden />
            <span>Lunes a viernes: 7:00 a. m. – 5:00 p. m.</span>
          </p>

          <p className={`${TITULO_COLUMNA} mt-9`}>Redes sociales</p>
          <ul className="mt-5 space-y-3.5 text-sm text-pie-texto/75">
            <li className="flex items-center gap-3">
              <Link2 className="size-4 shrink-0 text-pie-texto/60" aria-hidden />
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={ENLACE}
              >
                Facebook · CTP 27 de Abril
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-pie-texto/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-pie-texto/55 sm:px-8">
          © {new Date().getFullYear()} Colegio Técnico Profesional 27 de Abril. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
