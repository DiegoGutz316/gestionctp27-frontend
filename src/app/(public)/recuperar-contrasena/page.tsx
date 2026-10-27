"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { ArrowLeft, Mail } from "lucide-react";
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
  solicitarRestablecimiento,
} from "@/features/auth/servicios/auth.service";
import { solicitarRestablecimientoSchema } from "@/features/auth/validacion/auth.validacion";

export default function RecuperarContrasenaPage() {
  const form = useForm({
    defaultValues: { correo: "" },
    validators: {
      onSubmit: zodValidator(solicitarRestablecimientoSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const respuesta = await solicitarRestablecimiento(
          solicitarRestablecimientoSchema.parse(value),
        );
        toast.success(respuesta.mensaje);
        form.reset();
      } catch (error) {
        toast.error(getMensajeDeErrorAuth(error));
      }
    },
  });

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
                Restablecer acceso
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Restablecer contraseña
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Ingrese su correo y le enviaremos un enlace para crear una nueva
              contraseña.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
            noValidate
          >
            <FieldGroup className="gap-5">
              <form.Field name="correo">
                {(field) => {
                  const errors = fieldErrors(field.state.meta.errors);
                  const invalid = errors.length > 0;
                  return (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor={field.name} required>
                        Correo electrónico
                      </FieldLabel>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id={field.name}
                          type="email"
                          autoComplete="email"
                          placeholder="usuario@ctp27abril.ed.cr"
                          className="h-12 pl-11"
                          aria-invalid={invalid}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />
                      </div>
                      <FieldError errors={errors} />
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(enviando) => (
                <Button
                  type="submit"
                  disabled={enviando}
                  className="mt-7 h-12 w-full rounded-xl"
                >
                  {enviando ? "Enviando…" : "Enviar enlace"}
                </Button>
              )}
            </form.Subscribe>
          </form>

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
