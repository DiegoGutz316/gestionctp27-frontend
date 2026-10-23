"use client";

import Link from "next/link";
import { Ban, Eye, ImageIcon, Megaphone, Pencil } from "lucide-react";

import { AccionesMenu } from "@/components/acciones-menu";
import { MostrarSiPuede } from "@/features/auth/components/mostrar-si-puede";
import { formatearFecha } from "@/features/agricola/siembra/models/siembra.model";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatearFechaPublicacion } from "../fecha-aviso";
import { useSrcFlyer } from "../hooks/aviso-hooks";
import {
  ETIQUETA_CATEGORIA_AVISO,
  ETIQUETA_ESTADO_AVISO,
  type AvisoRespuesta,
} from "../validacion/aviso.validacion";

type Props = {
  cargando: boolean;
  mensajeError: string | null;
  avisos: AvisoRespuesta[];
  sinResultadosPorFiltro: boolean;
  onDesactivar: (aviso: AvisoRespuesta) => void;
};

export function AvisosTabla({
  cargando,
  mensajeError,
  avisos,
  sinResultadosPorFiltro,
  onDesactivar,
}: Props) {
  if (cargando) {
    return (
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="space-y-3 p-4">
          {Array.from({ length: 4 }).map((_, indice) => (
            <Skeleton key={`aviso-esqueleto-${indice}`} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (mensajeError && avisos.length === 0) {
    return (
      <div className="rounded-xl border bg-card px-6 py-10 text-center text-sm text-destructive shadow-sm">
        {mensajeError}
      </div>
    );
  }

  if (avisos.length === 0 && sinResultadosPorFiltro) {
    return (
      <div className="rounded-xl border bg-card px-6 py-10 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          No se encontraron avisos con los filtros seleccionados
        </p>
      </div>
    );
  }

  if (avisos.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border bg-card px-6 py-10 text-center shadow-sm">
        <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Megaphone className="size-5" />
        </div>
        <p className="mt-3 text-sm font-medium">Aún no hay avisos institucionales</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Publica tu primer aviso para mantener informada a la comunidad educativa
        </p>
        <MostrarSiPuede modulo="REPORTES" nivel="COMPLETO">
          <Button
            className="mt-4"
            nativeButton={false}
            render={<Link href="/dashboard/comunicacion/avisos/nuevo" />}
          >
            Publicar primer aviso
          </Button>
        </MostrarSiPuede>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {mensajeError ? (
        <p className="border-b bg-destructive/5 px-4 py-2 text-sm text-destructive">
          No se pudo actualizar la lista ({mensajeError}). Se muestran los
          últimos avisos cargados.
        </p>
      ) : null}

      <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="hidden w-16 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:table-cell">
                Flyer
              </TableHead>
              <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Título
              </TableHead>
              <TableHead className="hidden py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:table-cell">
                Categoría
              </TableHead>
              <TableHead className="hidden py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:table-cell">
                Fecha del aviso
              </TableHead>
              <TableHead className="hidden py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:table-cell">
                Fecha de publicación
              </TableHead>
              <TableHead className="py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Estado
              </TableHead>
              <TableHead className="w-[1%] py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {avisos.map((aviso) => (
              <TableRow key={aviso.id}>
                <TableCell className="hidden md:table-cell">
                  <Miniatura aviso={aviso} />
                </TableCell>
                <TableCell className="max-w-xs whitespace-normal">
                  <Link
                    href={`/dashboard/comunicacion/avisos/${aviso.id}`}
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    {aviso.titulo}
                  </Link>
                  <p className="mt-0.5 line-clamp-1 hidden text-xs text-muted-foreground md:block">
                    {aviso.descripcion}
                  </p>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant="secondary"
                    className="bg-muted font-normal text-muted-foreground"
                  >
                    {aviso.categoria
                      ? ETIQUETA_CATEGORIA_AVISO[aviso.categoria]
                      : "Sin categoría"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                  {formatearFecha(aviso.fecha)}
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-muted-foreground md:table-cell">
                  {aviso.creadoEn
                    ? formatearFechaPublicacion(aviso.creadoEn)
                    : "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      aviso.estado === "ACTIVO"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {ETIQUETA_ESTADO_AVISO[aviso.estado]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <AccionesMenu aria-label={`Acciones de ${aviso.titulo}`}>
                    <DropdownMenuItem
                      render={
                        <Link href={`/dashboard/comunicacion/avisos/${aviso.id}`} />
                      }
                    >
                      <Eye />
                      Ver detalle
                    </DropdownMenuItem>

                    <MostrarSiPuede modulo="REPORTES" nivel="COMPLETO">
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/dashboard/comunicacion/avisos/${aviso.id}/editar`}
                          />
                        }
                      >
                        <Pencil />
                        Editar
                      </DropdownMenuItem>

                      {aviso.estado === "ACTIVO" ? (
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDesactivar(aviso)}
                        >
                          <Ban />
                          Desactivar
                        </DropdownMenuItem>
                      ) : null}
                    </MostrarSiPuede>
                  </AccionesMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
      </Table>
    </div>
  );
}

function Miniatura({ aviso }: { aviso: AvisoRespuesta }) {
  const src = useSrcFlyer(aviso.tieneFlyer ? aviso : null);

  if (!src) {
    return (
      <span className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <ImageIcon className="size-4" />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="size-10 rounded-md border bg-muted object-contain"
    />
  );
}
