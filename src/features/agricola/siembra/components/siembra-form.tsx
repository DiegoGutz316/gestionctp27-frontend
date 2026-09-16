"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCamasCultivo } from "@/features/agricola/hooks/cama-cultivo-hooks";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useRegistrarSiembra } from "../hooks/siembra-hooks";
import { fechaHoyLocal, registrarSiembraSchema } from "../models/siembra.model";
import { getMensajeDeError } from "../servicios/siembra.service";

export function SiembraForm() {
  const router = useRouter();
  const camas = useCamasCultivo();
  const registrar = useRegistrarSiembra();
  const camasItems = (camas.data ?? []).map((cama) => ({
    value: String(cama.id),
    label: `${cama.codigo} — ${cama.ubicacion}`,
  }));

  const form = useForm({
    defaultValues: { camaId: "", tipoCultivo: "", fechaSiembra: "", cantidadSembrada: "" },
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
                  <p className="text-sm text-muted-foreground">Debe registrar una cama de cultivo antes de crear una siembra.</p>
                ) : null}
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="tipoCultivo">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>Tipo de cultivo</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: Tomate"
                  maxLength={120}
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
        </div>

        <form.Subscribe selector={(state) => state.isSubmitting || registrar.isPending}>
          {(guardando) => (
            <Button type="submit" disabled={guardando || camasItems.length === 0}>
              {guardando ? "Guardando…" : "Registrar siembra"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
