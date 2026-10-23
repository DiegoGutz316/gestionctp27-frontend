"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Home } from "lucide-react";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { useCultivo, useEditarCultivo } from "../hooks/cultivo-hooks";
import {
  ETIQUETA_TIPO_CULTIVO,
  TIPOS_CULTIVO,
  editarCultivoSchema,
} from "../models/cultivo.model";
import { getMensajeDeError } from "../servicios/cultivo.service";

export function CultivoEditar({ id }: { id: number }) {
  const consulta = useCultivo(id);

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/dashboard" />}
              className="flex items-center gap-1.5"
            >
              <Home className="size-3.5" />
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/agricola/cultivos" />}>
              Cultivos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar cultivo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Los cambios se reflejan en el selector de siembras.
        </p>
      </div>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>Datos del cultivo</CardTitle>
          <CardDescription>
            El nombre y el tipo son obligatorios; la descripción es opcional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {consulta.isPending ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : consulta.isError || !consulta.data ? (
            <p className="py-8 text-center text-sm whitespace-normal text-destructive">
              {getMensajeDeError(consulta.error)}
            </p>
          ) : (
            <Formulario id={id} cultivo={consulta.data} />
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function Formulario({
  id,
  cultivo,
}: {
  id: number;
  cultivo: {
    nombre: string;
    tipo: string;
    descripcion: string | null;
    activo: boolean;
  };
}) {
  const router = useRouter();
  const editar = useEditarCultivo(id);

  const tiposItems = TIPOS_CULTIVO.map((tipo) => ({
    value: tipo,
    label: ETIQUETA_TIPO_CULTIVO[tipo],
  }));

  const form = useForm({
    defaultValues: {
      nombre: cultivo.nombre,
      tipo: cultivo.tipo,
      descripcion: cultivo.descripcion ?? "",
      activo: cultivo.activo,
    },
    validators: {
      onSubmit: ({ value }) => zodValidator(editarCultivoSchema)({ value }),
    },
    onSubmit: async ({ value }) => {
      try {
        const datos = editarCultivoSchema.parse({
          ...value,
          descripcion: value.descripcion.trim() || undefined,
        });
        await editar.mutateAsync(datos);
        toast.success(`Cultivo "${datos.nombre}" actualizado correctamente.`);
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

        <form.Field name="activo">
          {(field) => (
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Activo</FieldLabel>
                <FieldDescription>
                  Un cultivo inactivo deja de ofrecerse al registrar una
                  siembra, pero conserva su historial.
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
          selector={(state) => state.isSubmitting || editar.isPending}
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar cambios"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
