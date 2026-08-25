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
  Wallet,
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
 * Backlog 1.6
 * Ocultar opciones del menú según los permisos del usuario.
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
        title: "Libro de caja",
        href: "/dashboard/libro-caja",
        icon: Wallet,
        modulo: "LIBRO_CAJA" as const,
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

  const navegacionPermitida = useMemo(() => {
    type ItemNavegacion =
      (typeof navigation)[number]["items"][number]

    const secciones: {
      label: string
      items: ItemNavegacion[]
    }[] = []

    for (const section of navigation) {
      const items: ItemNavegacion[] = []

      for (const item of section.items) {
        if (puede(item.modulo)) {
          items.push(item)
        }
      }

      if (items.length > 0) {
        secciones.push({
          ...section,
          items,
        })
      }
    }

    return secciones
  }, [puede])

  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>(() =>
      Object.fromEntries(
        navigation.map((section) => [
          section.label,

          section.label === "General" ||
            section.items.some((item) =>
              isRouteActive(pathname, item.href),
            ),
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
    <Sidebar
      collapsible="icon"
      className="
        border-r
        border-[#e2e8df]
        bg-[#fafcf9]
      "
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <SidebarHeader className="px-3 pt-4 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/dashboard" />}
              tooltip="Gestión CTP 27"
              className="
                h-auto
                rounded-[18px]
                border
                border-transparent
                px-2
                py-2.5

                transition-all
                duration-200

                hover:border-[#e4e9e1]
                hover:bg-white
                hover:shadow-[0_6px_18px_rgba(39,54,42,0.06)]

                group-data-[collapsible=icon]:p-1!
              "
            >
              {/* Logo */}
              <span
                className="
                  relative
                  flex
                  aspect-square
                  size-11
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[14px]
                  border
                  border-[#dde5d9]
                  bg-white
                  shadow-[0_4px_12px_rgba(34,49,37,0.08)]
                "
              >
                <Image
                  src="/escudo-ctp27.png"
                  alt="Logo Colegio Técnico Profesional 27 de Abril"
                  width={42}
                  height={42}
                  className="
                    size-10
                    max-w-none
                    object-contain
                  "
                />
              </span>

              {/* Marca */}
              <span
                className="
                  grid
                  min-w-0
                  flex-1
                  pl-1.5
                  text-left
                  leading-tight
                "
              >
                <span
                  className="
                    truncate
                    text-[15px]
                    font-semibold
                    tracking-[-0.02em]
                    text-[#263129]
                  "
                >
                  Gestión CTP 27
                </span>

                <span
                  className="
                    mt-1
                    truncate
                    text-[11px]
                    font-medium
                    text-[#899287]
                  "
                >
                  Panel administrativo
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Separador */}
      <div
        className="
          mx-4
          h-px
          bg-linear-to-r
          from-transparent
          via-[#dde4da]
          to-transparent
        "
      />

      {/* =====================================================
          NAVEGACIÓN
          ===================================================== */}

      <SidebarContent className="gap-1 px-2 pt-4">
        {navegacionPermitida.map((section) => (
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
            <SidebarGroup className="py-1.5">
              {/* Título sección */}
              <SidebarGroupLabel
                render={<CollapsibleTrigger />}
                className="
                  group/label
                  mb-1.5
                  h-7
                  w-full
                  cursor-pointer
                  rounded-lg
                  px-2.5

                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#929b8f]

                  transition-all
                  duration-200

                  hover:bg-[#f1f4ef]
                  hover:text-[#5d685b]
                "
              >
                {section.label}

                <ChevronRight
                  className="
                    ml-auto
                    size-3.5
                    opacity-50
                    transition-all
                    duration-200

                    group-data-open/collapsible:rotate-90
                    group-hover/label:opacity-80
                  "
                />
              </SidebarGroupLabel>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1.5">
                    {section.items.map((item) => {
                      const activo = isRouteActive(
                        pathname,
                        item.href,
                      )

                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            render={<Link href={item.href} />}
                            isActive={activo}
                            tooltip={item.title}
                            className="
                              group/menu-item
                              relative
                              h-11
                              overflow-hidden
                              rounded-[14px]
                              border
                              border-transparent
                              px-2.5

                              text-[#626c61]

                              transition-all
                              duration-200

                              hover:border-[#e0e7dd]
                              hover:bg-white
                              hover:text-[#344337]
                              hover:shadow-[0_5px_16px_rgba(40,57,43,0.055)]

                              data-[active=true]:border-[#dce7d6]
                              data-[active=true]:bg-linear-to-r
                              data-[active=true]:from-[#e9f2e4]
                              data-[active=true]:to-[#f4f8f1]
                              data-[active=true]:font-semibold
                              data-[active=true]:text-[#405c39]
                              data-[active=true]:shadow-[0_5px_18px_rgba(76,105,64,0.08)]
                            "
                          >
                            {/* Indicador lateral activo */}
                            {activo ? (
                              <span
                                className="
                                  absolute
                                  top-1/2
                                  left-0
                                  h-5
                                  w-[3px]
                                  -translate-y-1/2
                                  rounded-r-full
                                  bg-[#668b55]
                                "
                              />
                            ) : null}

                            {/* Icono */}
                            <span
                              className={`
                                flex
                                size-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-[10px]

                                transition-all
                                duration-200

                                ${
                                  activo
                                    ? `
                                      bg-[#dce9d5]
                                      text-[#557548]
                                      shadow-[0_3px_8px_rgba(73,102,60,0.08)]
                                    `
                                    : `
                                      bg-[#f3f5f1]
                                      text-[#7d887a]

                                      group-hover/menu-item:bg-[#e9f0e5]
                                      group-hover/menu-item:text-[#56704e]
                                    `
                                }
                              `}
                            >
                              <item.icon className="size-[17px]" />
                            </span>

                            <span className="truncate text-[14px]">
                              {item.title}
                            </span>

                            {/* Punto activo */}
                            {activo ? (
                              <span className="ml-auto size-1.5 rounded-full bg-[#72945f]" />
                            ) : null}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      {/* =====================================================
          USUARIO
          ===================================================== */}

      <SidebarFooter
        className="
          border-t
          border-[#e3e8e0]
          bg-[#f8faf7]
          p-3
        "
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="
                      h-auto
                      rounded-[18px]
                      border
                      border-[#e1e7de]
                      bg-white
                      px-2.5
                      py-2.5

                      shadow-[0_5px_18px_rgba(37,51,40,0.05)]

                      transition-all
                      duration-200

                      hover:border-[#d6e0d2]
                      hover:bg-white
                      hover:shadow-[0_8px_24px_rgba(37,51,40,0.09)]

                      data-open:border-[#cfddca]
                      data-open:bg-white
                      data-open:text-sidebar-accent-foreground
                      data-open:shadow-[0_8px_24px_rgba(37,51,40,0.09)]
                    "
                  />
                }
              >
                {/* Avatar */}
                <Avatar
                  className="
                    size-10
                    rounded-[12px]
                    border
                    border-[#d7e2d3]
                    shadow-sm
                  "
                >
                  <AvatarFallback
                    className="
                      rounded-[12px]
                      bg-linear-to-br
                      from-[#526b4a]
                      to-[#31452f]

                      text-xs
                      font-semibold
                      text-white
                    "
                  >
                    {avatar}
                  </AvatarFallback>
                </Avatar>

                {/* Datos usuario */}
                <span
                  className="
                    grid
                    min-w-0
                    flex-1
                    pl-1
                    text-left
                    text-sm
                    leading-tight
                  "
                >
                  <span
                    className="
                      truncate
                      font-semibold
                      tracking-[-0.01em]
                      text-[#303831]
                    "
                  >
                    {nombre}
                  </span>

                  <span
                    className="
                      mt-1
                      truncate
                      text-[10px]
                      text-[#8b9489]
                    "
                  >
                    {correo}
                  </span>
                </span>

                <span
                  className="
                    flex
                    size-7
                    items-center
                    justify-center
                    rounded-lg
                    text-[#899386]

                    transition
                    hover:bg-[#f1f5ef]
                    hover:text-[#526b4a]
                  "
                >
                  <ChevronsUpDown className="size-3.5" />
                </span>
              </DropdownMenuTrigger>

              {/* =================================================
                  MENÚ USUARIO
                  ================================================= */}

              <DropdownMenuContent
                className="
                  w-(--anchor-width)
                  min-w-64
                  rounded-[18px]
                  border-[#dde5da]
                  bg-white
                  p-2

                  shadow-[0_18px_55px_rgba(27,39,29,0.13)]
                "
                side="top"
                align="start"
                sideOffset={10}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        px-1
                        py-2
                        text-left
                        text-sm
                      "
                    >
                      <Avatar
                        className="
                          size-11
                          rounded-[13px]
                          border
                          border-[#d7e2d3]
                        "
                      >
                        <AvatarFallback
                          className="
                            rounded-[13px]
                            bg-linear-to-br
                            from-[#526b4a]
                            to-[#31452f]

                            font-semibold
                            text-white
                          "
                        >
                          {avatar}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className="
                          grid
                          min-w-0
                          flex-1
                          leading-tight
                        "
                      >
                        <span
                          className="
                            truncate
                            font-semibold
                            text-[#303831]
                          "
                        >
                          {nombre}
                        </span>

                        <span
                          className="
                            mt-1
                            truncate
                            text-xs
                            text-[#879087]
                          "
                        >
                          {correo}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-[#edf0eb]" />

                <DropdownMenuItem
                  className="
                    cursor-pointer
                    rounded-xl
                    px-3
                    py-2.5

                    text-[#505a51]

                    transition-colors

                    hover:bg-[#f1f5ef]!
                    hover:text-[#405c39]!
                  "
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#f1f4ef] text-[#677463]">
                    <CircleUserRound className="size-4" />
                  </span>

                  Mi perfil
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="
                    cursor-pointer
                    rounded-xl
                    px-3
                    py-2.5

                    text-[#505a51]

                    transition-colors

                    hover:bg-[#f1f5ef]!
                    hover:text-[#405c39]!
                  "
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#f1f4ef] text-[#677463]">
                    <Settings className="size-4" />
                  </span>

                  Configuración
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#edf0eb]" />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  className="
                    cursor-pointer
                    rounded-xl
                    px-3
                    py-2.5
                  "
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <LogOut className="size-4" />
                  </span>

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