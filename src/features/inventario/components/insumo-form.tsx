"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  crearInsumoSchema,
  UNIDADES_MEDIDA,
  type CrearInsumo,
  type CrearInsumoInput,
} from "@/schemas";
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

  const form = useForm<CrearInsumoInput, unknown, CrearInsumo>({
    resolver: zodResolver(crearInsumoSchema),
    defaultValues: {
      nombre: "",
      categoriaId: "",
      unidadMedida: "kg",
      cantidad: "",
      nivelMinimo: "0",
    },
  });

  const { errors } = form.formState;

  const categoriasItems = (categorias.data ?? []).map((categoria) => ({
    value: String(categoria.id),
    label: categoria.nombre,
  }));

  const onSubmit = form.handleSubmit((datos) => {
    crearInsumo.mutate(datos, {
      onSuccess: (insumo) => {
        toast.success(`Insumo "${insumo.nombre}" registrado correctamente.`);
        form.reset();
      },
      onError: (error) => {
        toast.error(getMensajeDeError(error));
      },
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.nombre}>
          <FieldLabel htmlFor="nombre">Nombre del insumo</FieldLabel>
          <Input
            id="nombre"
            placeholder="Ej: Alimento para cerdos"
            aria-invalid={!!errors.nombre}
            {...form.register("nombre")}
          />
          <FieldError errors={[errors.nombre]} />
        </Field>

        <Field data-invalid={!!errors.categoriaId}>
          <FieldLabel htmlFor="categoria">Categoría</FieldLabel>
          <div className="flex items-center gap-2">
            <Controller
              control={form.control}
              name="categoriaId"
              render={({ field }) => (
                <Select
                  items={categoriasItems}
                  value={field.value === "" ? null : String(field.value)}
                  onValueChange={(valor) => field.onChange(valor ?? "")}
                  disabled={categorias.isLoading || categorias.isError}
                >
                  <SelectTrigger
                    id="categoria"
                    className="w-full"
                    aria-invalid={!!errors.categoriaId}
                    onBlur={field.onBlur}
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
              )}
            />
            <NuevaCategoriaDialog
              onCreated={(categoria) =>
                form.setValue("categoriaId", String(categoria.id), {
                  shouldValidate: true,
                })
              }
            />
          </div>
          {categorias.isError && (
            <FieldDescription className="text-destructive">
              No se pudieron cargar las categorías. Verifique la conexión con
              el servidor.
            </FieldDescription>
          )}
          <FieldError errors={[errors.categoriaId]} />
        </Field>

        <Field data-invalid={!!errors.unidadMedida}>
          <FieldLabel htmlFor="unidad-medida">Unidad de medida</FieldLabel>
          <Controller
            control={form.control}
            name="unidadMedida"
            render={({ field }) => (
              <Select
                items={unidadesItems}
                value={field.value}
                onValueChange={(valor) => field.onChange(valor)}
              >
                <SelectTrigger
                  id="unidad-medida"
                  className="w-full"
                  aria-invalid={!!errors.unidadMedida}
                  onBlur={field.onBlur}
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
            )}
          />
          <FieldError errors={[errors.unidadMedida]} />
        </Field>

        <Field data-invalid={!!errors.cantidad}>
          <FieldLabel htmlFor="cantidad">Cantidad inicial</FieldLabel>
          <Input
            id="cantidad"
            type="number"
            step="0.01"
            min={0}
            placeholder="Ej: 50"
            aria-invalid={!!errors.cantidad}
            {...form.register("cantidad")}
          />
          <FieldError errors={[errors.cantidad]} />
        </Field>

        <Field data-invalid={!!errors.nivelMinimo}>
          <FieldLabel htmlFor="nivel-minimo">Nivel mínimo</FieldLabel>
          <Input
            id="nivel-minimo"
            type="number"
            step="0.01"
            min={0}
            aria-invalid={!!errors.nivelMinimo}
            {...form.register("nivelMinimo")}
          />
          <FieldDescription>
            Cuando la existencia sea menor o igual a este nivel, el sistema
            mostrará una alerta de bajo inventario.
          </FieldDescription>
          <FieldError errors={[errors.nivelMinimo]} />
        </Field>

        <Button type="submit" disabled={crearInsumo.isPending}>
          {crearInsumo.isPending ? "Guardando…" : "Registrar insumo"}
        </Button>
      </FieldGroup>
    </form>
  );
}
