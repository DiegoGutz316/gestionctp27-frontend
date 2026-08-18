"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Boxes,
  ChevronRight,
  ChevronsUpDown,
  CircleUserRound,
  LayoutDashboard,
  Leaf,
  LogOut,
  Settings,
  Sprout,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/features/auth/context/auth-context"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

/**
 * Backlog 1.6 - Task: "Ocultar opciones del menu segun el rol del usuario".
 * Cada entrada declara el modulo que la habilita; el menu se filtra con la
 * matriz de permisos de la sesion (GET /auth/permisos).
 */
const navigation = [
  {
    label: "General",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        modulo: "PANEL" as const,
      },
    ],
  },
  {
    label: "Gestión",
    items: [
      {
        title: "Inventario",
        href: "/dashboard/inventario",
        icon: Boxes,
        modulo: "INVENTARIO" as const,
      },
      {
        title: "Área agrícola",
        href: "/dashboard/agricola",
        icon: Sprout,
        modulo: "AGRICOLA" as const,
      },
      {
        title: "Área pecuaria",
        href: "/dashboard/pecuaria",
        icon: Leaf,
        modulo: "PECUARIA" as const,
      },
    ],
  },
  {
    label: "Análisis",
    items: [
      {
        title: "Reportes",
        href: "/dashboard/reportes",
        icon: BarChart3,
        modulo: "REPORTES" as const,
      },
    ],
  },
  {
    label: "Administración",
    items: [
      {
        title: "Usuarios",
        href: "/dashboard/usuarios",
        icon: Users,
        modulo: "USUARIOS" as const,
      },
    ],
  },
]

function isRouteActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("")
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { usuario, logout, puede } = useAuth()

  const nombre = usuario?.nombre ?? "Usuario"
  const correo = usuario?.correo ?? ""
  const avatar = iniciales(nombre)

  // Backlog 1.6: solo quedan las opciones permitidas por el rol; las secciones
  // que se vacian dejan de renderizarse.
  const navegacionPermitida = useMemo(() => {
    type ItemNavegacion = (typeof navigation)[number]["items"][number]
    const secciones: { label: string; items: ItemNavegacion[] }[] = []

    for (const section of navigation) {
      const items: ItemNavegacion[] = []
      for (const item of section.items) {
        if (puede(item.modulo)) items.push(item)
      }
      if (items.length > 0) {
        secciones.push({ ...section, items })
      }
    }

    return secciones
  }, [puede])

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        navigation.map((section) => [
          section.label,
          section.label === "General" ||
            section.items.some((item) => isRouteActive(pathname, item.href)),
        ]),
      ),
  )

  async function handleLogout() {
    try {
      await logout()
      router.replace("/login")
    } catch {
      toast.error("No se pudo cerrar la sesión.")
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/dashboard" />}
              tooltip="Gestión CTP 27"
              className="group-data-[collapsible=icon]:p-0!"
            >
              <span className="flex aspect-square size-9 items-center justify-center overflow-hidden">
                <Image
                  src="/escudo-ctp27.png"
                  alt="Logo Colegio Técnico Profesional 27 de Abril"
                  width={36}
                  height={36}
                  className="size-10 max-w-none object-contain"
                />
              </span>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold">
                  Gestión CTP 27
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Panel administrativo
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {navegacionPermitida.map((section) => {
          return (
            <Collapsible
              key={section.label}
              open={
                (openSections[section.label] ?? false) ||
                section.items.some((item) =>
                  isRouteActive(pathname, item.href),
                )
              }
              onOpenChange={(open) =>
                setOpenSections((prev) => ({
                  ...prev,
                  [section.label]: open,
                }))
              }
              className="group/collapsible"
            >
              <SidebarGroup className="py-1">
                <SidebarGroupLabel
                  render={<CollapsibleTrigger />}
                  className="group/label h-6 w-full cursor-pointer hover:text-sidebar-foreground"
                >
                  {section.label}
                  <ChevronRight className="ml-auto size-3.5 transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="gap-0.5">
                      {section.items.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            render={<Link href={item.href} />}
                            isActive={isRouteActive(pathname, item.href)}
                            tooltip={item.title}
                          >
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          )
        })}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                    {avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{nombre}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {correo}
                  </span>
                </span>
                <ChevronsUpDown className="ml-auto size-4 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--anchor-width) min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-2 px-1 py-1 text-left text-sm">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          {avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 leading-tight">
                        <span className="truncate font-medium">{nombre}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {correo}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CircleUserRound />
                  Mi perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
