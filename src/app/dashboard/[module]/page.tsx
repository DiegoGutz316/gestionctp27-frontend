import Link from "next/link"
import { notFound } from "next/navigation"
import {
  BarChart3,
  Leaf,
  Sprout,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede"
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
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-color-company">
            {details.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {details.description}
          </p>
        </div>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-color-company">
              <Icon className="size-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">{details.title}</CardTitle>
              <CardDescription>{details.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {details.action ? (
              <MostrarSiPuede modulo={details.modulo} nivel="COMPLETO">
                <Button
                  nativeButton={false}
                  render={<Link href={details.action.href} />}
                >
                  {details.action.label}
                </Button>
              </MostrarSiPuede>
            ) : (
              <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-sm text-muted-foreground">
                El módulo está listo para recibir su contenido funcional.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RequerirPermiso>
  )
}
