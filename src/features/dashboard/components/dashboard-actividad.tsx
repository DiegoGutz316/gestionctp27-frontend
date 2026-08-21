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
      icono: "bg-[#edf3e9] text-[#6f8668]",
      punto: "bg-[#71866a]",
    };
  }

  if (departamento === "PECUARIO") {
    return {
      icono: "bg-[#f1f4ed] text-[#829178]",
      punto: "bg-[#93a187]",
    };
  }

  return {
    icono: "bg-[#f1f3f0] text-[#7d877e]",
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

      <Card className="overflow-hidden border-[#dde4db] bg-white shadow-[0_8px_30px_rgba(39,50,42,0.05)]">
        <CardHeader className="border-b border-[#edf0eb] pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#2d352f]">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#edf3e9] text-[#637a4a]">
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
                className="group gap-1.5 text-xs text-[#637a4a] hover:bg-[#f1f5ee] hover:text-[#4f633a]"
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
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#f0f4ed] text-[#788b70]">
                <Boxes className="size-6" />
              </div>

              <p className="mt-4 text-sm font-medium text-[#444d45]">
                {mostrarInventario
                  ? "Aún no hay productos registrados"
                  : "Inventario no disponible"}
              </p>

              <p className="mt-1 max-w-xs text-xs leading-5 text-[#90988e]">
                {mostrarInventario
                  ? "Los productos agregados recientemente aparecerán aquí."
                  : "No tiene permiso para consultar la actividad del inventario."}
              </p>
            </div>
          ) : (
            /* ================================
                LISTA DE ACTIVIDAD
                ================================ */

            <div className="divide-y divide-[#edf0eb]">
              {recientes.map((producto) => {
                const estilo = estilosDepartamento(
                  producto.departamento,
                );

                return (
                  <Link
                    key={producto.id}
                    href={`/dashboard/inventario/${producto.id}`}
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#fafbf9]"
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
                        <p className="truncate text-sm font-semibold text-[#343d35]">
                          {producto.nombre}
                        </p>

                        <span
                          className={`size-1.5 shrink-0 rounded-full ${estilo.punto}`}
                        />
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#8d958c]">
                        <span>
                          {
                            ETIQUETA_TIPO_PRODUCTO[
                              producto.tipoProducto
                            ]
                          }
                        </span>

                        <span className="text-[#c0c6be]">
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
                      <p className="text-[11px] font-medium capitalize text-[#7f887e]">
                        {fechaCorta(producto.creadoEn)}
                      </p>

                      <p className="mt-1 text-[10px] text-[#a0a79e]">
                        Registrado
                      </p>
                    </div>

                    <ArrowRight className="size-4 shrink-0 text-[#b2b9b0] transition-all group-hover:translate-x-0.5 group-hover:text-[#637a4a]" />
                  </Link>
                );
              })}
            </div>
          )}

          {mostrarInventario && recientes.length > 0 ? (
            <div className="border-t border-[#edf0eb] bg-[#fafbf9] px-6 py-3">
              <p className="text-[11px] text-[#929a91]">
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

      <Card className="overflow-hidden border-[#dde4db] bg-white shadow-[0_8px_30px_rgba(39,50,42,0.05)]">
        <CardHeader className="border-b border-[#edf0eb] pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#2d352f]">
                <div
                  className={`
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-xl

                    ${
                      stockBajo.length > 0
                        ? "bg-[#fff6df] text-[#aa8126]"
                        : "bg-[#edf3e9] text-[#637a4a]"
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
              <Badge className="border border-[#ead9a7] bg-[#fff8e6] text-[#98731d] hover:bg-[#fff8e6]">
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
                      ? "bg-[#edf4e9] text-[#66805d]"
                      : "bg-[#f0f2ef] text-[#899188]"
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
                      ? "text-[#4f6948]"
                      : "text-[#444d45]"
                  }
                `}
              >
                {mostrarInventario
                  ? "Todo está bajo control"
                  : "Inventario no disponible"}
              </p>

              <p className="mt-1 max-w-xs text-xs leading-5 text-[#90988e]">
                {mostrarInventario
                  ? "No hay productos que requieran reposición en este momento."
                  : "No tiene permiso para consultar las alertas del inventario."}
              </p>

              {mostrarInventario ? (
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#dfe7da] bg-[#f8faf6] px-3 py-1.5 text-[11px] font-medium text-[#6b7d65]">
                  <span className="size-1.5 rounded-full bg-[#7b936f]" />
                  Existencias dentro del mínimo
                </div>
              ) : null}
            </div>
          ) : (
            /* ================================
                LISTA DE ALERTAS
                ================================ */

            <div className="divide-y divide-[#edf0eb]">
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
                    className="group block px-6 py-4 transition-colors hover:bg-[#fffdf8]"
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
                              ? "bg-[#fff0eb] text-[#b8664c]"
                              : "bg-[#fff6df] text-[#ac8229]"
                          }
                        `}
                      >
                        <AlertTriangle className="size-4.5" />
                      </div>

                      {/* Contenido */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#353d36]">
                              {producto.nombre}
                            </p>

                            <p className="mt-1 text-[11px] text-[#8e968d]">
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
                                ? "shrink-0 border-[#efd0c5] bg-[#fff4f0] text-[10px] text-[#a75138]"
                                : "shrink-0 border-[#ead9a7] bg-[#fff8e6] text-[10px] text-[#98731d]"
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
                            <span className="text-[#8c948a]">
                              Existencia actual
                            </span>

                            <span className="font-semibold tabular-nums text-[#525b52]">
                              {cantidad ?? "—"} /{" "}
                              {minimo ?? "—"}
                            </span>
                          </div>

                          {/* Barra */}
                          <div className="h-1.5 overflow-hidden rounded-full bg-[#eeeeda]">
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

                      <ArrowRight className="mt-1 size-4 shrink-0 text-[#b6b8aa] transition-all group-hover:translate-x-0.5 group-hover:text-[#9a7725]" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-[#edf0eb] bg-[#fafbf9] px-6 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-[#929a91]">
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
                  className="h-7 gap-1 px-2 text-[11px] text-[#637a4a] hover:bg-[#eef3ea]"
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