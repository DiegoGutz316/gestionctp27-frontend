"use client";

import Image from "next/image";
import Link from "next/link";
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
        <Link href="/dashboard" className="text-primary underline-offset-4 hover:underline">
          Ir al panel
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <div className="relative hidden w-[58%] shrink-0 overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-linear-to-br from-[#2a2603] via-[#3d3808] to-[#1a1802]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.12),transparent_42%)]" />
        <div className="absolute inset-0 bg-linear-to-t from-[#2a2603] via-[#2a2603]/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 select-none p-12 pb-14">
          <p className="mb-3 text-[10px] font-bold tracking-[0.35em] text-white uppercase">
            Panel Administrativo
          </p>
          <Image
            src="/escudo-ctp27.png"
            alt="Escudo CTP 27 de Abril"
            width={96}
            height={96}
            className="size-24 object-contain"
            priority
          />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
            Gestión CTP 27
          </h1>
          <p className="mt-2 max-w-sm text-sm text-white/75">
            Sistema de gestión del Colegio Técnico Profesional 27 de Abril.
          </p>
          <div className="mt-5 h-[2px] w-14 bg-white/80" />
        </div>
      </div>

      <div className="hidden w-px shrink-0 bg-linear-to-b from-transparent via-[#2a2603]/25 to-transparent lg:block" />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="mb-2 px-8 pt-10 lg:hidden">
          <p className="mb-1 text-[10px] font-bold tracking-[0.35em] uppercase">
            Panel Administrativo
          </p>
          <div className="flex items-center gap-3">
            <Image
              src="/escudo-ctp27.png"
              alt="Escudo CTP 27 de Abril"
              width={56}
              height={56}
              className="size-14 object-contain"
              priority
            />
            <span className="text-lg font-semibold tracking-tight">
              Gestión CTP 27
            </span>
          </div>
        </div>

        <main className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-[360px]">
            <div className="mb-8">
              <h2 className="text-xl font-semibold tracking-tight">
                Iniciar sesión
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ingrese sus credenciales para continuar
              </p>
            </div>
            <LoginForm />
          </div>
        </main>

        <p className="py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Gestión CTP 27. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
