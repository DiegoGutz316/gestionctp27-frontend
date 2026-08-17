"use client";

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
import { crearProductoSchema } from "../validacion/producto.validacion";
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
import { useCrearProducto } from "../hooks/hooks";
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

export function ProductoForm() {
  const router = useRouter();
  const crearProducto = useCrearProducto();

  const form = useForm({
    defaultValues: {
      nombre: "",
      tipoProducto: "" as TipoProducto | "",
      unidadMedida: "" as UnidadMedida | "",
      departamento: "" as Departamento | "",
      ubicacion: "" as Ubicacion | "",
    },
    validators: {
      onSubmit: zodValidator(crearProductoSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const producto = await crearProducto.mutateAsync(
          crearProductoSchema.parse(value),
        );
        toast.success(`Producto "${producto.nombre}" registrado correctamente.`);
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
    >
      <FieldGroup>
        <form.Field name="nombre">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Nombre del producto</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Tipo de producto</FieldLabel>
                <Select
                  items={tiposItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange((valor as TipoProducto | null) ?? "")
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
                <FieldLabel htmlFor={field.name}>Unidad de medida</FieldLabel>
                <Select
                  items={unidadesItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange((valor as UnidadMedida | null) ?? "")
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
                <FieldLabel htmlFor={field.name}>Departamento</FieldLabel>
                <Select
                  items={departamentosItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange((valor as Departamento | null) ?? "")
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
                <FieldLabel htmlFor={field.name}>Ubicación</FieldLabel>
                <Select
                  items={ubicacionesItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange((valor as Ubicacion | null) ?? "")
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

        <form.Subscribe
          selector={(state) => state.isSubmitting || crearProducto.isPending}
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar producto"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
