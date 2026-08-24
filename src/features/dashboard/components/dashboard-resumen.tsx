import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  ShieldAlert,
  Sprout,
} from "lucide-react";

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
  const totalDepartamentos =
    agricola + pecuario + general;

  const porcentajeAgricola =
    totalDepartamentos > 0
      ? (agricola / totalDepartamentos) * 100
      : 0;

  const porcentajePecuario =
    totalDepartamentos > 0
      ? (pecuario / totalDepartamentos) * 100
      : 0;

  const porcentajeGeneral =
    totalDepartamentos > 0
      ? (general / totalDepartamentos) * 100
      : 0;

  const limiteAgricola =
    porcentajeAgricola;

  const limitePecuario =
    porcentajeAgricola + porcentajePecuario;

  const stockNormal =
    mostrarInventario
      ? Math.max(total - stockBajo, 0)
      : 0;

  const porcentajeStockNormal =
    total > 0
      ? (stockNormal / total) * 100
      : 0;

  const porcentajeStockBajo =
    total > 0
      ? (stockBajo / total) * 100
      : 0;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* =====================================================
          GRÁFICA 1 - DISTRIBUCIÓN INVENTARIO
          ===================================================== */}

      <Card className="overflow-hidden border-[#dde4db] bg-white shadow-[0_8px_30px_rgba(39,50,42,0.05)] md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#2d352f]">
                <Sprout className="size-5 text-[#7fa36a]" />

                Distribución del inventario
              </CardTitle>

              <CardDescription className="mt-1">
                Productos registrados según el área correspondiente.
              </CardDescription>
            </div>

            {mostrarInventario && totalDepartamentos > 0 ? (
              <div className="rounded-xl border border-[#e2e7df] bg-[#f7f9f6] px-3 py-2 text-right">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#899287]">
                  Total
                </p>

                <p className="text-lg font-semibold leading-none text-[#303832]">
                  {total}
                </p>
              </div>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {mostrarInventario && totalDepartamentos > 0 ? (
            <div className="grid items-center gap-8 lg:grid-cols-[220px_1fr]">
              {/* ===============================
                  DONUT
                  =============================== */}

              <div className="flex justify-center">
                <div className="relative flex size-[190px] items-center justify-center">
                  {/* Sombra exterior */}
                  <div className="absolute inset-2 rounded-full bg-[#f4f6f2] blur-md" />

                  {/* Donut */}
                  <div
                    className="relative size-[180px] rounded-full shadow-[0_8px_25px_rgba(42,54,45,0.08)]"
                    style={{
                      background: `
                        conic-gradient(
                          #7fa36a 0% ${limiteAgricola}%,
                          #d6a36c ${limiteAgricola}% ${limitePecuario}%,
                          #ad8fa3 ${limitePecuario}% 100%
                        )
                      `,
                    }}
                  >
                    {/* Centro */}
                    <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full border border-[#e6eae4] bg-white shadow-inner">
                      <span className="text-[34px] font-semibold tracking-[-0.05em] text-[#303832]">
                        {totalDepartamentos}
                      </span>

                      <span className="mt-1 text-[11px] font-medium text-[#8a9388]">
                        productos
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===============================
                  LEYENDA / DATOS
                  =============================== */}

              <div className="space-y-3">
                {/* Agrícola */}
                <div className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 transition hover:border-[#dfe8da] hover:bg-[#f7faf5]">
                  <div className="flex items-center gap-3">
                    <span className="size-3 rounded-full bg-[#7fa36a]" />

                    <div>
                      <p className="text-sm font-medium text-[#384139]">
                        Área agrícola
                      </p>

                      <p className="text-[11px] text-[#90988e]">
                        Cultivos e insumos agrícolas
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#303832]">
                      {agricola}
                    </p>

                    <p className="text-[10px] text-[#969d94]">
                      {porcentajeAgricola.toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* Pecuaria */}
                <div className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 transition hover:border-[#eee0d0] hover:bg-[#fdf9f4]">
                  <div className="flex items-center gap-3">
                    <span className="size-3 rounded-full bg-[#d6a36c]" />

                    <div>
                      <p className="text-sm font-medium text-[#384139]">
                        Área pecuaria
                      </p>

                      <p className="text-[11px] text-[#90988e]">
                        Recursos e insumos pecuarios
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#303832]">
                      {pecuario}
                    </p>

                    <p className="text-[10px] text-[#969d94]">
                      {porcentajePecuario.toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* General */}
                <div className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 transition hover:border-[#e9dfe6] hover:bg-[#fbf8fa]">
                  <div className="flex items-center gap-3">
                    <span className="size-3 rounded-full bg-[#ad8fa3]" />

                    <div>
                      <p className="text-sm font-medium text-[#384139]">
                        Inventario general
                      </p>

                      <p className="text-[11px] text-[#90988e]">
                        Recursos compartidos
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#303832]">
                      {general}
                    </p>

                    <p className="text-[10px] text-[#969d94]">
                      {porcentajeGeneral.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ===============================
                ESTADO SIN DATOS
                =============================== */

            <div className="flex min-h-[230px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#dfe5dc] bg-[#fafbf9] px-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#edf4e9] text-[#7fa36a]">
                <Sprout className="size-5" />
              </div>

              <p className="mt-4 text-sm font-medium text-[#4a544b]">
                {mostrarInventario
                  ? "Aún no hay datos para generar la gráfica"
                  : "Inventario no disponible"}
              </p>

              <p className="mt-1 max-w-sm text-xs leading-5 text-[#90988e]">
                {mostrarInventario
                  ? "Cuando se registren productos, la distribución por área aparecerá automáticamente."
                  : "No tiene permiso para consultar la información del inventario."}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-[#edf0eb] pt-4">
            <span className="text-xs text-[#8e968c]">
              Total de productos:{" "}
              <span className="font-medium text-[#505950]">
                {mostrarInventario ? total : "—"}
              </span>
            </span>

            <Link
              href="/dashboard/inventario"
              className="group flex items-center gap-1.5 text-xs font-medium text-[#6f935e] transition hover:text-[#5f7f50]"
            >
              Gestionar inventario

              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          GRÁFICA 2 - ESTADO EXISTENCIAS
          ===================================================== */}

      <Card
        className={`
          overflow-hidden
          border
          bg-white
          shadow-[0_8px_30px_rgba(39,50,42,0.05)]

          ${
            stockBajo > 0
              ? "border-[#efdca6]"
              : "border-[#dde4db]"
          }
        `}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#2d352f]">
                <ShieldAlert
                  className={`size-5 ${
                    stockBajo > 0
                      ? "text-[#c18e27]"
                      : "text-[#7fa36a]"
                  }`}
                />

                Estado de existencias
              </CardTitle>

              <CardDescription className="mt-1">
                Estado actual del stock registrado.
              </CardDescription>
            </div>

            {stockBajo > 0 ? (
              <Badge className="border-[#efdca6] bg-[#fff8e8] text-[#b58424] hover:bg-[#fff8e8]">
                {stockBajo}
              </Badge>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {mostrarInventario && total > 0 ? (
            <>
              {/* Número principal */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[38px] font-semibold leading-none tracking-[-0.05em] text-[#303832]">
                    {stockNormal}
                  </p>

                  <p className="mt-2 text-xs text-[#858e84]">
                    productos con stock suficiente
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${
                      stockBajo > 0
                        ? "text-[#c18e27]"
                        : "text-[#7fa36a]"
                    }`}
                  >
                    {stockBajo}
                  </p>

                  <p className="text-[10px] text-[#969e95]">
                    requieren atención
                  </p>
                </div>
              </div>

              {/* Barra gráfica */}
              <div className="mt-7">
                <div className="flex h-3 overflow-hidden rounded-full bg-[#eef1ec]">
                  <div
                    className="h-full rounded-l-full bg-[#7fa36a] transition-all duration-500"
                    style={{
                      width: `${porcentajeStockNormal}%`,
                    }}
                  />

                  {stockBajo > 0 ? (
                    <div
                      className="h-full rounded-r-full bg-[#e2b85b] transition-all duration-500"
                      style={{
                        width: `${porcentajeStockBajo}%`,
                      }}
                    />
                  ) : null}
                </div>

                {/* Leyenda */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-[#7fa36a]" />

                      <span className="text-xs text-[#667066]">
                        Stock suficiente
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-[#3f4840]">
                      {stockNormal}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2.5 rounded-full ${
                          stockBajo > 0
                            ? "bg-[#e2b85b]"
                            : "bg-[#e6e9e3]"
                        }`}
                      />

                      <span className="text-xs text-[#667066]">
                        Existencias bajas
                      </span>
                    </div>

                    <span
                      className={`text-xs font-semibold ${
                        stockBajo > 0
                          ? "text-[#b58424]"
                          : "text-[#3f4840]"
                      }`}
                    >
                      {stockBajo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mensaje */}
              <div
                className={`
                  mt-6
                  rounded-xl
                  border
                  px-4
                  py-3

                  ${
                    stockBajo > 0
                      ? "border-[#f0dfac] bg-[#fff9eb]"
                      : "border-[#dfe8da] bg-[#f6faf4]"
                  }
                `}
              >
                <p
                  className={`text-xs font-medium ${
                    stockBajo > 0
                      ? "text-[#a97a20]"
                      : "text-[#628253]"
                  }`}
                >
                  {stockBajo > 0
                    ? `${stockBajo} ${
                        stockBajo === 1
                          ? "producto requiere"
                          : "productos requieren"
                      } reposición.`
                    : "Todas las existencias se encuentran dentro de los mínimos."}
                </p>
              </div>
            </>
          ) : (
            /* Sin datos */
            <div className="flex min-h-[230px] flex-col items-center justify-center text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#edf4e9] text-[#7fa36a]">
                <ShieldAlert className="size-5" />
              </div>

              <p className="mt-4 text-sm font-medium text-[#4a544b]">
                {mostrarInventario
                  ? "Sin información de existencias"
                  : "Inventario no disponible"}
              </p>

              <p className="mt-1 max-w-[240px] text-xs leading-5 text-[#90988e]">
                {mostrarInventario
                  ? "Las estadísticas aparecerán al registrar productos."
                  : "Necesita acceso al inventario para consultar esta información."}
              </p>
            </div>
          )}

          {/* Acciones */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-[#edf0eb] pt-4">
            {stockBajo > 0 ? (
              <Link
                href="/dashboard/inventario"
                className="w-full"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="
                    w-full
                    gap-1.5
                    border-[#efdca6]
                    bg-[#fff9eb]
                    text-[#a97a20]
                    hover:border-[#e2b85b]
                    hover:bg-[#fff5dc]
                    hover:text-[#926718]
                  "
                >
                  Revisar existencias

                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/dashboard/agricola">
                  <Button
                    variant="outline"
                    size="sm"
                    className="
                      gap-1.5
                      border-[#d8e5d0]
                      bg-[#f7faf5]
                      text-[#628253]
                      hover:bg-[#edf4e9]
                      hover:text-[#547247]
                    "
                  >
                    <Sprout className="size-3.5" />
                    Agrícola
                  </Button>
                </Link>

                <Link href="/dashboard/pecuaria">
                  <Button
                    variant="outline"
                    size="sm"
                    className="
                      gap-1.5
                      border-[#ead8c5]
                      bg-[#fdf9f4]
                      text-[#b17f4d]
                      hover:bg-[#f8efe6]
                      hover:text-[#95683d]
                    "
                  >
                    <Leaf className="size-3.5" />
                    Pecuaria
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}