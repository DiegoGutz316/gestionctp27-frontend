"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { useAuth } from "@/features/auth/context/auth-context";

export default function LoginPage() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && usuario) {
      router.replace("/dashboard");
    }
  }, [cargando, usuario, router]);

  if (cargando || usuario) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Cargando…
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-background p-6 shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/escudo-ctp27.png"
            alt="Escudo CTP 27 de Abril"
            className="size-16 object-contain"
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
