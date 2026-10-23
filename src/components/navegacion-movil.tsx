"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  Home,
  Leaf,
  LogOut,
  Megaphone,
  Menu,
  Sprout,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { SelectorTema } from "@/components/selector-tema";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/context/auth-context";
import type { ModuloSistema } from "@/features/auth/models/permisos.model";
import { cn } from "@/lib/utils";

type Destino = {
  title: string;
  href: string;
  icon: typeof Home;
  modulo: ModuloSistema;
};

const principales: Destino[] = [
  { title: "Inicio", href: "/dashboard", icon: Home, modulo: "PANEL" },
  { title: "Inventario", href: "/dashboard/inventario", icon: Boxes, modulo: "INVENTARIO" },
  { title: "Agrícola", href: "/dashboard/agricola", icon: Sprout, modulo: "AGRICOLA" },
  { title: "Pecuaria", href: "/dashboard/pecuaria", icon: Leaf, modulo: "PECUARIA" },
];

const resto: Destino[] = [
  { title: "Libro de caja", href: "/dashboard/libro-caja", icon: Wallet, modulo: "LIBRO_CAJA" },
  { title: "Avisos", href: "/dashboard/comunicacion/avisos", icon: Megaphone, modulo: "REPORTES" },
  { title: "Usuarios", href: "/dashboard/usuarios", icon: Users, modulo: "USUARIOS" },
];

function rutaActiva(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavegacionMovil() {
  const pathname = usePathname();
  const router = useRouter();
  const { puede, logout } = useAuth();
  const [masAbierto, setMasAbierto] = useState(false);

  const visibles = principales.filter((item) => puede(item.modulo));
  const extras = resto.filter((item) => puede(item.modulo));
  const enExtra = extras.some((item) => rutaActiva(pathname, item.href));

  async function cerrarSesion() {
    try {
      await logout();
      router.replace("/login");
    } catch {
      toast.error("No se pudo cerrar la sesión.");
    }
  }

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-3 z-40 flex items-stretch justify-around rounded-2xl border bg-background/95 px-1 py-1 shadow-[0_10px_30px_rgba(27,39,29,0.12)] backdrop-blur md:hidden print:hidden"
        style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        {visibles.map((item) => {
          const activo = rutaActiva(pathname, item.href);
          const Icono = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activo ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium",
                activo ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icono className="size-5" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}

        <button
          type="button"
          aria-expanded={masAbierto}
          onClick={() => setMasAbierto(true)}
          className={cn(
            "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium",
            enExtra || masAbierto ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Menu className="size-5" />
          <span>Más</span>
        </button>
      </nav>

      <Sheet open={masAbierto} onOpenChange={setMasAbierto}>
        <SheetContent side="bottom" className="rounded-t-2xl md:hidden">
          <SheetHeader>
            <SheetTitle>Más módulos</SheetTitle>
            <SheetDescription>El resto del sistema, sin ocupar la pantalla.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-1 px-3 pb-2">
            {extras.map((item) => {
              const Icono = item.icon;
              const activo = rutaActiva(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMasAbierto(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm",
                    activo ? "bg-muted font-medium text-primary" : "text-foreground",
                  )}
                >
                  <Icono className="size-5 text-muted-foreground" />
                  {item.title}
                </Link>
              );
            })}
            <div className="flex items-center justify-between rounded-xl px-3 py-2">
              <span className="text-sm">Apariencia</span>
              <SelectorTema />
            </div>
            <Button
              type="button"
              variant="ghost"
              className="justify-start px-3 text-destructive hover:text-destructive"
              onClick={() => void cerrarSesion()}
            >
              <LogOut />
              Cerrar sesión
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
