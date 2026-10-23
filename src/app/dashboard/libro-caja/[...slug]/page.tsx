import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequerirPermiso } from "@/features/auth/components/requerir-permiso";
import { DepartamentoEditar } from "@/features/libro-caja/departamento/components/departamento-editar";
import { AsientosLibro } from "@/features/libro-caja/periodo/components/asientos-libro";
import { InformeEconomico } from "@/features/libro-caja/periodo/components/informe-economico";
import { PeriodoEditar } from "@/features/libro-caja/periodo/components/periodo-editar";

/**
 * Turbopack (Next.js 16) a veces no registra al arrancar las páginas hijas
 * de un segmento dinámico (`periodos/[id]/fondos/[fondoId]`, `.../editar`).
 * Este catch-all sí entra en el árbol inicial y cubre esas URLs.
 */

function idPositivo(valor: string | undefined): number | null {
  if (valor === undefined) return null;
  const n = Number(valor);
  return Number.isInteger(n) && n > 0 ? n : null;
}

type RutaLibroCaja =
  | { tipo: "asientos"; periodoId: number; fondoId: number; title: string }
  | { tipo: "informe"; periodoId: number; fondoId: number; title: string }
  | { tipo: "editar-periodo"; periodoId: number; title: string }
  | { tipo: "editar-departamento"; departamentoId: number; title: string };

function resolverRuta(slug: string[]): RutaLibroCaja | null {
  if (slug.length === 4 && slug[0] === "periodos" && slug[2] === "fondos") {
    const periodoId = idPositivo(slug[1]);
    const fondoId = idPositivo(slug[3]);
    if (periodoId === null || fondoId === null) return null;
    return {
      tipo: "asientos",
      periodoId,
      fondoId,
      title: "Libro de caja | GestiónCTP27",
    };
  }

  if (
    slug.length === 5 &&
    slug[0] === "periodos" &&
    slug[2] === "fondos" &&
    slug[4] === "informe"
  ) {
    const periodoId = idPositivo(slug[1]);
    const fondoId = idPositivo(slug[3]);
    if (periodoId === null || fondoId === null) return null;
    return {
      tipo: "informe",
      periodoId,
      fondoId,
      title: "Informe Económico-UDP | GestiónCTP27",
    };
  }

  if (slug.length === 3 && slug[0] === "periodos" && slug[2] === "editar") {
    const periodoId = idPositivo(slug[1]);
    if (periodoId === null) return null;
    return {
      tipo: "editar-periodo",
      periodoId,
      title: "Editar periodo | Libro de caja | GestiónCTP27",
    };
  }

  if (
    slug.length === 3 &&
    slug[0] === "departamentos" &&
    slug[2] === "editar"
  ) {
    const departamentoId = idPositivo(slug[1]);
    if (departamentoId === null) return null;
    return {
      tipo: "editar-departamento",
      departamentoId,
      title: "Editar departamento | Libro de caja | GestiónCTP27",
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ruta = resolverRuta(slug);
  return { title: ruta?.title ?? "Libro de caja | GestiónCTP27" };
}

export default async function LibroCajaRutaAnidadaPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const ruta = resolverRuta(slug);

  if (!ruta) {
    notFound();
  }

  if (ruta.tipo === "asientos") {
    return <AsientosLibro periodoId={ruta.periodoId} fondoId={ruta.fondoId} />;
  }

  if (ruta.tipo === "informe") {
    return (
      <InformeEconomico periodoId={ruta.periodoId} fondoId={ruta.fondoId} />
    );
  }

  if (ruta.tipo === "editar-periodo") {
    return (
      <RequerirPermiso modulo="LIBRO_CAJA" nivel="COMPLETO">
        <PeriodoEditar id={ruta.periodoId} />
      </RequerirPermiso>
    );
  }

  return (
    <RequerirPermiso modulo="LIBRO_CAJA" nivel="COMPLETO">
      <DepartamentoEditar id={ruta.departamentoId} />
    </RequerirPermiso>
  );
}
