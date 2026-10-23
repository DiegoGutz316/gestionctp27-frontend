"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, LoaderCircle } from "lucide-react";
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

import { fechaHoyCR } from "@/lib/fechas";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import {
  avisosQueryKey,
  useEditarAviso,
  useRegistrarAviso,
  useSrcFlyer,
} from "../hooks/aviso-hooks";
import {
  getMensajeDeError,
  quitarFlyerAviso,
  subirFlyerAviso,
} from "../servicios/aviso.service";
import {
  CATEGORIAS_AVISO,
  DESCRIPCION_ESTADO_AVISO,
  ESTADOS_AVISO,
  ETIQUETA_CATEGORIA_AVISO,
  ETIQUETA_ESTADO_AVISO,
  registrarAvisoSchema,
  type AvisoRespuesta,
  type CategoriaAviso,
  type EstadoAviso,
  type RegistrarAviso,
} from "../validacion/aviso.validacion";

const estadosItems = ESTADOS_AVISO.map((estado) => ({
  value: estado,
  label: ETIQUETA_ESTADO_AVISO[estado],
}));

const categoriasItems = CATEGORIAS_AVISO.map((categoria) => ({
  value: categoria,
  label: ETIQUETA_CATEGORIA_AVISO[categoria],
}));

const TIPOS_FLYER = ["image/jpeg", "image/png", "image/webp"];
const TAMANO_MAXIMO_FLYER = 5 * 1024 * 1024;

function validarFlyer(archivo: File): string | null {
  const tipo = archivo.type === "image/jpg" ? "image/jpeg" : archivo.type;
  const extension = archivo.name.split(".").pop()?.toLowerCase();
  const extensionValida =
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "png" ||
    extension === "webp";
  const tipoValido = TIPOS_FLYER.includes(tipo) || (tipo === "" && extensionValida);

  if (!tipoValido) {
    return "Seleccione una imagen JPG, PNG o WebP.";
  }

  if (archivo.size > TAMANO_MAXIMO_FLYER) {
    return "La imagen no puede superar 5 MB.";
  }

  return null;
}

