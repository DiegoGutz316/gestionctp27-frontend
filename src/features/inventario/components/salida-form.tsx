"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { registrarSalidaSchema } from "../validacion/inventario.validacion";
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
import { useInsumos, useRegistrarSalida } from "../hooks";

/** Fecha de hoy en formato AAAA-MM-DD, en la zona horaria del navegador. */
function hoy(): string {
  const ahora = new Date();
  const desfase = ahora.getTimezoneOffset() * 60_000;
  return new Date(ahora.getTime() - desfase).toISOString().slice(0, 10);
}

export function SalidaForm() {
  const router = useRouter();
  const insumos = useInsumos();
  const registrarSalida = useRegistrarSalida();

  const form = useForm({
    defaultValues: {
      insumoId: "" as string | number,
      cantidad: "" as string | number,
      fecha: hoy(),
      motivo: "",
    },
    validators: {
      onSubmit: zodValidator(registrarSalidaSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const movimiento = await registrarSalida.mutateAsync(
          registrarSalidaSchema.parse(value),
        );
        toast.success(
          `Salida registrada. "${movimiento.insumo.nombre}" quedó en ${movimiento.insumo.cantidad} ${movimiento.insumo.unidadMedida}.`,
        );
        router.push("/dashboard/inventario/movimientos");
      } catch (error) {
        // Incluye el rechazo del backend por existencia insuficiente, que es la
        // comprobación que vale: entre que se cargó esta pantalla y se envió,
        // otra persona pudo haber sacado material.
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
                {/* Task del backlog: "mostrar cantidad disponible antes de
                registrar la salida". */}
                {seleccionado && (
                  <FieldDescription
                    className={
                      seleccionado.cantidad <= 0 ? "text-destructive" : undefined
                    }
                  >
                    {seleccionado.cantidad > 0
                      ? `Existencia disponible: ${seleccionado.cantidad} ${seleccionado.unidadMedida}.`
                      : "Este insumo no tiene existencia disponible."}
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

            // Aviso temprano con el stock que tiene cargado la pantalla. No
            // sustituye a la validación del servidor, solo evita enviar algo
            // que ya se sabe que va a fallar.
            const insumoId = form.state.values.insumoId;
            const seleccionado = (insumos.data ?? []).find(
              (insumo) => String(insumo.id) === String(insumoId),
            );
            const pedida = Number(field.state.value);
            const excede =
              !!seleccionado &&
              Number.isFinite(pedida) &&
              pedida > seleccionado.cantidad;

            return (
              <Field data-invalid={invalid || excede}>
                <FieldLabel htmlFor={field.name}>Cantidad que sale</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  min={0}
                  max={seleccionado?.cantidad}
                  placeholder="Ej: 5"
                  aria-invalid={invalid || excede}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {excede ? (
                  <FieldDescription className="text-destructive">
                    Supera la existencia disponible ({seleccionado.cantidad}{" "}
                    {seleccionado.unidadMedida}).
                  </FieldDescription>
                ) : (
                  <FieldDescription>
                    Se restará de la existencia actual del insumo.
                  </FieldDescription>
                )}
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
                <FieldLabel htmlFor={field.name}>Fecha de la salida</FieldLabel>
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

        <form.Field name="motivo">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Motivo</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: Alimentación de cerdos, siembra de la cama 3…"
                  maxLength={200}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldDescription>
                  Para qué se usaron los insumos. Queda en el historial.
                </FieldDescription>
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe
          selector={(state) => state.isSubmitting || registrarSalida.isPending}
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar salida"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
