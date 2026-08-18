"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { registrarEntradaSchema } from "../validacion/inventario.validacion";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";
import { getMensajeDeError } from "../api";
import { useInsumos, useRegistrarEntrada } from "../hooks";

/** Fecha de hoy en formato AAAA-MM-DD, en la zona horaria del navegador. */
function hoy(): string {
  const ahora = new Date();
  const desfase = ahora.getTimezoneOffset() * 60_000;
  return new Date(ahora.getTime() - desfase).toISOString().slice(0, 10);
}

export function EntradaForm() {
  const router = useRouter();
  const insumos = useInsumos();
  const registrarEntrada = useRegistrarEntrada();

  const form = useForm({
    defaultValues: {
      insumoId: "" as string | number,
      cantidad: "" as string | number,
      fecha: hoy(),
      origen: "",
    },
    validators: {
      onSubmit: zodValidator(registrarEntradaSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const movimiento = await registrarEntrada.mutateAsync(
          registrarEntradaSchema.parse(value),
        );
        toast.success(
          `Entrada registrada. "${movimiento.insumo.nombre}" quedó en ${movimiento.insumo.cantidad} ${movimiento.insumo.unidadMedida}.`,
        );
        router.push("/dashboard/inventario/movimientos");
      } catch (error) {
        toast.error(getMensajeDeError(error));
      }
    },
  });

  const insumosItems = (insumos.data ?? []).map((insumo) => ({
    value: String(insumo.id),
    label: `${insumo.nombre} (${insumo.categoria.nombre})`,
  }));

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
        <form.Field name="insumoId">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            // Se muestra la existencia actual para que quien registra pueda
            // confirmar el resultado esperado antes de guardar.
            const seleccionado = (insumos.data ?? []).find(
              (insumo) => String(insumo.id) === String(field.state.value),
            );

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor="insumo">Insumo</FieldLabel>
                <Select
                  items={insumosItems}
                  value={
                    field.state.value === "" ? null : String(field.state.value)
                  }
                  onValueChange={(valor) => field.handleChange(valor ?? "")}
                  disabled={insumos.isLoading || insumos.isError}
                >
                  <SelectTrigger
                    id="insumo"
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue
                      placeholder={
                        insumos.isLoading
                          ? "Cargando insumos…"
                          : "Seleccione un insumo"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {insumosItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {seleccionado && (
                  <FieldDescription>
                    Existencia actual: {seleccionado.cantidad}{" "}
                    {seleccionado.unidadMedida}.
                  </FieldDescription>
                )}
                {insumos.isError && (
                  <FieldDescription className="text-destructive">
                    No se pudieron cargar los insumos. Verifique la conexión con
                    el servidor.
                  </FieldDescription>
                )}
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="cantidad">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Cantidad que ingresa</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="Ej: 25"
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldDescription>
                  Se sumará a la existencia actual del insumo.
                </FieldDescription>
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="fecha">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Fecha de la entrada</FieldLabel>
                <Input
                  id={field.name}
                  type="date"
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

        <form.Field name="origen">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Origen (opcional)</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: Compra, donación, proveedor…"
                  maxLength={150}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldDescription>
                  De dónde provienen los insumos. Queda en el historial.
                </FieldDescription>
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe
          selector={(state) => state.isSubmitting || registrarEntrada.isPending}
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar entrada"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
