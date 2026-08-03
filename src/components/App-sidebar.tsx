"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Boxes,
  ChevronsUpDown,
  CircleUserRound,
  LayoutDashboard,
  Leaf,
  LogOut,
  Settings,
  ShieldCheck,
  Sprout,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
    label: "Principal",
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

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/dashboard" />}
              className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
            >
              <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ShieldCheck className="size-4" />
              </span>
              <span className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Gestión CTP 27</span>
                <span className="truncate text-xs text-muted-foreground">
                  Panel administrativo
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isRouteActive(pathname, item.href)}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
                  <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                </Avatar>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Administrador</span>
                  <span className="truncate text-xs text-muted-foreground">
                    admin@ctp27.ed.cr
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
                        <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 leading-tight">
                        <span className="truncate font-medium">Administrador</span>
                        <span className="truncate text-xs text-muted-foreground">
                          admin@ctp27.ed.cr
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
                <DropdownMenuItem variant="destructive">
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
