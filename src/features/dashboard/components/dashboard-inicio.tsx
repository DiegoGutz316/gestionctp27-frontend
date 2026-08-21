"use client";

import { useMemo } from "react";
import {
  AlertCircle,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";

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
    {
      pagina: 1,
      limite: 100,
    },
    {
      enabled: mostrarInventario,
    },
  );

  const usuarios = useUsuarios(
    {
      pagina: 1,
      limite: 1,
    },
    {
      enabled: mostrarUsuarios,
    },
  );

  const cargando =
    (mostrarInventario && productos.isLoading) ||
    (mostrarUsuarios && usuarios.isLoading);

  const error =
    (mostrarInventario && productos.isError) ||
    (mostrarUsuarios && usuarios.isError);

  const actualizando =
    productos.isFetching || usuarios.isFetching;

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
      if (producto.departamento === "AGRICOLA") {
        agricola += 1;
      } else if (producto.departamento === "PECUARIO") {
        pecuario += 1;
      } else {
        general += 1;
      }

      // Backlog 4.8: la regla vive en `esStockBajo` para que el panel, el
      // listado de inventario y el detalle del producto no puedan discrepar.
      if (esStockBajo(producto)) {
        stockBajo.push(producto);
      }
    }

    const recientes = [...catalogo]
      .sort(
        (a, b) =>
          new Date(b.creadoEn).getTime() -
          new Date(a.creadoEn).getTime(),
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
    if (mostrarInventario) {
      void productos.refetch();
    }

    if (mostrarUsuarios) {
      void usuarios.refetch();
    }
  }

  if (cargando) {
    return <DashboardCarga />;
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#c9705a]">
          <AlertCircle className="size-6" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#292c2a]">
            Error al cargar el panel
          </h2>

          <p className="mt-2 max-w-md text-sm text-[#858985]">
            Hubo un problema de comunicación con el servidor.
            Intente nuevamente.
          </p>
        </div>

        <Button
          onClick={recargar}
          className="gap-2 bg-[#2f302e] text-white hover:bg-[#3a3b38]"
        >
          <RefreshCw className="size-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  const nombre =
    usuario?.nombre?.split(/\s+/)[0] ?? "";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* =====================================================
          CABECERA
          ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[26px]
          border
          border-[#e5e2dc]
          bg-[#fbfaf7]
          px-7
          py-7
          shadow-[0_14px_45px_rgba(41,39,35,0.07)]
          sm:px-8
          sm:py-8
        "
      >
        {/* Línea superior */}
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-[3px]
            bg-linear-to-r
            from-[#343532]
            via-[#c3a464]
            to-[#d8c8a6]
          "
        />

        {/* Luz champagne */}
        <div
          className="
            pointer-events-none
            absolute
            -top-32
            -right-20
            size-80
            rounded-full
            bg-[#d6bd8a]/16
            blur-[100px]
          "
        />

        {/* Luz malva muy sutil */}
        <div
          className="
            pointer-events-none
            -bottom-40
            absolute
            left-[28%]
            size-72
            rounded-full
            bg-[#9b7888]/8
            blur-[110px]
          "
        />

        <div
          className="
            relative
            flex
            flex-col
            gap-7

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Contenido izquierdo */}
          <div className="flex items-start gap-4">
            {/* Icono */}
            <div
              className="
                flex
                size-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#2f302e]
                text-[#d6b66f]
                shadow-[0_8px_24px_rgba(34,34,31,0.16)]
              "
            >
              <LayoutDashboard className="size-5" />
            </div>

            <div>
              {/* Etiqueta */}
              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-[#c3a464]" />

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-[#8c857b]
                  "
                >
                  Vista general
                </p>
              </div>

              {/* Título */}
              <h1
                className="
                  mt-2
                  text-[32px]
                  font-semibold
                  tracking-[-0.045em]
                  text-[#292a28]

                  sm:text-[36px]
                "
              >
                Panel de Control
              </h1>

              {/* Descripción */}
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#7f7b74]">
                {nombre
                  ? `Hola, ${nombre}. Aquí tienes el resumen general del sistema.`
                  : "Resumen general y acceso rápido a los módulos."}
              </p>
            </div>
          </div>

          {/* Botón actualizar */}
          <Button
            variant="outline"
            size="sm"
            onClick={recargar}
            disabled={actualizando}
            className="
              h-10
              gap-2
              self-start
              rounded-xl
              border-[#ddd8cf]
              bg-white
              px-4
              text-xs
              font-medium
              text-[#41413e]

              shadow-[0_4px_14px_rgba(36,35,32,0.05)]

              transition-all
              duration-200

              hover:border-[#c9b98f]
              hover:bg-[#faf7f0]
              hover:text-[#292a28]

              sm:self-auto
            "
          >
            <RefreshCw
              className={`size-3.5 ${
                actualizando
                  ? "animate-spin"
                  : ""
              }`}
            />

            {actualizando
              ? "Actualizando..."
              : "Actualizar datos"}
          </Button>
        </div>

        {/* Detalle inferior */}
        <div className="relative mt-7 flex items-center gap-2">
          <span className="h-[3px] w-9 rounded-full bg-[#c3a464]" />

          <span className="h-[3px] w-3 rounded-full bg-[#9b7888]" />

          <span className="h-[3px] w-1.5 rounded-full bg-[#d17d68]" />
        </div>
      </section>

      {/* =====================================================
          MÉTRICAS
          ===================================================== */}

      <DashboardMetricas
        productos={productos.data?.meta.total ?? 0}
        usuarios={usuarios.data?.meta.total ?? 0}
        stockBajo={metricas.cantidadStockBajo}
        mostrarUsuarios={mostrarUsuarios}
        mostrarInventario={mostrarInventario}
      />

      {/* =====================================================
          GRÁFICAS
          ===================================================== */}

      <DashboardResumen
        agricola={metricas.agricola}
        pecuario={metricas.pecuario}
        general={metricas.general}
        stockBajo={metricas.cantidadStockBajo}
        total={catalogo.length}
        mostrarInventario={mostrarInventario}
      />

      {/* =====================================================
          ACTIVIDAD
          ===================================================== */}

      <DashboardActividad
        recientes={metricas.recientes}
        stockBajo={metricas.stockBajo}
        mostrarInventario={mostrarInventario}
      />
    </div>
  );
}