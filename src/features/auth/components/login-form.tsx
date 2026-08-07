"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/auth-context";
import type { LoginDatos, LoginInput } from "../models/auth.model";
import { getMensajeDeErrorAuth } from "../servicios/auth.service";
import { loginSchema } from "../validacion/auth.validacion";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<LoginInput, unknown, LoginDatos>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      correo: "",
      contrasena: "",
    },
  });

  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (datos) => {
    try {
      await login(datos);
      toast.success("Sesión iniciada correctamente.");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(getMensajeDeErrorAuth(error));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <FieldGroup>
        <Field data-invalid={!!errors.correo}>
          <FieldLabel htmlFor="correo">Correo</FieldLabel>
          <Input
            id="correo"
            type="email"
            autoComplete="email"
            placeholder="usuario@ctp27.ed.cr"
            aria-invalid={!!errors.correo}
            {...form.register("correo")}
          />
          {errors.correo ? (
            <FieldError>{errors.correo.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={!!errors.contrasena}>
          <FieldLabel htmlFor="contrasena">Contraseña</FieldLabel>
          <Input
            id="contrasena"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.contrasena}
            {...form.register("contrasena")}
          />
          {errors.contrasena ? (
            <FieldError>{errors.contrasena.message}</FieldError>
          ) : null}
        </Field>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Ingresando…" : "Iniciar sesión"}
        </Button>
      </FieldGroup>
    </form>
  );
}
