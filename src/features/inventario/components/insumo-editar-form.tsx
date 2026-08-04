"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  editarInsumoSchema,
  UNIDADES_MEDIDA,
  type EditarInsumo,
  type EditarInsumoInput,
  type InsumoRespuesta,
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
import { useCategorias, useEditarInsumo } from "../hooks";
import { NuevaCategoriaDialog } from "./nueva-categoria-dialog";

const unidadesItems = UNIDADES_MEDIDA.map((unidad) => ({
  value: unidad,
  label: unidad,
}));

export function InsumoEditarForm({ insumo }: { insumo: InsumoRespuesta }) {
  const router = useRouter();
  const categorias = useCategorias();
  const editarInsumo = useEditarInsumo(insumo.id);

  const form = useForm<EditarInsumoInput, unknown, EditarInsumo>({
    resolver: zodResolver(editarInsumoSchema),
    defaultValues: {
      nombre: insumo.nombre,
      categoriaId: String(insumo.categoria.id),
      unidadMedida: insumo.unidadMedida,
      nivelMinimo: String(insumo.nivelMinimo),
    },
  });

  const { errors } = form.formState;

  const categoriasItems = (categorias.data ?? []).map((categoria) => ({
    value: String(categoria.id),
    label: categoria.nombre,
  }));

  const onSubmit = form.handleSubmit((datos) => {
    editarInsumo.mutate(datos, {
      onSuccess: (actualizado) => {
        toast.success(`Insumo "${actualizado.nombre}" actualizado correctamente.`);
        router.push("/inventario/insumos");
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

        <Field>
          <FieldLabel htmlFor="cantidad-actual">Cantidad actual</FieldLabel>
          <Input
            id="cantidad-actual"
            value={insumo.cantidad}
            disabled
            readOnly
          />
          <FieldDescription>
            La cantidad solo cambia mediante entradas y salidas de inventario.
          </FieldDescription>
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

        <Button type="submit" disabled={editarInsumo.isPending}>
          {editarInsumo.isPending ? "Guardando…" : "Guardar cambios"}
        </Button>
      </FieldGroup>
    </form>
  );
}
