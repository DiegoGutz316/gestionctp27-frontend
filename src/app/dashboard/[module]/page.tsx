import Link from "next/link"
import { notFound } from "next/navigation"
import {
  BarChart3,
  Boxes,
  Leaf,
  Sprout,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso"
import type { ModuloSistema } from "@/features/auth/models/permisos.model"

type ModuleDetails = {
  title: string
  description: string
  icon: LucideIcon
  /** Backlog 1.6: módulo de la matriz de permisos que habilita esta pantalla. */
  modulo: ModuloSistema
  action?: {
    label: string
    href: string
  }
}

const modules: Record<string, ModuleDetails> = {
  inventario: {
    title: "Inventario",
    description:
      "Administre los insumos agrícolas y pecuarios disponibles en el colegio.",
    icon: Boxes,
    modulo: "INVENTARIO",
    action: {
      label: "Registrar insumo",
      href: "/inventario/insumos/nuevo",
    },
  },
  agricola: {
    title: "Área agrícola",
    description:
      "Consulte y gestione las actividades, cultivos e insumos del área agrícola.",
    icon: Sprout,
    modulo: "AGRICOLA",
  },
  pecuaria: {
    title: "Área pecuaria",
    description:
      "Consulte y gestione las actividades, animales e insumos del área pecuaria.",
    icon: Leaf,
    modulo: "PECUARIA",
  },
  reportes: {
    title: "Reportes",
    description:
      "Visualice indicadores y genere reportes de las diferentes áreas del colegio.",
    icon: BarChart3,
    modulo: "REPORTES",
  },
}

export function generateStaticParams() {
  return Object.keys(modules).map((module) => ({ module }))
}

export default async function DashboardModulePage({
  params,
}: Readonly<{ params: Promise<{ module: string }> }>) {
  const { module } = await params
  const details = modules[module]

  if (!details) {
    notFound()
  }

  const Icon = details.icon

  return (
    <RequerirPermiso modulo={details.modulo}>
      <section className="flex flex-1 flex-col gap-6 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Icon className="size-5" strokeWidth={1.75} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {details.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {details.description}
            </p>
          </div>
        </div>

        {details.action ? (
          <div>
            <Button render={<Link href={details.action.href} />}>
              {details.action.label}
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-sm text-muted-foreground">
            El módulo está listo para recibir su contenido funcional.
          </div>
        )}
      </section>
    </RequerirPermiso>
  )
}
