"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";

import {
  getMensajeDeErrorAuth,
  restablecerContrasena,
} from "@/features/auth/servicios/auth.service";
import { restablecerContrasenaSchema } from "@/features/auth/validacion/auth.validacion";

function FormularioRestablecer() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token")?.trim() ?? "";
  const [mostrar, setMostrar] = useState(false);

  const form = useForm({
    defaultValues: {
      token,
      contrasenaNueva: "",
      confirmar: "",
    },
    validators: {
      onSubmit: zodValidator(restablecerContrasenaSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const datos = restablecerContrasenaSchema.parse(value);
        await restablecerContrasena({
          token: datos.token,
          contrasenaNueva: datos.contrasenaNueva,
        });
        toast.success("Contraseña actualizada. Ya puede iniciar sesión.");
        router.replace("/login");
      } catch (error) {
        toast.error(getMensajeDeErrorAuth(error));
      }
    },
  });

  if (!token) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">
          El enlace no es válido. Solicite uno nuevo desde el inicio de sesión.
        </p>
        <Link
          href="/recuperar-contrasena"
          className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Solicitar enlace
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      noValidate
    >
      <FieldGroup className="gap-5">
        <form.Field name="contrasenaNueva">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Nueva contraseña
                </FieldLabel>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={field.name}
                    type={mostrar ? "text" : "password"}
                    autoComplete="new-password"
                    className="h-12 pr-12 pl-11"
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                    onClick={() => setMostrar((v) => !v)}
                    aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {mostrar ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <FieldError errors={errors} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="confirmar">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Confirmar contraseña
                </FieldLabel>
                <Input
                  id={field.name}
                  type={mostrar ? "text" : "password"}
                  autoComplete="new-password"
                  className="h-12"
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
      </FieldGroup>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(guardando) => (
          <Button
            type="submit"
            disabled={guardando}
            className="mt-7 h-12 w-full rounded-xl"
          >
            {guardando ? "Guardando…" : "Guardar contraseña"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

export default function RestablecerContrasenaPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f8f9f6] px-6 py-10 dark:bg-background">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-border/70 bg-white/92 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:bg-card/92 sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full border border-border bg-white shadow-sm dark:bg-card">
              <Image
                src="/escudo-ctp27.png"
                alt="Escudo CTP 27 de Abril"
                width={34}
                height={34}
                className="size-8 object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-none text-foreground">
                Gestión CTP 27
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Nueva contraseña
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Crear nueva contraseña
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Elija una contraseña de al menos 8 caracteres.
            </p>
          </div>

          <Suspense
            fallback={
              <p className="text-sm text-muted-foreground">Cargando…</p>
            }
          >
            <FormularioRestablecer />
          </Suspense>

          <div className="mt-8 border-t border-border/60 pt-5">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              <ArrowLeft className="size-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
