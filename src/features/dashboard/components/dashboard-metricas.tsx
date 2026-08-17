import Link from "next/link";
import { AlertTriangle, Boxes, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardMetricasProps = {
  productos: number;
  usuarios: number;
  stockBajo: number;
  mostrarUsuarios: boolean;
  mostrarInventario: boolean;
};

export function DashboardMetricas({
  productos,
  usuarios,
  stockBajo,
  mostrarUsuarios,
  mostrarInventario,
}: DashboardMetricasProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mostrarInventario ? (
        <Link
          href="/dashboard/inventario"
          className="transition-transform duration-200 hover:scale-[1.01]"
        >
          <Card className="h-full shadow-xs transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inventario
              </CardTitle>
              <Boxes className="size-5 text-color-company" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productos}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Productos registrados en catálogo
              </p>
            </CardContent>
          </Card>
        </Link>
      ) : null}

      {mostrarUsuarios ? (
        <Link
          href="/dashboard/usuarios"
          className="transition-transform duration-200 hover:scale-[1.01]"
        >
          <Card className="h-full shadow-xs transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Usuarios
              </CardTitle>
              <Users className="size-5 text-color-company" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuarios}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Cuentas registradas en el sistema
              </p>
            </CardContent>
          </Card>
        </Link>
      ) : null}

      {mostrarInventario ? (
        <Link
          href="/dashboard/inventario"
          className="transition-transform duration-200 hover:scale-[1.01]"
        >
          <Card className="h-full shadow-xs transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Stock bajo
              </CardTitle>
              <AlertTriangle
                className={`size-5 ${stockBajo > 0 ? "text-amber-600" : "text-color-company"}`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockBajo}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Productos en o bajo el mínimo
              </p>
            </CardContent>
          </Card>
        </Link>
      ) : null}
    </div>
  );
}
