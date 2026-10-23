"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useRegistrarCultivo } from "../hooks/cultivo-hooks";
import {
  ETIQUETA_TIPO_CULTIVO,
  TIPOS_CULTIVO,
  registrarCultivoSchema,
} from "../models/cultivo.model";
import { getMensajeDeError } from "../servicios/cultivo.service";

export function CultivoForm() {
  const router = useRouter();
  const registrar = useRegistrarCultivo();

  const tiposItems = TIPOS_CULTIVO.map((tipo) => ({
    value: tipo,
    label: ETIQUETA_TIPO_CULTIVO[tipo],
  }));

  const form = useForm({
    defaultValues: { nombre: "", tipo: "", descripcion: "" },
    validators: {
      onSubmit: ({ value }) => zodValidator(registrarCultivoSchema)({ value }),
    },
    onSubmit: async ({ value }) => {
      try {
        const datos = registrarCultivoSchema.parse({
          ...value,
          descripcion: value.descripcion.trim() || undefined,
        });
        await registrar.mutateAsync(datos);
        toast.success(`Cultivo "${datos.nombre}" registrado correctamente.`);
        router.push("/dashboard/agricola/cultivos");
      } catch (error) {
        toast.error(getMensajeDeError(error));
      }
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="nombre">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Nombre del cultivo
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Ej: Lechuga"
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

        <form.Field name="tipo">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Tipo de cultivo
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

        <form.Field name="descripcion">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
                <Textarea
                  id={field.name}
                  rows={3}
                  maxLength={500}
                  placeholder="Variedad, ciclo aproximado, cuidados que necesita…"
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
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar cultivo"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
