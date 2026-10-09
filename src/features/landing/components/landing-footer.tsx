import Image from "next/image";
import { Clock, Link2, Mail, MapPin, Phone } from "lucide-react";

const FACEBOOK_URL = "https://www.facebook.com/abril.c.santacruz/?locale=es_LA";
const MAPS_URL = "https://maps.app.goo.gl/aNgqKiZekCDtEGKJA";

export function LandingFooter() {
  return (
    <footer id="footer-contacto" className="border-t border-tinta/10 bg-crema">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/escudo-ctp27.png"
              alt="Escudo CTP 27 de Abril"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <div>
              <p className="text-sm font-semibold text-tinta">
                Colegio Técnico Profesional 27 de Abril
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-tinta/65">
            Educación técnica al servicio de nuestra comunidad, en Veintisiete
            de Abril, Santa Cruz, Guanacaste.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-malva">
            Contacto
          </p>
          <ul className="mt-4 space-y-3 text-sm text-tinta/65">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-oliva" />
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-tinta"
              >
                Veintisiete de Abril, Santa Cruz, Guanacaste
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-oliva" />
              <a href="tel:+50626580054" className="hover:text-tinta">
                +506 2658-0054
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-oliva" />
              <a href="mailto:ctp.27deabril@mep.go.cr" className="hover:text-tinta">
                ctp.27deabril@mep.go.cr
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Link2 className="h-4 w-4 shrink-0 text-oliva" />
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-tinta"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-malva">
            Horario de atención
          </p>
          <ul className="mt-4 space-y-3 text-sm text-tinta/65">
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-oliva" />
              <span>Lunes a viernes: 7:00 a. m. – 5:00 p. m.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-tinta/10 px-5 py-5 sm:px-8">
        <p className="text-xs text-tinta/40">
          © {new Date().getFullYear()} Colegio Técnico Profesional 27 de Abril. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
