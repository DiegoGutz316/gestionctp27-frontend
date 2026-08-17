import Link from "next/link";
import { ArrowRight, Boxes, PackageMinus } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  if (Number.isNaN(fecha.getTime())) return "—";
  return fecha.toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DashboardActividad({
  recientes,
  stockBajo,
  mostrarInventario,
}: DashboardActividadProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between border-b py-4">
          <div>
            <CardTitle className="text-base font-semibold">
              Productos recientes
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Últimos registros agregados al inventario
            </CardDescription>
          </div>
          <Link href="/dashboard/inventario">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-color-company"
            >
              Ver todos
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {!mostrarInventario || recientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <Boxes className="size-8 text-muted-foreground/30" />
              <p className="text-sm font-medium">
                {mostrarInventario
                  ? "No hay productos registrados"
                  : "Sin acceso al inventario"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/10">
                    <TableHead className="px-4 py-3 text-xs font-medium uppercase">
                      Producto
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs font-medium uppercase">
                      Área
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs font-medium uppercase">
                      Fecha
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recientes.map((producto) => (
                    <TableRow
                      key={producto.id}
                      className="transition-colors hover:bg-muted/20"
                    >
                      <TableCell className="px-4 py-3">
                        <Link
                          href={`/dashboard/inventario/${producto.id}`}
                          className="block"
                        >
                          <div className="max-w-[180px] truncate text-sm font-medium text-foreground">
                            {producto.nombre}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {ETIQUETA_TIPO_PRODUCTO[producto.tipoProducto]}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                        {ETIQUETA_DEPARTAMENTO[producto.departamento]}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground capitalize">
                        {fechaCorta(producto.creadoEn)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between border-b py-4">
          <div>
            <CardTitle className="text-base font-semibold">
              Alertas de reposición
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Productos en o bajo el stock mínimo
            </CardDescription>
          </div>
          <Link href="/dashboard/inventario">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-color-company"
            >
              Ver todos
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {!mostrarInventario || stockBajo.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <PackageMinus className="size-8 text-muted-foreground/30" />
              <p className="text-sm font-medium text-emerald-800">
                {mostrarInventario
                  ? "No hay alertas activas"
                  : "Sin acceso al inventario"}
              </p>
              {mostrarInventario ? (
                <p className="text-xs text-muted-foreground">
                  Las existencias están por encima del mínimo.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/10">
                    <TableHead className="px-4 py-3 text-xs font-medium uppercase">
                      Producto
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs font-medium uppercase">
                      Existencia
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs font-medium uppercase">
                      Estado
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockBajo.map((producto) => {
                    const cantidad = producto.stock?.cantidad ?? 0;
                    const minimo = producto.stock?.stockMinimo ?? 0;
                    return (
                      <TableRow
                        key={producto.id}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <TableCell className="px-4 py-3">
                          <Link
                            href={`/dashboard/inventario/${producto.id}`}
                            className="block max-w-[180px] truncate text-sm font-medium"
                          >
                            {producto.nombre}
                          </Link>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-xs tabular-nums text-muted-foreground">
                          {cantidad} / {minimo}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className="border-amber-200 bg-amber-50 px-2 py-0 text-[10px] text-amber-800"
                          >
                            Reponer
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
