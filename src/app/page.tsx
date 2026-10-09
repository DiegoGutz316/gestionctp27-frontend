import { LandingHeader } from "@/features/landing/components/landing-header";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingStats } from "@/features/landing/components/landing-stats";
import { LandingNosotros } from "@/features/landing/components/landing-nosotros";
import { LandingEspecialidades } from "@/features/landing/components/landing-especialidades";
import { LandingIdentidad } from "@/features/landing/components/landing-identidad";
import { LandingCalendario } from "@/features/landing/components/landing-calendario";
import { LandingFooter } from "@/features/landing/components/landing-footer";

export default function LandingPage() {
  return (
    <div className="landing-clara flex min-h-svh flex-col overflow-x-clip bg-landing">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingNosotros />
        <LandingEspecialidades />
        <LandingCalendario />
        <LandingIdentidad />
      </main>
      <LandingFooter />
    </div>
  );
}
