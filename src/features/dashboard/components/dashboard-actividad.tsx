import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Package,
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

import {
  ETIQUETA_DEPARTAMENTO,
  ETIQUETA_TIPO_PRODUCTO,
} from "@/features/inventario/producto/models/producto.model";

import type { ProductoRespuesta } from "@/features/inventario/producto/validacion/producto.validacion";

type DashboardActividadProps = {
  recientes: ProductoRespuesta[];
  stockBajo: ProductoRespuesta[];
  mostrarInventario: boolean;
};

function fechaCorta(valor: string) {
  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return "—";
  }

  return fecha.toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function estilosDepartamento(departamento: string) {
  if (departamento === "AGRICOLA") {
    return {
      icono: "bg-[#edf3e9] dark:bg-secondary text-[#6f8668] dark:text-primary",
      punto: "bg-[#71866a]",
    };
  }

  if (departamento === "PECUARIO") {
    return {
      icono: "bg-[#f1f4ed] dark:bg-secondary text-[#829178] dark:text-foreground",
      punto: "bg-[#93a187]",
    };
  }

  return {
    icono: "bg-[#f1f3f0] dark:bg-secondary text-[#7d877e] dark:text-foreground",
    punto: "bg-[#b7beb5]",
  };
}

export function DashboardActividad({
  recientes,
  stockBajo,
  mostrarInventario,
}: DashboardActividadProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* =====================================================
          PRODUCTOS RECIENTES
          ===================================================== */}

      <Card className="overflow-hidden border-[#dde4db] dark:border-border bg-white dark:bg-card shadow-[0_8px_30px_rgba(39,50,42,0.05)]">
        <CardHeader className="border-b border-[#edf0eb] dark:border-border pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#2d352f] dark:text-foreground">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#edf3e9] dark:bg-secondary text-[#637a4a] dark:text-primary">
                  <Package className="size-4" />
                </div>

                Productos recientes
              </CardTitle>

              <CardDescription className="mt-2">
                Últimos registros agregados al inventario.
              </CardDescription>
            </div>

            <Link href="/dashboard/inventario">
              <Button
                variant="ghost"
                size="sm"
                className="group gap-1.5 text-xs text-[#637a4a] dark:text-primary hover:bg-[#f1f5ee] dark:hover:bg-accent hover:text-[#4f633a] dark:hover:text-primary"
              >
                Ver todos
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {!mostrarInventario || recientes.length === 0 ? (
            /* ================================
                ESTADO VACÍO
                ================================ */

            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#f0f4ed] dark:bg-secondary text-[#788b70] dark:text-primary">
                <Boxes className="size-6" />
              </div>

              <p className="mt-4 text-sm font-medium text-[#444d45] dark:text-foreground">
                {mostrarInventario
                  ? "Aún no hay productos registrados"
                  : "Inventario no disponible"}
              </p>

              <p className="mt-1 max-w-xs text-xs leading-5 text-[#90988e] dark:text-foreground">
                {mostrarInventario
                  ? "Los productos agregados recientemente aparecerán aquí."
                  : "No tiene permiso para consultar la actividad del inventario."}
              </p>
            </div>
          ) : (
            /* ================================
                LISTA DE ACTIVIDAD
                ================================ */

            <div className="divide-y divide-[#edf0eb] dark:divide-border">
              {recientes.map((producto) => {
                const estilo = estilosDepartamento(
                  producto.departamento,
                );

                return (
                  <Link
                    key={producto.id}
                    href={`/dashboard/inventario/${producto.id}`}
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#fafbf9] dark:hover:bg-accent"
                  >
                    {/* Icono */}
                    <div
                      className={`
                        flex
                        size-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${estilo.icono}
                      `}
                    >
                      {producto.departamento === "AGRICOLA" ? (
                        <Sprout className="size-4.5" />
                      ) : (
                        <Package className="size-4.5" />
                      )}
                    </div>

                    {/* Información */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-[#343d35] dark:text-foreground">
                          {producto.nombre}
                        </p>

                        <span
                          className={`size-1.5 shrink-0 rounded-full ${estilo.punto}`}
                        />
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#8d958c] dark:text-foreground">
                        <span>
                          {
                            ETIQUETA_TIPO_PRODUCTO[
                              producto.tipoProducto
                            ]
                          }
                        </span>

                        <span className="text-[#c0c6be] dark:text-muted-foreground">
                          •
                        </span>

                        <span>
                          {
                            ETIQUETA_DEPARTAMENTO[
                              producto.departamento
                            ]
                          }
                        </span>
                      </div>
                    </div>

                    {/* Fecha */}
                    <div className="shrink-0 text-right">
                      <p className="text-[11px] font-medium capitalize text-[#7f887e] dark:text-foreground">
                        {fechaCorta(producto.creadoEn)}
                      </p>

                      <p className="mt-1 text-[10px] text-[#a0a79e] dark:text-foreground">
                        Registrado
                      </p>
                    </div>

                    <ArrowRight className="size-4 shrink-0 text-[#b2b9b0] dark:text-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[#637a4a] dark:group-hover:text-primary" />
                  </Link>
                );
              })}
            </div>
          )}

          {mostrarInventario && recientes.length > 0 ? (
            <div className="border-t border-[#edf0eb] dark:border-border bg-[#fafbf9] dark:bg-muted px-6 py-3">
              <p className="text-[11px] text-[#929a91] dark:text-foreground">
                Mostrando los {recientes.length} registros más
                recientes
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* =====================================================
          ALERTAS DE REPOSICIÓN
          ===================================================== */}

      <Card className="overflow-hidden border-[#dde4db] dark:border-border bg-white dark:bg-card shadow-[0_8px_30px_rgba(39,50,42,0.05)]">
        <CardHeader className="border-b border-[#edf0eb] dark:border-border pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#2d352f] dark:text-foreground">
                <div
                  className={`
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-xl

                    ${
                      stockBajo.length > 0
                        ? "bg-[#fff6df] dark:bg-amber-950/35 text-[#aa8126] dark:text-amber-200"
                        : "bg-[#edf3e9] dark:bg-secondary text-[#637a4a] dark:text-primary"
                    }
                  `}
                >
                  {stockBajo.length > 0 ? (
                    <AlertTriangle className="size-4" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                </div>

                Alertas de reposición
              </CardTitle>

              <CardDescription className="mt-2">
                Productos en o por debajo del stock mínimo.
              </CardDescription>
            </div>

            {stockBajo.length > 0 ? (
              <Badge className="border border-[#ead9a7] dark:border-border bg-[#fff8e6] dark:bg-amber-950/35 text-[#98731d] dark:text-amber-200 hover:bg-[#fff8e6] dark:hover:bg-amber-950/40">
                {stockBajo.length}
              </Badge>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {!mostrarInventario || stockBajo.length === 0 ? (
            /* ================================
                SIN ALERTAS
                ================================ */

            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div
                className={`
                  flex
                  size-14
                  items-center
                  justify-center
                  rounded-2xl

                  ${
                    mostrarInventario
                      ? "bg-[#edf4e9] dark:bg-secondary text-[#66805d] dark:text-primary"
                      : "bg-[#f0f2ef] dark:bg-secondary text-[#899188] dark:text-foreground"
                  }
                `}
              >
                {mostrarInventario ? (
                  <CheckCircle2 className="size-6" />
                ) : (
                  <Boxes className="size-6" />
                )}
              </div>

              <p
                className={`
                  mt-4
                  text-sm
                  font-medium

                  ${
                    mostrarInventario
                      ? "text-[#4f6948] dark:text-primary"
                      : "text-[#444d45] dark:text-foreground"
                  }
                `}
              >
                {mostrarInventario
                  ? "Todo está bajo control"
                  : "Inventario no disponible"}
              </p>

              <p className="mt-1 max-w-xs text-xs leading-5 text-[#90988e] dark:text-foreground">
                {mostrarInventario
                  ? "No hay productos que requieran reposición en este momento."
                  : "No tiene permiso para consultar las alertas del inventario."}
              </p>

              {mostrarInventario ? (
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#dfe7da] dark:border-border bg-[#f8faf6] dark:bg-muted px-3 py-1.5 text-[11px] font-medium text-[#6b7d65] dark:text-primary">
                  <span className="size-1.5 rounded-full bg-[#7b936f]" />
                  Existencias dentro del mínimo
                </div>
              ) : null}
            </div>
          ) : (
            /* ================================
                LISTA DE ALERTAS
                ================================ */

            <div className="divide-y divide-[#edf0eb] dark:divide-border">
              {stockBajo.map((producto) => {
                const cantidad =
                  producto.inventario?.cantidadActual;

                const minimo =
                  producto.configuracionStock?.stockMinimo;

                const porcentaje =
                  typeof cantidad === "number" &&
                  typeof minimo === "number" &&
                  minimo > 0
                    ? Math.min(
                        (cantidad / minimo) * 100,
                        100,
                      )
                    : 0;

                const sinExistencias =
                  cantidad === 0;

                return (
                  <Link
                    key={producto.id}
                    href={`/dashboard/inventario/${producto.id}`}
                    className="group block px-6 py-4 transition-colors hover:bg-[#fffdf8] dark:hover:bg-accent"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icono */}
                      <div
                        className={`
                          flex
                          size-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl

                          ${
                            sinExistencias
                              ? "bg-[#fff0eb] dark:bg-red-950/40 text-[#b8664c] dark:text-red-300"
                              : "bg-[#fff6df] dark:bg-amber-950/35 text-[#ac8229] dark:text-amber-200"
                          }
                        `}
                      >
                        <AlertTriangle className="size-4.5" />
                      </div>

                      {/* Contenido */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#353d36] dark:text-foreground">
                              {producto.nombre}
                            </p>

                            <p className="mt-1 text-[11px] text-[#8e968d] dark:text-foreground">
                              {
                                ETIQUETA_DEPARTAMENTO[
                                  producto.departamento
                                ]
                              }
                            </p>
                          </div>

                          <Badge
                            variant="outline"
                            className={
                              sinExistencias
                                ? "shrink-0 border-[#efd0c5] dark:border-border bg-[#fff4f0] dark:bg-red-950/40 text-[10px] text-[#a75138] dark:text-red-300"
                                : "shrink-0 border-[#ead9a7] dark:border-border bg-[#fff8e6] dark:bg-amber-950/35 text-[10px] text-[#98731d] dark:text-amber-200"
                            }
                          >
                            {sinExistencias
                              ? "Sin stock"
                              : "Reponer"}
                          </Badge>
                        </div>

                        {/* Información de stock */}
                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between text-[11px]">
                            <span className="text-[#8c948a] dark:text-foreground">
                              Existencia actual
                            </span>

                            <span className="font-semibold tabular-nums text-[#525b52] dark:text-foreground">
                              {cantidad ?? "—"} /{" "}
                              {minimo ?? "—"}
                            </span>
                          </div>

                          {/* Barra */}
                          <div className="h-1.5 overflow-hidden rounded-full bg-[#eeeeda] dark:bg-secondary">
                            <div
                              className={`h-full rounded-full transition-all ${
                                sinExistencias
                                  ? "bg-[#c97960]"
                                  : "bg-[#d2ad4f]"
                              }`}
                              style={{
                                width: `${porcentaje}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="mt-1 size-4 shrink-0 text-[#b6b8aa] dark:text-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[#9a7725] dark:group-hover:text-red-300" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-[#edf0eb] dark:border-border bg-[#fafbf9] dark:bg-muted px-6 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-[#929a91] dark:text-foreground">
                {mostrarInventario
                  ? stockBajo.length > 0
                    ? `${stockBajo.length} ${
                        stockBajo.length === 1
                          ? "producto requiere"
                          : "productos requieren"
                      } atención`
                    : "Sin alertas activas"
                  : "Información restringida"}
              </p>

              <Link href="/dashboard/inventario">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 px-2 text-[11px] text-[#637a4a] dark:text-primary hover:bg-[#eef3ea] dark:hover:bg-accent"
                >
                  Inventario
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}