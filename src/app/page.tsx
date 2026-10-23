import { LandingHeader } from "@/features/landing/components/landing-header";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingStats } from "@/features/landing/components/landing-stats";
import { LandingNosotros } from "@/features/landing/components/landing-nosotros";
import { LandingEspecialidades } from "@/features/landing/components/landing-especialidades";
import { LandingProposito } from "@/features/landing/components/landing-proposito";
import { LandingCalendario } from "@/features/landing/components/landing-calendario";
import { LandingIdentidad } from "@/features/landing/components/landing-identidad";
import { LandingFooter } from "@/features/landing/components/landing-footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip bg-landing text-tinta">
      <a
        href="#contenido"
        className="sr-only rounded-full bg-oliva px-5 py-2.5 text-sm font-medium text-sobre-oliva focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva/40 focus-visible:ring-offset-2 focus-visible:ring-offset-landing"
      >
        Saltar al contenido principal
      </a>
      <LandingHeader />
      <main id="contenido" tabIndex={-1} className="focus:outline-none">
        <LandingHero />
        <LandingStats />
        <LandingNosotros />
        <LandingEspecialidades />
        <LandingProposito />
        <LandingCalendario />
        <LandingIdentidad />
      </main>
      <LandingFooter />
    </div>
  );
}
