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
    <div className="flex min-h-svh items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-background p-6 shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/escudo-ctp27.png"
            alt="Escudo CTP 27 de Abril"
            width={64}
            height={64}
            className="size-16 object-contain"
            priority
          />
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              Gestión CTP 27
            </h1>
            <p className="text-sm text-muted-foreground">
              Inicie sesión para continuar
            </p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
