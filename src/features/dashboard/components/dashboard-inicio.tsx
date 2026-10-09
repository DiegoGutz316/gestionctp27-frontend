"use client";

import { useMemo } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";
import { avisosQueryKey } from "@/features/comunicacion/hooks/aviso-hooks";
import { useProductos } from "@/features/inventario/producto/hooks/hooks";
import { esStockBajo } from "@/features/inventario/producto/models/producto.model";
import type { ProductoRespuesta } from "@/features/inventario/producto/validacion/producto.validacion";
import { useUsuarios } from "@/features/usuarios/hooks/hooks";

import { DashboardActividad } from "./dashboard-actividad";
import { DashboardAvisos } from "@/features/comunicacion/components/dashboard-avisos";

import { DashboardCarga } from "./dashboard-carga";
import { DashboardMetricas } from "./dashboard-metricas";
import { DashboardResumen } from "./dashboard-resumen";

export function DashboardInicio() {
  const { puede, usuario } = useAuth();
  const queryClient = useQueryClient();

  const mostrarInventario = puede("INVENTARIO");
  const mostrarUsuarios = puede("USUARIOS");

  // Sin LECTURA sobre REPORTES la consulta de avisos responde 403, así que no
  // se monta: ni al entrar ni al refrescar se pide algo que va a ser negado.
  const mostrarAvisos = puede("REPORTES");

  // Backlog 5.6: los avisos los pide `DashboardAvisos` con su propia consulta,
  // así que el panel no tiene su `refetch` a mano. Se sigue su estado por la
  // clave para que «Actualizar datos» no se declare terminado antes de tiempo.
  const avisosEnCurso = useIsFetching({ queryKey: avisosQueryKey }) > 0;

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
    productos.isFetching || usuarios.isFetching || avisosEnCurso;

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

    // Un aviso lo publica otra persona: es justo lo que puede haber cambiado
    // mientras el panel seguía abierto. Se invalida por clave en lugar de pedir
    // el `refetch` a `DashboardAvisos`, porque así también queda obsoleto el
    // listado completo, que es la otra pantalla que muestra lo mismo.
    if (mostrarAvisos) {
      void queryClient.invalidateQueries({ queryKey: avisosQueryKey });
    }
  }

  if (cargando) {
    return <DashboardCarga />;
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#fff0ed] dark:bg-red-950/40 text-[#c9705a] dark:text-red-300">
          <AlertCircle className="size-6" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#292c2a] dark:text-foreground">
            Error al cargar el panel
          </h2>

          <p className="mt-2 max-w-md text-sm text-[#858985] dark:text-foreground">
            Hubo un problema de comunicación con el servidor.
            Intente nuevamente.
          </p>
        </div>

        <Button
          onClick={recargar}
          className="
            gap-2
            bg-[#7fa36a]
            text-white
            shadow-[0_5px_16px_rgba(127,163,106,0.22)]
            hover:bg-[#6f935e]
          "
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
          border-[#e5e2dc] dark:border-border
          bg-[#fbfaf7] dark:bg-muted
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
            from-[#7fa36a]
            via-[#d6a36c]
            to-[#ad8fa3]
          "
        />

        {/* Luz verde suave */}
        <div
          className="
            pointer-events-none
            absolute
            -top-32
            -right-20
            size-80
            rounded-full
            bg-[#a8be8e]/16
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
            bg-[#ad8fa3]/10
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
                size-14
                items-center
                justify-center
                rounded-2xl
                border
                border-[#d8e5d0] dark:border-border
                bg-[#edf4e9] dark:bg-secondary
                text-[#6f935e] dark:text-primary
                shadow-[0_12px_30px_rgba(111,147,94,0.16)]">

              <LayoutDashboard className="size-6" />
            </div>

            <div>
              {/* Etiqueta */}
              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-[#7fa36a]" />

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-[#8c857b] dark:text-foreground
                  "
                >
                  Vista general
                </p>
              </div>

              {/* Título */}
              <h1
                className="
                  mt-3
                  text-[40px]
                  font-semibold
                  leading-[1]
                  tracking-[-0.055em]
                  text-[#292a28] dark:text-foreground
                  sm:text-[46px]
                "
              >
                Panel de Control
              </h1>

              {/* Descripción */}
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#7f7b74] dark:text-foreground">
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
              border-[#d7dfd1] dark:border-border
              bg-white dark:bg-card
              px-4
              text-xs
              font-medium
              text-[#4d5948] dark:text-primary

              shadow-[0_4px_14px_rgba(36,35,32,0.05)]

              transition-all
              duration-200

              hover:border-[#a8be8e]
              hover:bg-[#f4f8f1] dark:hover:bg-accent
              hover:text-[#5f7f50] dark:hover:text-primary

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
        <div className="mt-8 flex items-center gap-2">
        <span className="h-1 w-14 rounded-full bg-[#7fa36a]" />
        <span className="h-1 w-7 rounded-full bg-[#d6a36c]" />
        <span className="h-1 w-4 rounded-full bg-[#ad8fa3]" />
      </div>
      </section>

      {/* =====================================================
          AVISOS INSTITUCIONALES (Backlog 5.6)
          ===================================================== */}

      {mostrarAvisos ? <DashboardAvisos /> : null}

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