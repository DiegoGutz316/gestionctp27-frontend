import { LandingHeader } from "@/features/landing/components/landing-header";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingStats } from "@/features/landing/components/landing-stats";
import { LandingNosotros } from "@/features/landing/components/landing-nosotros";
import { LandingEspecialidades } from "@/features/landing/components/landing-especialidades";
import { LandingProposito } from "@/features/landing/components/landing-proposito";
import { LandingCalendario } from "@/features/landing/components/landing-calendario";
import { LandingGaleria } from "@/features/landing/components/landing-galeria";
import { LandingIdentidad } from "@/features/landing/components/landing-identidad";
import { LandingFooter } from "@/features/landing/components/landing-footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip bg-landing text-tinta">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingNosotros />
        <LandingEspecialidades />
        <LandingProposito />
        <LandingCalendario />
        <LandingGaleria />
        <LandingIdentidad />
      </main>
      <LandingFooter />
    </div>
  );
}
