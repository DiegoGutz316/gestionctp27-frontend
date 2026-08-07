"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  UNIDADES_MEDIDA,
  type UnidadMedida,
} from "../models/inventario.model";
import { crearInsumoSchema } from "../validacion/inventario.validacion";
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
import { useCategorias, useCrearInsumo } from "../hooks";
import { NuevaCategoriaDialog } from "./nueva-categoria-dialog";

const unidadesItems = UNIDADES_MEDIDA.map((unidad) => ({
  value: unidad,
  label: unidad,
}));

export function InsumoForm() {
  const categorias = useCategorias();
  const crearInsumo = useCrearInsumo();

  const form = useForm({
    defaultValues: {
      nombre: "",
      categoriaId: "" as string | number,
      unidadMedida: "kg" as UnidadMedida,
      cantidad: "" as string | number,
      nivelMinimo: "0" as string | number,
    },
    validators: {
      onSubmit: zodValidator(crearInsumoSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const insumo = await crearInsumo.mutateAsync(
          crearInsumoSchema.parse(value),
        );
        toast.success(`Insumo "${insumo.nombre}" registrado correctamente.`);
        form.reset();
      } catch (error) {
        toast.error(getMensajeDeError(error));
      }
    },
  });

  const categoriasItems = (categorias.data ?? []).map((categoria) => ({
    value: String(categoria.id),
    label: categoria.nombre,
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
        <form.Field name="nombre">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Nombre del insumo</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: Alimento para cerdos"
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

        <form.Field name="categoriaId">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor="categoria">Categoría</FieldLabel>
                <div className="flex items-center gap-2">
                  <Select
                    items={categoriasItems}
                    value={
                      field.state.value === ""
                        ? null
                        : String(field.state.value)
                    }
                    onValueChange={(valor) =>
                      field.handleChange(valor ?? "")
                    }
                    disabled={categorias.isLoading || categorias.isError}
                  >
                    <SelectTrigger
                      id="categoria"
                      className="w-full"
                      aria-invalid={invalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue
                        placeholder={
                          categorias.isLoading
                            ? "Cargando categorías…"
                            : "Seleccione una categoría"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <NuevaCategoriaDialog
                    onCreated={(categoria) =>
                      field.handleChange(String(categoria.id))
                    }
                  />
                </div>
                {categorias.isError && (
                  <FieldDescription className="text-destructive">
                    No se pudieron cargar las categorías. Verifique la conexión
                    con el servidor.
                  </FieldDescription>
                )}
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
                <FieldLabel htmlFor="unidad-medida">Unidad de medida</FieldLabel>
                <Select
                  items={unidadesItems}
                  value={field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange(valor as UnidadMedida)
                  }
                >
                  <SelectTrigger
                    id="unidad-medida"
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

        <form.Field name="cantidad">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Cantidad inicial</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  min={0}
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

        <form.Field name="nivelMinimo">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Nivel mínimo</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  min={0}
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldDescription>
                  Cuando la existencia sea menor o igual a este nivel, el
                  sistema mostrará una alerta de bajo inventario.
                </FieldDescription>
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe
          selector={(state) => state.isSubmitting || crearInsumo.isPending}
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar insumo"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
