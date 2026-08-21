import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingCta() {
  return (
    <section className="bg-[#F7F5F0] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#252624]/10 bg-white px-8 py-14 text-center sm:px-16 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#C7A35D]/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#896A78]/10 blur-3xl"
          />

          <h2 className="relative text-2xl font-semibold tracking-tight text-[#252624] sm:text-3xl">
            Todo el control institucional, en un mismo sistema.
          </h2>

          <Link
            href="/login"
            className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-[#252624] px-7 py-3.5 text-sm font-medium text-[#F7F5F0] transition-colors hover:bg-[#3a3c37]"
          >
            Ingresar a Gestión CTP 27
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
