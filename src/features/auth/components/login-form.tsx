"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
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
import { useAuth } from "../context/auth-context";
import { getMensajeDeErrorAuth } from "../servicios/auth.service";
import { loginSchema } from "../validacion/auth.validacion";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const form = useForm({
    defaultValues: {
      correo: "",
      contrasena: "",
    },
    validators: {
      onSubmit: zodValidator(loginSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        await login(loginSchema.parse(value));
        toast.success("Sesión iniciada correctamente.");
        router.replace("/dashboard");
      } catch (error) {
        toast.error(getMensajeDeErrorAuth(error));
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
      className="flex w-full flex-col gap-5"
    >
      <FieldGroup>
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
                  <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={field.name}
                    type="email"
                    autoComplete="email"
                    placeholder="usuario@ctp27.ed.cr"
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    className="pl-9"
                  />
                </div>
                {invalid ? <FieldError errors={errors} /> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="contrasena">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Contraseña
                </FieldLabel>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={field.name}
                    type={mostrarContrasena ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    className="pr-10 pl-9"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContrasena((valor) => !valor)}
                    className="absolute top-1/2 right-1 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                    aria-label={
                      mostrarContrasena
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {mostrarContrasena ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {invalid ? <FieldError errors={errors} /> : null}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando…" : "Iniciar sesión"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
