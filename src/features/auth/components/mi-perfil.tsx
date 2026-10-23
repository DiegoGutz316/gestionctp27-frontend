"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { useForm } from "@tanstack/react-form";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";
import { ETIQUETA_ROL } from "@/features/usuarios/models/usuario.model";

import { useAuth } from "../context/auth-context";
import type { UsuarioSesion } from "../models/auth.model";
import {
  actualizarPerfil,
  cambiarContrasena,
  getMensajeDeErrorPerfil,
} from "../servicios/auth.service";
import {
  actualizarPerfilSchema,
  cambiarContrasenaSchema,
} from "../validacion/auth.validacion";

function iniciales(nombre: string) {
  return (
    nombre
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

export function MiPerfil() {
  const { usuario, refrescar } = useAuth();

  if (!usuario) {
    return (
      <p className="text-sm text-muted-foreground">Cargando el perfil…</p>
    );
  }

  return <PerfilFormularios usuario={usuario} refrescar={refrescar} />;
}

function PerfilFormularios({
  usuario,
  refrescar,
}: {
  usuario: UsuarioSesion;
  refrescar: () => Promise<void>;
}) {
  const formDatos = useForm({
    defaultValues: {
      nombre: usuario.nombre,
      correo: usuario.correo,
    },
    validators: {
      onSubmit: zodValidator(actualizarPerfilSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        await actualizarPerfil(actualizarPerfilSchema.parse(value));
        await refrescar();
        toast.success("Los datos del perfil se actualizaron.");
      } catch (error) {
        toast.error(getMensajeDeErrorPerfil(error));
      }
    },
  });

  const formClave = useForm({
    defaultValues: {
      contrasenaActual: "",
      contrasenaNueva: "",
      confirmar: "",
    },
    validators: {
      onSubmit: zodValidator(cambiarContrasenaSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        await cambiarContrasena(cambiarContrasenaSchema.parse(value));
        formClave.reset();
        toast.success("La contraseña se actualizó.");
      } catch (error) {
        toast.error(getMensajeDeErrorPerfil(error));
      }
    },
  });

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
            <BreadcrumbPage>Mi perfil</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
          {iniciales(usuario.nombre)}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">
            {usuario.nombre}
          </h1>
          <p className="truncate text-sm text-muted-foreground">
            {usuario.correo}
          </p>
          <Badge variant="secondary" className="mt-2">
            {ETIQUETA_ROL[usuario.rol]}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la cuenta</CardTitle>
          <CardDescription>
            Puede cambiar su nombre y correo. El rol lo asigna un administrador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void formDatos.handleSubmit();
            }}
            noValidate
            className="space-y-6"
          >
            <FieldGroup>
              <formDatos.Field name="nombre">
                {(field) => {
                  const errors = fieldErrors(field.state.meta.errors);
                  const invalid = errors.length > 0;
                  return (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor={field.name} required>
                        Nombre completo
                      </FieldLabel>
                      <Input
                        id={field.name}
                        autoComplete="name"
                        aria-invalid={invalid}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                      <FieldError errors={errors} />
                    </Field>
                  );
                }}
              </formDatos.Field>

              <formDatos.Field name="correo">
                {(field) => {
                  const errors = fieldErrors(field.state.meta.errors);
                  const invalid = errors.length > 0;
                  return (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor={field.name} required>
                        Correo electrónico
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="email"
                        autoComplete="email"
                        aria-invalid={invalid}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                      <FieldError errors={errors} />
                    </Field>
                  );
                }}
              </formDatos.Field>
            </FieldGroup>

            <formDatos.Subscribe selector={(estado) => estado.isSubmitting}>
              {(guardando) => (
                <Button type="submit" disabled={guardando}>
                  {guardando ? "Guardando…" : "Guardar datos"}
                </Button>
              )}
            </formDatos.Subscribe>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar contraseña</CardTitle>
          <CardDescription>
            Escriba la contraseña actual y la nueva. Debe tener al menos 8
            caracteres.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void formClave.handleSubmit();
            }}
            noValidate
            className="space-y-6"
          >
            <FieldGroup>
              <formClave.Field name="contrasenaActual">
                {(field) => {
                  const errors = fieldErrors(field.state.meta.errors);
                  const invalid = errors.length > 0;
                  return (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor={field.name} required>
                        Contraseña actual
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={invalid}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                      <FieldError errors={errors} />
                    </Field>
                  );
                }}
              </formClave.Field>

              <formClave.Field name="contrasenaNueva">
                {(field) => {
                  const errors = fieldErrors(field.state.meta.errors);
                  const invalid = errors.length > 0;
                  return (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor={field.name} required>
                        Nueva contraseña
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        autoComplete="new-password"
                        aria-invalid={invalid}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                      <FieldError errors={errors} />
                    </Field>
                  );
                }}
              </formClave.Field>

              <formClave.Field name="confirmar">
                {(field) => {
                  const errors = fieldErrors(field.state.meta.errors);
                  const invalid = errors.length > 0;
                  return (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor={field.name} required>
                        Confirmar nueva contraseña
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        autoComplete="new-password"
                        aria-invalid={invalid}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                      <FieldError errors={errors} />
                    </Field>
                  );
                }}
              </formClave.Field>
            </FieldGroup>

            <formClave.Subscribe selector={(estado) => estado.isSubmitting}>
              {(guardando) => (
                <Button type="submit" disabled={guardando}>
                  {guardando ? "Actualizando…" : "Actualizar contraseña"}
                </Button>
              )}
            </formClave.Subscribe>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