export function AvisoForm({ aviso }: { aviso?: AvisoRespuesta }) {
  const router = useRouter();
  const registrar = useRegistrarAviso();
  const editar = useEditarAviso();
  const [confirmarDesactivar, setConfirmarDesactivar] = useState(false);
  const [confirmarSalida, setConfirmarSalida] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorFlyer, setErrorFlyer] = useState<string | null>(null);
  const [flyer, setFlyer] = useState<File | null>(null);
  const [vistaFlyer, setVistaFlyer] = useState<string | null>(null);
  const [quitarFlyer, setQuitarFlyer] = useState(false);
  const entradaFlyer = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const esEdicion = Boolean(aviso);
  const srcGuardado = useSrcFlyer(
    aviso && aviso.tieneFlyer && !quitarFlyer && !vistaFlyer ? aviso : null,
  );
  const srcFlyer = vistaFlyer ?? srcGuardado;

  const elegirFlyer = (archivo: File | null) => {
    setVistaFlyer((anterior) => {
      if (anterior) URL.revokeObjectURL(anterior);
      return archivo ? URL.createObjectURL(archivo) : null;
    });
    setFlyer(archivo);
    if (archivo) setQuitarFlyer(false);
  };

  const abrirSelector = () => {
    if (entradaFlyer.current) entradaFlyer.current.value = "";
    entradaFlyer.current?.click();
  };

  const quitarImagen = () => {
    setErrorFlyer(null);
    if (flyer) {
      elegirFlyer(null);
      if (entradaFlyer.current) entradaFlyer.current.value = "";
      return;
    }
    setQuitarFlyer(true);
  };

  const guardar = async (datos: RegistrarAviso) => {
    setEnviando(true);
    let guardado: AvisoRespuesta;

    try {
      guardado = aviso
        ? await editar.mutateAsync({ id: aviso.id, datos })
        : await registrar.mutateAsync(datos);
    } catch (error) {
      toast.error(getMensajeDeError(error));
      setEnviando(false);
      return;
    }

    let flyerConError = false;

    try {
      if (flyer) {
        guardado = await subirFlyerAviso(guardado.id, flyer);
      } else if (quitarFlyer && aviso?.tieneFlyer) {
        guardado = await quitarFlyerAviso(guardado.id);
      }
    } catch (error) {
      flyerConError = true;
      toast.error(
        `El aviso se guardó, pero la imagen no: ${getMensajeDeError(error)}`,
      );
    }

    await queryClient.invalidateQueries({ queryKey: avisosQueryKey });
    setConfirmarDesactivar(false);

    if (flyerConError && esEdicion) {
      setEnviando(false);
      return;
    }

    if (!flyerConError) {
      toast.success(
        esEdicion
          ? "Cambios guardados correctamente"
          : guardado.estado === "ACTIVO"
            ? "Aviso publicado correctamente"
            : "Aviso guardado correctamente",
      );
    }

    router.push("/dashboard/comunicacion/avisos");
  };

  const form = useForm({
    defaultValues: {
      titulo: aviso?.titulo ?? "",
      descripcion: aviso?.descripcion ?? "",
      categoria: (aviso?.categoria ?? "") as CategoriaAviso | "",
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

  const guardando = enviando || registrar.isPending || editar.isPending;

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
      <FieldGroup className="gap-6">
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

        <form.Field name="categoria">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Categoría del aviso
                </FieldLabel>

                <Select
                  items={categoriasItems}
                  value={field.state.value || null}
                  onValueChange={(valor) =>
                    field.handleChange((valor as CategoriaAviso | null) ?? "")
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue
                      placeholder={
                        aviso && !aviso.categoria
                          ? "Sin categoría"
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

                <FieldDescription>
                  Selecciona la categoría en la que aparecerá este aviso en la
                  página institucional.
                </FieldDescription>

                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <form.Field name="fecha">
            {(field) => {
              const errors = fieldErrors(field.state.meta.errors);
              const invalid = errors.length > 0;

              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Fecha de la actividad o comunicado
                  </FieldLabel>

                  <Input
                    id={field.name}
                    type="date"
                    min={fechaHoyCR()}
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />

                  <FieldDescription>
                    Solo hoy o una fecha posterior. Ayer y los días anteriores no se pueden usar.
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
          <input
            ref={entradaFlyer}
            id="flyer"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              const archivo = event.target.files?.[0] ?? null;
              if (!archivo) return;

              const mensaje = validarFlyer(archivo);
              if (mensaje) {
                setErrorFlyer(mensaje);
                toast.error(mensaje);
                event.target.value = "";
                return;
              }

              setErrorFlyer(null);
              elegirFlyer(archivo);
            }}
          />

          {srcFlyer || (aviso?.tieneFlyer && !quitarFlyer) ? (
            <div className="overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
              {srcFlyer ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={srcFlyer}
                  alt={
                    vistaFlyer
                      ? "Vista previa del flyer"
                      : `Flyer de ${aviso?.titulo ?? "aviso"}`
                  }
                  className="mx-auto max-h-80 w-auto max-w-full object-contain p-3"
                />
              ) : (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Cargando imagen…
                </p>
              )}
              <div className="flex flex-col gap-2 border-t bg-card px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="truncate text-xs text-muted-foreground">
                  {flyer?.name ?? "Flyer actual"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={abrirSelector}
                    disabled={guardando}
                  >
                    Cambiar imagen
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={quitarImagen}
                    disabled={guardando}
                  >
                    Quitar imagen
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/30">
              <button
                type="button"
                onClick={abrirSelector}
                disabled={guardando}
                className="flex w-full flex-col items-center gap-2 px-4 py-8 text-center transition hover:bg-muted/50 disabled:opacity-60"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground">
                  <ImageIcon className="size-5" />
                </span>
                <span className="text-sm font-medium">Seleccione una imagen</span>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG o WebP de hasta 5 MB
                </span>
              </button>
              {quitarFlyer ? (
                <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    La imagen se quitará al guardar los cambios.
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuitarFlyer(false)}
                    disabled={guardando}
                  >
                    Conservar imagen
                  </Button>
                </div>
              ) : null}
            </div>
          )}

          <FieldDescription>
            Opcional. La imagen se muestra junto al aviso en la página pública.
          </FieldDescription>
          {errorFlyer ? (
            <p className="text-sm text-destructive">{errorFlyer}</p>
          ) : null}
        </Field>

        <form.Subscribe
          selector={(estado) => ({
            sucio: estado.isDirty,
            estadoAviso: estado.values.estado,
          })}
        >
          {({ sucio, estadoAviso }) => {
            const hayCambios = sucio || flyer !== null || quitarFlyer;
            const etiqueta = guardando
              ? esEdicion || estadoAviso === "INACTIVO"
                ? "Guardando…"
                : "Publicando…"
              : esEdicion
                ? "Guardar cambios"
                : estadoAviso === "ACTIVO"
                  ? "Publicar aviso"
                  : "Guardar aviso";

            return (
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={guardando}
                  onClick={() => {
                    if (hayCambios) {
                      setConfirmarSalida(true);
                      return;
                    }
                    router.push("/dashboard/comunicacion/avisos");
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={guardando}>
                  {guardando ? (
                    <LoaderCircle
                      className="animate-spin"
                      data-icon="inline-start"
                    />
                  ) : null}
                  {etiqueta}
                </Button>
              </div>
            );
          }}
        </form.Subscribe>
      </FieldGroup>
    </form>

    <Dialog open={confirmarSalida} onOpenChange={setConfirmarSalida}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambios sin guardar</DialogTitle>
          <DialogDescription>
            Si sale ahora, se perderán los cambios que todavía no ha guardado.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setConfirmarSalida(false)}
          >
            Seguir editando
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/dashboard/comunicacion/avisos")}
          >
            Salir sin guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

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
