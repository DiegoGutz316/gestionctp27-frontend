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
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";
import { useAuth } from "../context/auth-context";
import { getMensajeDeErrorAuth } from "../servicios/auth.service";
import { loginSchema } from "../validacion/auth.validacion";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

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
      className="w-full"
    >
      <FieldGroup>
        <form.Field name="correo">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Correo</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="usuario@ctp27.ed.cr"
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
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
                <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
                <Input
                  id={field.name}
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={invalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {invalid ? <FieldError errors={errors} /> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Ingresando…" : "Iniciar sesión"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
