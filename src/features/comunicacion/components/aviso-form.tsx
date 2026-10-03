"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";

import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import { avisosQueryKey, useEditarAviso, useRegistrarAviso } from "../hooks/aviso-hooks";
import {
  getMensajeDeError,
  quitarFlyerAviso,
  subirFlyerAviso,
  urlFlyerAviso,
} from "../servicios/aviso.service";
import {
  DESCRIPCION_ESTADO_AVISO,
  ESTADOS_AVISO,
  ETIQUETA_ESTADO_AVISO,
  registrarAvisoSchema,
  type AvisoRespuesta,
  type EstadoAviso,
  type RegistrarAviso,
} from "../validacion/aviso.validacion";

const estadosItems = ESTADOS_AVISO.map((estado) => ({
  value: estado,
  label: ETIQUETA_ESTADO_AVISO[estado],
}));

const TIPOS_FLYER = ["image/jpeg", "image/png", "image/webp"];
const TAMANO_MAXIMO_FLYER = 5 * 1024 * 1024;

export function AvisoForm({ aviso }: { aviso?: AvisoRespuesta }) {
  const router = useRouter();
  const registrar = useRegistrarAviso();
  const editar = useEditarAviso();
  const [confirmarDesactivar, setConfirmarDesactivar] = useState(false);
  const [flyer, setFlyer] = useState<File | null>(null);
  const [vistaFlyer, setVistaFlyer] = useState<string | null>(null);
  const [quitarFlyer, setQuitarFlyer] = useState(false);
  const queryClient = useQueryClient();
  const esEdicion = Boolean(aviso);

  const elegirFlyer = (archivo: File | null) => {
    setVistaFlyer((anterior) => {
      if (anterior) URL.revokeObjectURL(anterior);
      return archivo ? URL.createObjectURL(archivo) : null;
    });
    setFlyer(archivo);
    if (archivo) setQuitarFlyer(false);
  };

  const guardar = async (datos: RegistrarAviso) => {
    let guardado: AvisoRespuesta;

    try {
      guardado = aviso
        ? await editar.mutateAsync({ id: aviso.id, datos })
        : await registrar.mutateAsync(datos);
    } catch (error) {
      toast.error(getMensajeDeError(error));
      return;
    }

    try {
      if (flyer) {
        guardado = await subirFlyerAviso(guardado.id, flyer);
      } else if (quitarFlyer && aviso?.tieneFlyer) {
        guardado = await quitarFlyerAviso(guardado.id);
      }
    } catch (error) {
      toast.error(
        `El aviso se guardó, pero el flyer no: ${getMensajeDeError(error)}`,
      );
    }

    await queryClient.invalidateQueries({ queryKey: avisosQueryKey });

    toast.success(
      guardado.estado === "INACTIVO"
        ? `Aviso "${guardado.titulo}" desactivado correctamente.`
        : esEdicion
          ? `Aviso "${guardado.titulo}" actualizado correctamente.`
          : `Aviso "${guardado.titulo}" publicado correctamente.`,
    );
    setConfirmarDesactivar(false);
    router.push(
      esEdicion ? "/dashboard/comunicacion/avisos" : "/dashboard",
    );
  };

  const form = useForm({
    defaultValues: {
      titulo: aviso?.titulo ?? "",
      descripcion: aviso?.descripcion ?? "",
      fecha: aviso?.fecha ?? "",
      estado: (aviso?.estado ?? "ACTIVO") as EstadoAviso,
    },

    validators: {
      onSubmit: zodValidator(registrarAvisoSchema),
    },

    onSubmit: async ({ value }) => {
      const datos = registrarAvisoSchema.parse(value);

      if (
        aviso &&
        aviso.estado === "ACTIVO" &&
        datos.estado === "INACTIVO"
      ) {
        setConfirmarDesactivar(true);
        return;
      }

      await guardar(datos);
    },
  });

  const guardando =
    registrar.isPending || editar.isPending;

  return (
    <>
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      noValidate
    >
      <FieldGroup>
        <form.Field name="titulo">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Título
                </FieldLabel>

                <Input
                  id={field.name}
                  placeholder="Ej: Feria agrícola institucional"
                  maxLength={150}
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
                  rows={5}
                  placeholder="Detalle de la actividad, el lugar y la hora."
                  maxLength={2000}
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

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="fecha">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Fecha del aviso
                  </FieldLabel>

                  {/* Sin `max`: un aviso anuncia algo que todavía no ocurrió,
                      así que las fechas futuras son lo normal aquí. */}
                  <Input
                    id={field.name}
                    type="date"
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />

                  <FieldDescription>
                    La fecha de la actividad que se anuncia.
                  </FieldDescription>

                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="estado">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Estado
                  </FieldLabel>

                  <Select
                    items={estadosItems}
                    value={field.state.value}
                    onValueChange={(valor) =>
                      field.handleChange(
                        (valor as EstadoAviso | null) ?? "ACTIVO",
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
                      {estadosItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <form.Subscribe selector={(estado) => estado.values.estado}>
                    {(estado) => (
                      <FieldDescription>
                        {DESCRIPCION_ESTADO_AVISO[estado]}
                      </FieldDescription>
                    )}
                  </form.Subscribe>

                  <FieldError errors={errors} />
                </Field>
              );
            }}
          </form.Field>
        </div>

        <Field>
          <FieldLabel htmlFor="flyer">Flyer</FieldLabel>
          <Input
            id="flyer"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const archivo = event.target.files?.[0] ?? null;
              if (!archivo) {
                elegirFlyer(null);
                return;
              }

              const tipo =
                archivo.type === "image/jpg" ? "image/jpeg" : archivo.type;

              if (!TIPOS_FLYER.includes(tipo) || archivo.size > TAMANO_MAXIMO_FLYER) {
                toast.error("El flyer debe ser JPG, PNG o WebP de hasta 5 MB.");
                event.target.value = "";
                return;
              }

              elegirFlyer(archivo);
            }}
          />
          <FieldDescription>
            Opcional. La imagen se muestra junto al aviso en la página pública.
          </FieldDescription>

          {vistaFlyer ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={vistaFlyer}
              alt="Vista previa del flyer"
              className="mt-3 max-h-72 w-full rounded-lg border object-contain"
            />
          ) : null}

          {!vistaFlyer && aviso?.tieneFlyer && !quitarFlyer ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={urlFlyerAviso(aviso.id)}
              alt={`Flyer de ${aviso.titulo}`}
              className="mt-3 max-h-72 w-full rounded-lg border object-contain"
            />
          ) : null}

          {aviso?.tieneFlyer && !flyer ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setQuitarFlyer((actual) => !actual)}
            >
              {quitarFlyer ? "Conservar flyer" : "Quitar flyer"}
            </Button>
          ) : null}
        </Field>

        <form.Subscribe selector={(estado) => estado.isSubmitting || guardando}>
          {(ocupado) => (
            <Button type="submit" disabled={ocupado}>
              {ocupado
                ? esEdicion
                  ? "Guardando…"
                  : "Publicando…"
                : esEdicion
                  ? "Guardar cambios"
                  : "Publicar aviso"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>

    <Dialog open={confirmarDesactivar} onOpenChange={setConfirmarDesactivar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desactivar aviso</DialogTitle>
          <DialogDescription>
            {aviso
              ? `Va a desactivar "${aviso.titulo}". Dejará de mostrarse, pero el registro se conserva.`
              : "El aviso dejará de mostrarse."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setConfirmarDesactivar(false)}
            disabled={guardando}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={guardando}
            onClick={() => {
              const datos = registrarAvisoSchema.parse(form.state.values);
              void guardar(datos);
            }}
          >
            {guardando ? "Desactivando…" : "Desactivar aviso"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
