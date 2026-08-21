import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Users,
} from "lucide-react";

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
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {/* =====================================================
          INVENTARIO
          ===================================================== */}

      {mostrarInventario ? (
        <Link
          href="/dashboard/inventario"
          className="group block"
        >
          <Card
            className="
              relative
              h-full
              overflow-hidden
              rounded-2xl
              border-[#e2e7de]
              bg-white
              shadow-[0_4px_18px_rgba(34,39,32,0.04)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#d4ddcd]
              hover:shadow-[0_12px_30px_rgba(34,39,32,0.08)]
            "
          >
            {/* Decoración de fondo */}
            <div className="absolute -top-14 -right-14 size-36 rounded-full bg-[#eef3e7] blur-2xl" />

            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-[#4f584a]">
                  Inventario
                </CardTitle>

                <p className="mt-1 text-xs text-muted-foreground">
                  Catálogo general
                </p>
              </div>

              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#dce5d2]
                  bg-[#f1f5eb]
                  text-[#637a36]
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              >
                <Boxes className="size-5" />
              </div>
            </CardHeader>

            <CardContent className="relative pt-3">
              <div className="text-4xl font-bold tracking-tight text-[#222720]">
                {productos}
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                Productos registrados
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-[#edf0ea] pt-4">
                <span className="text-xs font-medium text-[#66705f]">
                  Ver inventario
                </span>

                <div
                  className="
                    flex
                    size-8
                    items-center
                    justify-center
                    rounded-lg
                    text-[#637a36]
                    transition-all
                    duration-200
                    group-hover:bg-[#eef3e7]
                  "
                >
                  <ArrowUpRight className="size-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ) : null}

      {/* =====================================================
          USUARIOS
          ===================================================== */}

      {mostrarUsuarios ? (
        <Link
          href="/dashboard/usuarios"
          className="group block"
        >
          <Card
            className="
              relative
              h-full
              overflow-hidden
              rounded-2xl
              border-[#e2e7de]
              bg-white
              shadow-[0_4px_18px_rgba(34,39,32,0.04)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#d7e1dc]
              hover:shadow-[0_12px_30px_rgba(34,39,32,0.08)]
            "
          >
            <div className="absolute -top-14 -right-14 size-36 rounded-full bg-[#e9f1ee] blur-2xl" />

            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-[#4f584a]">
                  Usuarios
                </CardTitle>

                <p className="mt-1 text-xs text-muted-foreground">
                  Acceso al sistema
                </p>
              </div>

              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#dce8e3]
                  bg-[#eef4f1]
                  text-[#648378]
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              >
                <Users className="size-5" />
              </div>
            </CardHeader>

            <CardContent className="relative pt-3">
              <div className="text-4xl font-bold tracking-tight text-[#222720]">
                {usuarios}
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                Cuentas registradas
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-[#edf0ea] pt-4">
                <span className="text-xs font-medium text-[#66705f]">
                  Administrar usuarios
                </span>

                <div
                  className="
                    flex
                    size-8
                    items-center
                    justify-center
                    rounded-lg
                    text-[#648378]
                    transition-all
                    duration-200
                    group-hover:bg-[#e9f1ee]
                  "
                >
                  <ArrowUpRight className="size-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ) : null}

      {/* =====================================================
          EXISTENCIAS BAJAS
          ===================================================== */}

      {mostrarInventario ? (
        <Link
          href="/dashboard/inventario"
          className="group block"
        >
          <Card
            className={`relative h-full overflow-hidden rounded-2xl bg-white shadow-[0_4px_18px_rgba(34,39,32,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(34,39,32,0.08)] ${
              stockBajo > 0
                ? "border-[#ead8a9]"
                : "border-[#e2e7de]"
            }`}
          >
            <div
              className={`absolute -top-14 -right-14 size-36 rounded-full blur-2xl ${
                stockBajo > 0
                  ? "bg-[#faedca]"
                  : "bg-[#f5f0dc]"
              }`}
            />

            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-[#4f584a]">
                  Existencias bajas
                </CardTitle>

                <p className="mt-1 text-xs text-muted-foreground">
                  Control de stock
                </p>
              </div>

              <div
                className={`flex size-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 ${
                  stockBajo > 0
                    ? "border-amber-200 bg-amber-50 text-amber-600"
                    : "border-[#ece3c5] bg-[#f9f5e5] text-[#a08438]"
                }`}
              >
                <AlertTriangle className="size-5" />
              </div>
            </CardHeader>

            <CardContent className="relative pt-3">
              <div className="text-4xl font-bold tracking-tight text-[#222720]">
                {stockBajo}
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                Productos requieren atención
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-[#edf0ea] pt-4">
                <span
                  className={`text-xs font-medium ${
                    stockBajo > 0
                      ? "text-amber-700"
                      : "text-[#66705f]"
                  }`}
                >
                  {stockBajo > 0
                    ? "Revisar existencias"
                    : "Sin alertas activas"}
                </span>

                <div
                  className="
                    flex
                    size-8
                    items-center
                    justify-center
                    rounded-lg
                    text-[#9a823b]
                    transition-all
                    duration-200
                    group-hover:bg-[#f7f1df]
                  "
                >
                  <ArrowUpRight className="size-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ) : null}
    </div>
  );
}