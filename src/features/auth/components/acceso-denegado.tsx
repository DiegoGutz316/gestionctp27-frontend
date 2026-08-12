import Link from "next/link";
import { ShieldAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ETIQUETA_MODULO,
  type ModuloSistema,
} from "../models/permisos.model";

/**
 * Backlog 1.6 - Task: "Mostrar mensaje de acceso denegado cuando corresponda".
 *
 * Se muestra cuando el rol de la sesión no alcanza el permiso del módulo. El
 * backend rechaza igual la petición con 403; esto es la versión legible del
 * mismo control.
 */
export function AccesoDenegado({
  modulo,
  detalle,
}: {
  modulo?: ModuloSistema;
  detalle?: string;
}) {
  const mensaje =
    detalle ??
    (modulo
      ? `Su rol no tiene acceso a ${ETIQUETA_MODULO[modulo]}.`
      : "Su rol no tiene permiso para ver esta sección.");

  return (
    <section
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/30 p-10 text-center"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlertIcon className="size-6" strokeWidth={1.75} />
      </div>
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">Acceso denegado</h1>
        <p className="max-w-md text-sm text-muted-foreground">{mensaje}</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Si necesita este acceso, solicítelo al administrador del sistema.
        </p>
      </div>
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/dashboard" />}
      >
        Volver al panel principal
      </Button>
    </section>
  );
}
