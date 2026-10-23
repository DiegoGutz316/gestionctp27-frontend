"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSiembras } from "@/features/agricola/siembra/hooks/siembra-hooks";
import { formatearFecha as formatearFechaSiembra } from "@/features/agricola/siembra/models/siembra.model";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useRegistrarTratamiento } from "../hooks/tratamiento-hooks";
import {
  ETIQUETA_TIPO_TRATAMIENTO,
  ETIQUETA_UNIDAD_TRATAMIENTO,
  fechaHoyLocal,
  nombreDeCama,
  ACTIVIDADES_AGRICOLAS,
  ETIQUETA_ACTIVIDAD,
  cuidadoSchema,
  usaProducto,
  TIPOS_TRATAMIENTO,
  UNIDADES_TRATAMIENTO,
} from "../models/tratamiento.model";
import { getMensajeDeError } from "../servicios/tratamiento.service";

export function TratamientoForm() {
  const router = useRouter();
  const siembras = useSiembras();
  const registrar = useRegistrarTratamiento();

  const activas = useMemo(
    () => (siembras.data ?? []).filter((siembra) => !siembra.finalizadaEn),
    [siembras.data],
  );

  /**
   * Una cama puede tener más de una siembra activa, así que la lista de
   * siembras trae camas repetidas: el desplegable mostraba la misma cama dos
   * veces y React avisaba de claves duplicadas. Se agrupan por id conservando
   * el orden en que aparecen.
   */
  const camasUnicas = [
    ...new Map(activas.map((siembra) => [siembra.cama.id, siembra.cama])).values(),
  ];

  const camasItems = camasUnicas.map((cama) => ({
    value: String(cama.id),
    label: `${nombreDeCama(cama.codigo)} — ${cama.ubicacion}`,
  }));

  const tiposItems = TIPOS_TRATAMIENTO.map((valor) => ({
    value: valor,
    label: ETIQUETA_TIPO_TRATAMIENTO[valor],
  }));

  const unidadesItems = UNIDADES_TRATAMIENTO.map((valor) => ({
    value: valor,
    label: ETIQUETA_UNIDAD_TRATAMIENTO[valor],
  }));

  const siembraDeCama = (camaId: string) =>
    activas.find((siembra) => String(siembra.cama.id) === camaId);

  /**
   * Un riego o una limpieza no llevan producto: los campos quedan vacios en
   * el formulario y aqui se quitan, porque el backend rechaza que vengan.
   */
  const actividadesItems = ACTIVIDADES_AGRICOLAS.map((actividad) => ({
    value: actividad,
    label: ETIQUETA_ACTIVIDAD[actividad],
  }));

  const limpiarSegunActividad = (valor: Record<string, string>) => {
    const comun = {
      siembraId: valor.siembraId,
      actividad: valor.actividad,
      fecha: valor.fecha,
      observaciones: valor.observaciones?.trim() ? valor.observaciones : undefined,
    };

    return usaProducto(valor.actividad)
      ? {
          ...comun,
          tipo: valor.tipo === "" ? undefined : valor.tipo,
          producto: valor.producto === "" ? undefined : valor.producto,
          cantidad: valor.cantidad === "" ? undefined : valor.cantidad,
          unidad: valor.unidad === "" ? undefined : valor.unidad,
        }
      : comun;
  };

  const form = useForm({
    defaultValues: {
      camaId: "",
      siembraId: "",
      actividad: "",
      tipo: "",
      producto: "",
      fecha: "",
      cantidad: "",
      unidad: "",
      observaciones: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const errores = zodValidator(cuidadoSchema)({ value: limpiarSegunActividad(value) });
        if (errores) return errores;

        const siembra = siembraDeCama(value.camaId);

        if (siembra && value.fecha < siembra.fechaSiembra) {
          return {
            fields: {
              fecha: `El tratamiento no puede ser anterior a la siembra (${formatearFechaSiembra(siembra.fechaSiembra)}).`,
            },
          };
        }

        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        const datos = cuidadoSchema.parse(limpiarSegunActividad(value));
        await registrar.mutateAsync(datos);
        toast.success("Cuidado registrado correctamente.");
        router.push("/dashboard/agricola/tratamientos");
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
            const siembra = siembraDeCama(field.state.value);

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Cama de cultivo
                </FieldLabel>
                <Select
                  items={camasItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) => {
                    const cama = (valor as string | null) ?? "";
                    field.handleChange(cama);
                    const activa = siembraDeCama(cama);
                    form.setFieldValue("siembraId", activa ? String(activa.id) : "");
                  }}
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                    disabled={siembras.isLoading || camasItems.length === 0}
                  >
                    <SelectValue
                      placeholder={
                        siembras.isLoading
                          ? "Cargando camas…"
                          : "Seleccione una cama"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {camasItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {siembras.isError ? (
                  <p className="text-sm text-destructive">
                    No se pudieron cargar las camas.
                  </p>
                ) : null}
                {!siembras.isLoading && !siembras.isError && camasItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay camas con una siembra activa. Registre una siembra
                    antes de aplicar un tratamiento.
                  </p>
                ) : null}
                <form.Field name="siembraId">
                  {(siembraField) => (
                    <FieldError
                      errors={fieldErrors(siembraField.state.meta.errors)}
                    />
                  )}
                </form.Field>
                <FieldError errors={errors} />

                <div className="space-y-2">
                  <FieldLabel>Ubicación</FieldLabel>
                  <Input readOnly value={siembra?.cama.ubicacion ?? "—"} />
                </div>
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="actividad">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Actividad
                </FieldLabel>
                <Select
                  items={actividadesItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange((valor as string | null) ?? "")
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue placeholder="¿Qué se hizo?" />
                  </SelectTrigger>
                  <SelectContent>
                    {actividadesItems.map((item) => (
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

        {/* El producto solo aparece en las labores que lo gastan. */}
        <form.Subscribe selector={(estado) => estado.values.actividad}>
          {(actividad) =>
            usaProducto(actividad) ? (
              <>
        <form.Field name="tipo">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Tipo de tratamiento
                </FieldLabel>
                <Select
                  items={tiposItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange((valor as string | null) ?? "")
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposItems.map((item) => (
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

        <form.Field name="producto">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Producto/Insumo aplicado
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: Fertilizante NPK 10-30-10"
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
              </>
            ) : null
          }
        </form.Subscribe>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Cantidad y unidad solo cuando se aplica un producto. */}
          <form.Subscribe selector={(estado) => estado.values.actividad}>
            {(actividad) =>
              usaProducto(actividad) ? (
                <>
          <form.Field name="cantidad">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Cantidad
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    min="0.01"
                    max="9999999999.99"
                    step="0.01"
                    placeholder="Ej: 2.5"
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

          <form.Field name="unidad">
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
                    value={field.state.value === "" ? null : field.state.value}
                    onValueChange={(valor) =>
                      field.handleChange((valor as string | null) ?? "")
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={invalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue placeholder="Unidad" />
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
                </>
              ) : null
            }
          </form.Subscribe>



          <form.Field name="fecha">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Fecha de aplicación
                  </FieldLabel>
                  <form.Subscribe selector={(estado) => estado.values.camaId}>
                    {(camaId) => (
                      <Input
                        id={field.name}
                        type="date"
                        min={siembraDeCama(camaId)?.fechaSiembra}
                        max={fechaHoyLocal()}
                        aria-invalid={invalid}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                      />
                    )}
                  </form.Subscribe>
                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="observaciones">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Observaciones</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: Aplicado después del riego"
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

        <form.Subscribe
          selector={(state) => state.isSubmitting || registrar.isPending}
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando || camasItems.length === 0}>
              {guardando ? "Guardando…" : "Registrar tratamiento"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
