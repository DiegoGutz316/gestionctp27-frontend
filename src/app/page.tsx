import { LandingHeader } from "@/features/landing/components/landing-header";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingStats } from "@/features/landing/components/landing-stats";
import { LandingNosotros } from "@/features/landing/components/landing-nosotros";
import { LandingEspecialidades } from "@/features/landing/components/landing-especialidades";
import { LandingIdentidad } from "@/features/landing/components/landing-identidad";
import { LandingNoticias } from "@/features/landing/components/landing-noticias";
import { LandingFooter } from "@/features/landing/components/landing-footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-[var(--landing-background)]">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingNosotros />
        <LandingEspecialidades />
        <LandingNoticias />
        <LandingIdentidad />
      </main>
      <LandingFooter />
    </div>
  );
}
