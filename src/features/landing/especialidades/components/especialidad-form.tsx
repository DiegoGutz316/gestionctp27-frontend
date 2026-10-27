"use client";

import { useState } from "react";
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

import {
  ACENTOS_ESPECIALIDAD,
  ETIQUETA_ICONO,
  ICONOS_ESPECIALIDAD,
  type IconoEspecialidad,
} from "../models/especialidad.model";
import {
  useCrearEspecialidad,
  useEditarEspecialidad,
  useQuitarFotoEspecialidad,
} from "../hooks/hooks";
import {
  getMensajeDeError,
  subirFotoEspecialidad,
  urlFotoVisible,
} from "../servicios/especialidad.service";
import {
  crearEspecialidadSchema,
  type CrearEspecialidadInput,
  type EspecialidadRespuesta,
} from "../validacion/especialidad.validacion";

const iconosItems = ICONOS_ESPECIALIDAD.map((icono) => ({
  value: icono,
  label: ETIQUETA_ICONO[icono],
}));

const acentosItems = ACENTOS_ESPECIALIDAD.map((item) => ({
  value: item.value,
  label: item.label,
}));

export function EspecialidadForm({
  especialidad,
}: {
  especialidad?: EspecialidadRespuesta;
}) {
  const router = useRouter();
  const esEdicion = Boolean(especialidad);
  const crear = useCrearEspecialidad();
  const editar = useEditarEspecialidad(especialidad?.id ?? 0);
  const quitarFoto = useQuitarFotoEspecialidad(especialidad?.id ?? 0);
  const [foto, setFoto] = useState<File | null>(null);
  const [quitarFotoActual, setQuitarFotoActual] = useState(false);

  const valoresIniciales: CrearEspecialidadInput = {
    nombre: especialidad?.nombre ?? "",
    descripcion: especialidad?.descripcion ?? "",
    icono: especialidad?.icono ?? "SPROUT",
    acento: especialidad?.acento ?? "var(--acento-agro)",
    fotoAlt: especialidad?.fotoAlt ?? "",
    posicionFoto: especialidad?.posicionFoto ?? "",
    orden: especialidad?.orden,
  };

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(crearEspecialidadSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const datos = crearEspecialidadSchema.parse(value);
        const payload = {
          ...datos,
          fotoAlt: datos.fotoAlt || undefined,
          posicionFoto: datos.posicionFoto || undefined,
        };

        let guardada = especialidad
          ? await editar.mutateAsync(payload)
          : await crear.mutateAsync(payload);

        if (quitarFotoActual && especialidad?.tieneFoto) {
          guardada = await quitarFoto.mutateAsync();
        }
        if (foto) {
          guardada = await subirFotoEspecialidad(guardada.id, foto);
        }

        toast.success(
          esEdicion
            ? `Especialidad "${guardada.nombre}" actualizada.`
            : `Especialidad "${guardada.nombre}" registrada.`,
        );
        router.push("/dashboard/landing/especialidades");
      } catch (error) {
        toast.error(getMensajeDeError(error));
      }
    },
  });

  const vistaPrevia =
    foto != null
      ? URL.createObjectURL(foto)
      : especialidad && !quitarFotoActual
        ? urlFotoVisible(especialidad)
        : null;

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
                  Nombre
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={invalid}
                />
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
                <FieldLabel htmlFor={field.name} required>
                  Descripción
                </FieldLabel>
                <Textarea
                  id={field.name}
                  rows={3}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={invalid}
                />
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="icono">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Icono
                  </FieldLabel>
                  <Select
                    items={iconosItems}
                    value={field.state.value}
                    onValueChange={(valor) =>
                      field.handleChange(valor as IconoEspecialidad)
                    }
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Icono" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconosItems.map((item) => (
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

          <form.Field name="acento">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Color de acento
                  </FieldLabel>
                  <Select
                    items={acentosItems}
                    value={field.state.value}
                    onValueChange={(valor) =>
                      field.handleChange(valor ?? field.state.value)
                    }
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Acento" />
                    </SelectTrigger>
                    <SelectContent>
                      {acentosItems.map((item) => (
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

        <form.Field name="fotoAlt">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>
                  Texto alternativo de la foto
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={invalid}
                />
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="orden">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Orden</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  min={0}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    const valor = event.target.value;
                    field.handleChange(
                      valor === "" ? undefined : Number(valor),
                    );
                  }}
                  aria-invalid={invalid}
                />
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <Field>
          <FieldLabel htmlFor="foto-especialidad">Foto</FieldLabel>
          <Input
            id="foto-especialidad"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const archivo = event.target.files?.[0] ?? null;
              setFoto(archivo);
              setQuitarFotoActual(false);
            }}
          />
          {vistaPrevia ? (
            <div className="mt-3 overflow-hidden rounded-xl border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vistaPrevia}
                alt="Vista previa"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          ) : null}
          {especialidad?.tieneFoto && !foto ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => setQuitarFotoActual(true)}
            >
              Quitar foto subida
            </Button>
          ) : null}
        </Field>
      </FieldGroup>

      <form.Subscribe
        selector={(state) =>
          state.isSubmitting ||
          crear.isPending ||
          editar.isPending ||
          quitarFoto.isPending
        }
      >
        {(guardando) => (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={guardando}
              onClick={() => router.push("/dashboard/landing/especialidades")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando
                ? "Guardando…"
                : esEdicion
                  ? "Guardar cambios"
                  : "Registrar especialidad"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
