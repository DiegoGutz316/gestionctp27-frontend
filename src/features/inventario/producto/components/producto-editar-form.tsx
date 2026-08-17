"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  DEPARTAMENTOS,
  ETIQUETA_DEPARTAMENTO,
  ETIQUETA_TIPO_PRODUCTO,
  ETIQUETA_UBICACION,
  ETIQUETA_UNIDAD_MEDIDA,
  TIPOS_PRODUCTO,
  UBICACIONES,
  UNIDADES_MEDIDA,
  type Departamento,
  type TipoProducto,
  type Ubicacion,
  type UnidadMedida,
} from "../models/producto.model";
import {
  editarProductoSchema,
  type EditarProductoInput,
  type ProductoRespuesta,
} from "../validacion/producto.validacion";
import { Button } from "@/components/ui/button";
import {
  Field,
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
import { useEditarProducto } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/producto.service";

const tiposItems = TIPOS_PRODUCTO.map((tipo) => ({
  value: tipo,
  label: ETIQUETA_TIPO_PRODUCTO[tipo],
}));

const unidadesItems = UNIDADES_MEDIDA.map((unidad) => ({
  value: unidad,
  label: ETIQUETA_UNIDAD_MEDIDA[unidad],
}));

const departamentosItems = DEPARTAMENTOS.map((departamento) => ({
  value: departamento,
  label: ETIQUETA_DEPARTAMENTO[departamento],
}));

const ubicacionesItems = UBICACIONES.map((ubicacion) => ({
  value: ubicacion,
  label: ETIQUETA_UBICACION[ubicacion],
}));

export function ProductoEditarForm({
  producto,
}: {
  producto: ProductoRespuesta;
}) {
  const router = useRouter();
  const editarProducto = useEditarProducto(producto.id);

  const valoresIniciales: EditarProductoInput = {
    nombre: producto.nombre,
    tipoProducto: producto.tipoProducto,
    unidadMedida: producto.unidadMedida,
    departamento: producto.departamento,
    ubicacion: producto.ubicacion,
  };

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(editarProductoSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const actualizado = await editarProducto.mutateAsync(
          editarProductoSchema.parse(value),
        );
        toast.success(
          `Producto "${actualizado.nombre}" actualizado correctamente.`,
        );
        router.push("/dashboard/inventario");
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
      className="space-y-6"
    >
      <FieldGroup>
        <form.Field name="nombre">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Nombre del producto
                </FieldLabel>
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

        <form.Field name="tipoProducto">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Tipo de producto
                </FieldLabel>
                <Select
                  items={tiposItems}
                  value={field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange(valor as TipoProducto)
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
                    field.handleChange(valor as UnidadMedida)
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

        <form.Field name="departamento">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Departamento
                </FieldLabel>
                <Select
                  items={departamentosItems}
                  value={field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange(valor as Departamento)
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue placeholder="Seleccione un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentosItems.map((item) => (
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

        <form.Field name="ubicacion">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Ubicación
                </FieldLabel>
                <Select
                  items={ubicacionesItems}
                  value={field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange(valor as Ubicacion)
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue placeholder="Seleccione una ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {ubicacionesItems.map((item) => (
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
      </FieldGroup>

      <form.Subscribe
        selector={(state) => state.isSubmitting || editarProducto.isPending}
      >
        {(guardando) => (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={guardando}
              nativeButton={false}
              render={<Link href="/dashboard/inventario" />}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
