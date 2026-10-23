"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCamasCultivo } from "@/features/agricola/hooks/cama-cultivo-hooks";
import { useCultivos } from "@/features/agricola/cultivo/hooks/cultivo-hooks";
import { ETIQUETA_TIPO_CULTIVO } from "@/features/agricola/cultivo/models/cultivo.model";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useRegistrarSiembra } from "../hooks/siembra-hooks";
import {
  ETIQUETA_UNIDAD_SIEMBRA,
  UNIDADES_SIEMBRA,
  fechaHoyLocal,
  registrarSiembraSchema,
  type UnidadSiembra,
} from "../models/siembra.model";
import { getMensajeDeError } from "../servicios/siembra.service";

export function SiembraForm() {
  const router = useRouter();
  const camas = useCamasCultivo();
  const registrar = useRegistrarSiembra();
  const camasDisponibles = (camas.data ?? []).filter(
    (cama) => cama.estado === "DISPONIBLE",
  );
  const camasItems = camasDisponibles.map((cama) => ({
    value: String(cama.id),
    label: `${/^cama\b/i.test(cama.codigo.trim()) ? cama.codigo.trim() : `Cama ${cama.codigo.trim()}`} — ${cama.ubicacion}`,
  }));

  // Solo los activos: un cultivo desactivado no debe poder sembrarse.
  const cultivos = useCultivos({ soloActivos: true });
  const cultivosItems = (cultivos.data ?? []).map((cultivo) => ({
    value: String(cultivo.id),
    label: `${cultivo.nombre} · ${ETIQUETA_TIPO_CULTIVO[cultivo.tipo]}`,
  }));

  const unidadesItems = UNIDADES_SIEMBRA.map((unidad) => ({
    value: unidad,
    label: ETIQUETA_UNIDAD_SIEMBRA[unidad],
  }));

  const form = useForm({
    defaultValues: {
      camaId: "",
      cultivoId: "",
      fechaSiembra: "",
      cantidadSembrada: "",
      unidadSembrada: "UNIDADES" as UnidadSiembra,
    },
    validators: { onSubmit: zodValidator(registrarSiembraSchema) },
    onSubmit: async ({ value }) => {
      try {
        await registrar.mutateAsync(registrarSiembraSchema.parse(value));
        toast.success("Siembra registrada correctamente.");
        router.push("/dashboard/agricola/siembras");
      } catch (error) {
        toast.error(getMensajeDeError(error));
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      noValidate
    >
      <FieldGroup>
        <form.Field name="camaId">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>Cama de cultivo</FieldLabel>
                <Select
                  items={camasItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) => field.handleChange((valor as string | null) ?? "")}
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                    disabled={camas.isLoading || camasItems.length === 0}
                  >
                    <SelectValue placeholder={camas.isLoading ? "Cargando camas…" : "Seleccione una cama"} />
                  </SelectTrigger>
                  <SelectContent>
                    {camasItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {camas.isError ? <p className="text-sm text-destructive">No se pudieron cargar las camas de cultivo.</p> : null}
                {!camas.isLoading && !camas.isError && camasItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay camas disponibles. Registre una cama o finalice la siembra que la ocupa.</p>
                ) : null}
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="cultivoId">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>Cultivo</FieldLabel>
                <Select
                  items={cultivosItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) => field.handleChange((valor as string | null) ?? "")}
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                    disabled={cultivos.isPending || cultivosItems.length === 0}
                  >
                    <SelectValue placeholder={cultivos.isPending ? "Cargando cultivos…" : "Seleccione un cultivo"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cultivosItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {cultivos.isError ? (
                  <p className="text-sm text-destructive">No se pudieron cargar los cultivos registrados.</p>
                ) : null}
                {!cultivos.isPending && !cultivos.isError && cultivosItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay cultivos registrados.{" "}
                    <Link href="/dashboard/agricola/cultivos/nuevo" className="underline underline-offset-4">
                      Registre uno primero
                    </Link>
                    .
                  </p>
                ) : null}
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="fechaSiembra">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>Fecha de siembra</FieldLabel>
                  <Input
                    id={field.name}
                    type="date"
                    max={fechaHoyLocal()}
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="cantidadSembrada">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>Cantidad sembrada</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    min="0.01"
                    max="9999999999.99"
                    step="0.01"
                    placeholder="Ej: 50"
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="unidadSembrada">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Unidad
                  </FieldLabel>
                  <Select
                    items={unidadesItems}
                    value={field.state.value}
                    onValueChange={(valor) =>
                      field.handleChange(
                        ((valor as string | null) ?? "UNIDADES") as UnidadSiembra,
                      )
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={invalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue placeholder="Seleccione una unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidadesItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => state.isSubmitting || registrar.isPending}>
          {(guardando) => (
            <Button type="submit" disabled={guardando || camasItems.length === 0 || cultivosItems.length === 0}>
              {guardando ? "Guardando…" : "Registrar siembra"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
