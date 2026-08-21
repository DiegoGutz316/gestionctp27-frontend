"use client";

import Image from "next/image";
import Link from "next/link";
import { Boxes, Leaf, Sprout } from "lucide-react";
import { LoginForm } from "@/features/auth/components/login-form";
import { useAuth } from "@/features/auth/context/auth-context";

export default function LoginPage() {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Cargando…
      </div>
    );
  }

  if (usuario) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
        <p>Ya hay una sesión activa.</p>
        <Link
          href="/dashboard"
          className="text-primary underline-offset-4 hover:underline"
        >
          Ir al panel
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh bg-[#f8f9f6]">
      {/* Panel izquierdo */}
      <div className="relative hidden min-h-svh w-[56%] overflow-hidden lg:flex">
        {/* Fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(132,154,92,0.14),transparent_30%),linear-gradient(135deg,#233126_0%,#1f2c24_45%,#1a241f_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(194,214,198,0.08),transparent_22%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(132,154,92,0.08),transparent_24%)]" />

        <div className="relative z-10 flex w-full flex-col px-16 py-14 text-white">
          {/* Branding superior */}
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full border border-white/15 bg-white/90 shadow-lg shadow-black/10">
              <Image
                src="/escudo-ctp27.png"
                alt="Escudo CTP 27 de Abril"
                width={48}
                height={48}
                className="size-12 object-contain"
                priority
              />
            </div>

            <div>
              <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.03em] text-white">
                Gestión CTP 27
              </h1>
              <p className="mt-1 text-sm text-white/58">
                Colegio Técnico Profesional 27 de Abril
              </p>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="my-auto max-w-xl py-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
              <span className="size-1.5 rounded-full bg-[#a8c28b]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                Plataforma institucional
              </span>
            </div>

            <h2 className="mt-10 text-[54px] font-semibold leading-[1.02] tracking-[-0.055em] text-white">
              Panel administrativo
            </h2>

            <p className="mt-3 text-[1.7rem] font-medium tracking-[-0.04em] text-white/58">
              Gestión institucional centralizada
            </p>

            <p className="mt-8 max-w-xl text-[15px] leading-8 text-white/60">
              Administre de forma sencilla los procesos agrícolas, pecuarios,
              inventario, reportes y usuarios desde un solo lugar.
            </p>

            <div className="my-10 h-px max-w-xl bg-linear-to-r from-white/15 via-white/[0.08] to-transparent" />

            <div className="grid max-w-xl grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#879f5c]/15 text-[#aec587]">
                  <Boxes className="size-4" />
                </div>
                <p className="mt-4 text-sm font-medium text-white/85">
                  Inventario
                </p>
                <p className="mt-1 text-[11px] leading-4 text-white/35">
                  Recursos e insumos
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#7f9d86]/15 text-[#a4bba8]">
                  <Sprout className="size-4" />
                </div>
                <p className="mt-4 text-sm font-medium text-white/85">
                  Agrícola
                </p>
                <p className="mt-1 text-[11px] leading-4 text-white/35">
                  Cultivos y cosechas
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#9bb28e]/15 text-[#bfd2b2]">
                  <Leaf className="size-4" />
                </div>
                <p className="mt-4 text-sm font-medium text-white/85">
                  Pecuaria
                </p>
                <p className="mt-1 text-[11px] leading-4 text-white/35">
                  Control y producción
                </p>
              </div>
            </div>
          </div>

          {/* Footer izquierdo */}
          <div className="pt-6 text-xs text-white/35">
            © {new Date().getFullYear()} Panel administrativo
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <div className="rounded-[2rem] border border-border/70 bg-white/92 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-10">
            {/* Header móvil */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex size-12 items-center justify-center rounded-full border border-border bg-white shadow-sm">
                <Image
                  src="/escudo-ctp27.png"
                  alt="Escudo CTP 27 de Abril"
                  width={34}
                  height={34}
                  className="size-8 object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-base font-semibold leading-none text-foreground">
                  Gestión CTP 27
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  Panel administrativo
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-3 inline-flex items-center rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                Acceso al sistema
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                Iniciar sesión
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Ingrese sus credenciales para acceder al panel administrativo.
              </p>
            </div>

            <LoginForm />

            <div className="mt-8 border-t border-border/60 pt-5">
              <p className="text-center text-xs leading-5 text-muted-foreground">
                Acceso exclusivo para personal autorizado del sistema.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Gestión CTP 27. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </div>
  );
}