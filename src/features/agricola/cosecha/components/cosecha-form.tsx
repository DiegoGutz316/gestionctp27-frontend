"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSiembras } from "@/features/agricola/siembra/hooks/siembra-hooks";
import { formatearFecha as formatearFechaSiembra } from "@/features/agricola/siembra/models/siembra.model";
import { fechaHoyCR } from "@/lib/fechas";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useRegistrarCosecha } from "../hooks/cosecha-hooks";
import {
  ETIQUETA_UNIDAD_MEDIDA,
  formatearCantidadConUnidad,
  registrarCosechaSchema,
  UNIDADES_MEDIDA,
} from "../models/cosecha.model";
import { getMensajeDeError } from "../servicios/cosecha.service";

export function CosechaForm() {
  const router = useRouter();
  const params = useSearchParams();
  const siembraFija = params.get("siembraId") ?? "";
  // Llegar desde «Finalizar siembra» deja la opción marcada de entrada; desde
  // el camino normal arranca sin marcar y la decide quien registra.
  const cerrarPorDefecto = params.get("cerrarCiclo") === "1";

  const siembras = useSiembras();
  const registrar = useRegistrarCosecha();

  const lista = siembras.data ?? [];
  const activas = lista.filter((siembra) => !siembra.finalizadaEn);

  const siembrasItems = activas.map((siembra) => ({
    value: String(siembra.id),
    label: `${siembra.tipoCultivo} — ${siembra.cama.codigo} — ${formatearFechaSiembra(
      siembra.fechaSiembra,
    )}`,
  }));

  const unidadesItems = UNIDADES_MEDIDA.map((unidad) => ({
    value: unidad,
    label: ETIQUETA_UNIDAD_MEDIDA[unidad],
  }));

  const siembraDe = (siembraId: string) =>
    lista.find((siembra) => String(siembra.id) === siembraId);

  // Un fallo de red también deja la lista vacía. Si no se distinguen, la
  // pantalla diría que no hay siembras cuando el problema es del servidor.
  const cargaFallo = siembras.isError;

  const sinSiembras = !siembras.isLoading && !cargaFallo && activas.length === 0;

  const sinSeleccionPosible = siembras.isLoading || cargaFallo || sinSiembras;

  const form = useForm({
    defaultValues: {
      siembraId: siembraFija,
      fecha: "",
      cantidadObtenida: "",
      unidadMedida: "KG" as (typeof UNIDADES_MEDIDA)[number],
      observaciones: "",
      cerrarCiclo: cerrarPorDefecto,
    },

    validators: {
      onSubmit: ({ value }) => {
        const errores = zodValidator(registrarCosechaSchema)({ value });

        if (errores) return errores;

        // El esquema no puede comprobarlo por su cuenta: el mínimo depende de
        // la siembra elegida. Es el criterio que dice que la fecha de cosecha
        // no puede ser anterior a la de siembra, y el backend lo valida igual.
        const siembra = siembraDe(value.siembraId);

        if (siembra && value.fecha < siembra.fechaSiembra) {
          return {
            fields: {
              fecha: `La cosecha no puede ser anterior a la siembra (${formatearFechaSiembra(
                siembra.fechaSiembra,
              )}).`,
            },
          };
        }

        return undefined;
      },
    },

    onSubmit: async ({ value }) => {
      try {
        const datos = registrarCosechaSchema.parse(value);

        const cosecha = await registrar.mutateAsync({
          ...datos,
          cerrarCiclo: value.cerrarCiclo,
        });

        toast.success(
          value.cerrarCiclo
            ? `Cosecha registrada y ciclo finalizado. La cama volvió a estar disponible.`
            : `Cosecha de ${cosecha.siembra.tipoCultivo} registrada: ${formatearCantidadConUnidad(
                cosecha.cantidadObtenida,
                cosecha.unidadMedida,
              )}.`,
        );

        router.push("/dashboard/agricola/cosechas");
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
        {siembraFija && siembraDe(siembraFija) ? (
          <div className="grid gap-3 rounded-lg border bg-muted/30 p-3 text-sm sm:grid-cols-2">
            <p>
              <span className="block text-muted-foreground">Cultivo</span>
              <span className="font-medium">{siembraDe(siembraFija)?.tipoCultivo}</span>
            </p>
            <p>
              <span className="block text-muted-foreground">Cama de cultivo</span>
              <span className="font-medium">{siembraDe(siembraFija)?.cama.codigo}</span>
            </p>
            <p>
              <span className="block text-muted-foreground">Ubicación</span>
              <span className="font-medium">{siembraDe(siembraFija)?.cama.ubicacion}</span>
            </p>
            <p>
              <span className="block text-muted-foreground">Fecha de siembra</span>
              <span className="font-medium">
                {formatearFechaSiembra(siembraDe(siembraFija)?.fechaSiembra ?? "")}
              </span>
            </p>
          </div>
        ) : null}

        {!siembraFija ? (
        <form.Field name="siembraId">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Siembra
                </FieldLabel>

                <Select
                  items={siembrasItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange((valor as string | null) ?? "")
                  }
                  disabled={sinSeleccionPosible}
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue
                      placeholder={
                        siembras.isLoading
                          ? "Cargando siembras…"
                          : cargaFallo
                            ? "No se pudo cargar"
                            : "Seleccione una siembra"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {siembrasItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {sinSiembras ? (
                  <p className="text-sm text-muted-foreground">
                    No hay siembras activas.
                  </p>
                ) : null}

                {cargaFallo ? (
                  <p className="text-sm text-destructive">
                    {getMensajeDeError(siembras.error)}
                  </p>
                ) : null}

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-3">
          <form.Field name="fecha">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Fecha de cosecha
                  </FieldLabel>

                  <form.Subscribe
                    selector={(estado) => estado.values.siembraId}
                  >
                    {(siembraId) => (
                      <Input
                        id={field.name}
                        type="date"
                        min={siembraDe(siembraId)?.fechaSiembra}
                        max={fechaHoyCR()}
                        aria-invalid={invalid}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                    )}
                  </form.Subscribe>

                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="cantidadObtenida">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Cantidad obtenida
                  </FieldLabel>

                  {/* El campo se adapta a la unidad elegida: en unidades no
                      tiene sentido ofrecer el teclado decimal. */}
                  <form.Subscribe
                    selector={(estado) => estado.values.unidadMedida}
                  >
                    {(unidad) => (
                      <>
                        <Input
                          id={field.name}
                          inputMode={
                            unidad === "UNIDADES" ? "numeric" : "decimal"
                          }
                          placeholder={
                            unidad === "UNIDADES" ? "Ej: 120" : "Ej: 12.5"
                          }
                          aria-invalid={invalid}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />

                        {!invalid ? (
                          <p className="text-xs text-muted-foreground">
                            {unidad === "UNIDADES"
                              ? "Solo números enteros."
                              : "Admite hasta 2 decimales."}
                          </p>
                        ) : null}
                      </>
                    )}
                  </form.Subscribe>

                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="unidadMedida">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Unidad de medida
                  </FieldLabel>

                  <Select
                    items={unidadesItems}
                    value={field.state.value}
                    onValueChange={(valor) =>
                      field.handleChange(
                        (valor as (typeof UNIDADES_MEDIDA)[number] | null) ??
                          "KG",
                      )
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={invalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue />
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

        <form.Field name="observaciones">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Observaciones</FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: Cosecha de primera calidad"
                  maxLength={500}
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

        <form.Field name="cerrarCiclo">
          {(field) => (
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Finalizar la siembra
                </FieldLabel>

                <FieldDescription>
                  Cierra el ciclo de esta siembra: deja de aparecer entre las
                  activas, no se le podrán registrar más cosechas ni cuidados, y
                  su cama vuelve a quedar disponible para sembrar otra cosa. El
                  historial se conserva. Úselo en cultivos que se cosechan una
                  sola vez, como la cebolla.
                </FieldDescription>
              </FieldContent>

              <Switch
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(marcado) => field.handleChange(marcado)}
              />
            </Field>
          )}
        </form.Field>

        <form.Subscribe
          selector={(estado) => ({
            guardando: estado.isSubmitting || registrar.isPending,
            cerrando: estado.values.cerrarCiclo,
          })}
        >
          {({ guardando, cerrando }) => (
            <Button type="submit" disabled={guardando || sinSeleccionPosible}>
              {guardando
                ? "Guardando…"
                : cerrando
                  ? "Registrar cosecha y finalizar"
                  : "Registrar cosecha"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
