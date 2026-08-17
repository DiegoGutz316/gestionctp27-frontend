import Link from "next/link";
import { ArrowRight, Leaf, ShieldAlert, Sprout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardResumenProps = {
  agricola: number;
  pecuario: number;
  general: number;
  stockBajo: number;
  total: number;
  mostrarInventario: boolean;
};

export function DashboardResumen({
  agricola,
  pecuario,
  general,
  stockBajo,
  total,
  mostrarInventario,
}: DashboardResumenProps) {
  const totalDepartamentos = agricola + pecuario + general;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="shadow-xs md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Sprout className="size-5 text-color-company" />
            Inventario por área
          </CardTitle>
          <CardDescription>
            Distribución de productos registrados según el departamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mostrarInventario && totalDepartamentos > 0 ? (
            <>
              <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-emerald-500" />
                  Agrícola ({agricola})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-amber-500" />
                  Pecuaria ({pecuario})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-slate-400" />
                  General ({general})
                </span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  style={{ width: `${(agricola / totalDepartamentos) * 100}%` }}
                  className="h-full bg-emerald-500"
                  title={`Agrícola: ${agricola}`}
                />
                <div
                  style={{ width: `${(pecuario / totalDepartamentos) * 100}%` }}
                  className="h-full bg-amber-500"
                  title={`Pecuaria: ${pecuario}`}
                />
                <div
                  style={{ width: `${(general / totalDepartamentos) * 100}%` }}
                  className="h-full bg-slate-400"
                  title={`General: ${general}`}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {mostrarInventario
                ? "Todavía no hay productos para mostrar la distribución."
                : "No tiene permiso para consultar el inventario."}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span>Total de productos: {mostrarInventario ? total : "—"}</span>
            <Link
              href="/dashboard/inventario"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Gestionar inventario <ArrowRight className="size-3" />
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`shadow-xs border ${stockBajo > 0 ? "border-amber-200 bg-amber-50/20" : ""}`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <ShieldAlert
                className={`size-5 ${stockBajo > 0 ? "text-amber-600" : "text-color-company"}`}
              />
              Alertas de stock
            </CardTitle>
            {stockBajo > 0 ? (
              <Badge variant="destructive">{stockBajo}</Badge>
            ) : null}
          </div>
          <CardDescription>
            Productos que requieren reposición en bodega.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {stockBajo > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-amber-800">
                Hay {stockBajo} {stockBajo === 1 ? "producto" : "productos"} en
                o por debajo del stock mínimo.
              </p>
              <p className="text-xs text-muted-foreground">
                Revise las existencias para evitar desabastecimiento en las
                prácticas agrícolas y pecuarias.
              </p>
              <Link href="/dashboard/inventario" className="mt-2 self-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100/60"
                >
                  Ver inventario <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-emerald-800">
                {mostrarInventario
                  ? "Sin alertas. El inventario está dentro de los mínimos."
                  : "Consulte inventario cuando tenga acceso al módulo."}
              </p>
              <p className="text-xs text-muted-foreground">
                Las existencias se actualizan con cada entrada y salida.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href="/dashboard/agricola">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Sprout className="size-3.5" />
                    Área agrícola
                  </Button>
                </Link>
                <Link href="/dashboard/pecuaria">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Leaf className="size-3.5" />
                    Área pecuaria
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
