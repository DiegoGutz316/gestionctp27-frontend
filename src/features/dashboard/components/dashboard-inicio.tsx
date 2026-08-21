"use client";

import { useMemo } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";
import { useProductos } from "@/features/inventario/producto/hooks/hooks";
import { esStockBajo } from "@/features/inventario/producto/models/producto.model";
import type { ProductoRespuesta } from "@/features/inventario/producto/validacion/producto.validacion";
import { useUsuarios } from "@/features/usuarios/hooks/hooks";
import { DashboardActividad } from "./dashboard-actividad";
import { DashboardCarga } from "./dashboard-carga";
import { DashboardMetricas } from "./dashboard-metricas";
import { DashboardResumen } from "./dashboard-resumen";

export function DashboardInicio() {
  const { puede, usuario } = useAuth();
  const mostrarInventario = puede("INVENTARIO");
  const mostrarUsuarios = puede("USUARIOS");

  const productos = useProductos(
    { pagina: 1, limite: 100 },
    { enabled: mostrarInventario },
  );
  const usuarios = useUsuarios(
    { pagina: 1, limite: 1 },
    { enabled: mostrarUsuarios },
  );

  const cargando =
    (mostrarInventario && productos.isLoading) ||
    (mostrarUsuarios && usuarios.isLoading);

  const error =
    (mostrarInventario && productos.isError) ||
    (mostrarUsuarios && usuarios.isError);

  const actualizando = productos.isFetching || usuarios.isFetching;

  const catalogo = useMemo(
    () => productos.data?.datos ?? [],
    [productos.data],
  );

  const metricas = useMemo(() => {
    let agricola = 0;
    let pecuario = 0;
    let general = 0;
    const stockBajo: ProductoRespuesta[] = [];

    for (const producto of catalogo) {
      if (producto.departamento === "AGRICOLA") agricola += 1;
      else if (producto.departamento === "PECUARIO") pecuario += 1;
      else general += 1;

      if (esStockBajo(producto)) {
        stockBajo.push(producto);
      }
    }

    const recientes = [...catalogo]
      .sort(
        (a, b) =>
          new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime(),
      )
      .slice(0, 5);

    return {
      agricola,
      pecuario,
      general,
      stockBajo: stockBajo.slice(0, 5),
      cantidadStockBajo: stockBajo.length,
      recientes,
    };
  }, [catalogo]);

  function recargar() {
    if (mostrarInventario) void productos.refetch();
    if (mostrarUsuarios) void usuarios.refetch();
  }

  if (cargando) {
    return <DashboardCarga />;
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-red-50 p-4 text-red-600">
          <AlertCircle className="size-10" />
        </div>
        <h2 className="text-xl font-semibold">Error al cargar el panel</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Hubo un problema de comunicación con el servidor. Intente de nuevo.
        </p>
        <Button onClick={recargar} className="gap-2">
          <RefreshCw className="size-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  const nombre = usuario?.nombre?.split(/\s+/)[0] ?? "";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-color-company">
            Panel de Control
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {nombre
              ? `Bienvenido, ${nombre}. Resumen operativo de Gestión CTP 27.`
              : "Resumen operativo y acceso rápido a los módulos del colegio."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={recargar}
          disabled={actualizando}
          className="gap-2 self-start border bg-background shadow-xs sm:self-auto"
        >
          <RefreshCw className={`size-4 ${actualizando ? "animate-spin" : ""}`} />
          {actualizando ? "Actualizando..." : "Actualizar datos"}
        </Button>
      </div>

      <DashboardMetricas
        productos={productos.data?.meta.total ?? 0}
        usuarios={usuarios.data?.meta.total ?? 0}
        stockBajo={metricas.cantidadStockBajo}
        mostrarUsuarios={mostrarUsuarios}
        mostrarInventario={mostrarInventario}
      />

      <DashboardResumen
        agricola={metricas.agricola}
        pecuario={metricas.pecuario}
        general={metricas.general}
        stockBajo={metricas.cantidadStockBajo}
        total={catalogo.length}
        mostrarInventario={mostrarInventario}
      />

      <DashboardActividad
        recientes={metricas.recientes}
        stockBajo={metricas.stockBajo}
        mostrarInventario={mostrarInventario}
      />
    </div>
  );
}
