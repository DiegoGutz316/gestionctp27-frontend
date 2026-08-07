"use client"

import { useEffect, useState } from "react"
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

const navigation = [
  {
    label: "General",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
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
      },
      {
        title: "Área agrícola",
        href: "/dashboard/agricola",
        icon: Sprout,
      },
      {
        title: "Área pecuaria",
        href: "/dashboard/pecuaria",
        icon: Leaf,
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
  const { usuario, logout } = useAuth()

  const nombre = usuario?.nombre ?? "Usuario"
  const correo = usuario?.correo ?? ""
  const avatar = iniciales(nombre)

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

  useEffect(() => {
    setOpenSections((prev) => {
      let changed = false
      const next = { ...prev }

      for (const section of navigation) {
        const active = section.items.some((item) =>
          isRouteActive(pathname, item.href),
        )
        if (active && !next[section.label]) {
          next[section.label] = true
          changed = true
        }
      }

      return changed ? next : prev
    })
  }, [pathname])

  async function handleLogout() {
    try {
      await logout()
      router.replace("/login")
    } catch {
      toast.error("No se pudo cerrar la sesión.")
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      className="font-[family-name:var(--font-roboto)]"
    >
      <SidebarHeader className="px-2 pt-3 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/dashboard" />}
              className="h-11 px-1 hover:bg-transparent data-open:bg-transparent"
            >
              <span className="relative flex aspect-square size-9 shrink-0 overflow-visible">
                <Image
                  src="/escudo-ctp27.png"
                  alt="Logo Colegio Técnico Profesional 27 de Abril"
                  width={36}
                  height={36}
                  className="size-full object-contain"
                />
              </span>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate text-[13px] font-medium">
                  Gestión CTP 27
                </span>
                <span className="truncate text-[10px] text-muted-foreground">
                  Panel administrativo
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((section) => {
          return (
            <Collapsible
              key={section.label}
              open={openSections[section.label] ?? false}
              onOpenChange={(open) =>
                setOpenSections((prev) => ({
                  ...prev,
                  [section.label]: open,
                }))
              }
              className="group/collapsible"
            >
              <SidebarGroup className="py-0">
                <SidebarGroupLabel
                  render={<CollapsibleTrigger />}
                  className="h-8 w-full cursor-pointer px-2 text-[11px] font-normal text-sidebar-foreground hover:bg-transparent"
                >
                  <span>{section.label}</span>
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
                            className="h-8 rounded-md px-2 text-[12px] font-normal data-active:font-normal"
                          >
                            <item.icon strokeWidth={1.75} />
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

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="h-11 text-[12px] data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{avatar}</AvatarFallback>
                </Avatar>
                <span className="grid flex-1 text-left text-[12px] leading-tight">
                  <span className="truncate font-medium">{nombre}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {correo}
                  </span>
                </span>
                <ChevronsUpDown className="ml-auto size-4" />
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
