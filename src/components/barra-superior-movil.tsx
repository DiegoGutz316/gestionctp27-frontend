"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/context/auth-context";

function iniciales(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

export function BarraSuperiorMovil() {
  const router = useRouter();
  const { usuario, logout } = useAuth();
  const nombre = usuario?.nombre ?? "Usuario";
  const avatar = iniciales(nombre) || "U";

  async function cerrarSesion() {
    try {
      await logout();
      router.replace("/login");
    } catch {
      toast.error("No se pudo cerrar la sesión.");
    }
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 md:hidden print:hidden">
      <Link
        href="/dashboard"
        aria-label="Ir al inicio"
        className="flex size-10 items-center justify-center overflow-hidden rounded-xl border bg-white dark:bg-card"
      >
        <Image
          src="/escudo-ctp27.png"
          alt="Escudo del Colegio Técnico Profesional 27 de Abril"
          width={36}
          height={36}
          className="size-8 object-contain"
        />
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Mi perfil"
          className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
        >
          {avatar}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-56">
          <DropdownMenuLabel className="font-normal">
            <span className="block truncate font-semibold">{nombre}</span>
            {usuario?.correo ? (
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {usuario.correo}
              </span>
            ) : null}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => void cerrarSesion()}>
            <LogOut />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
