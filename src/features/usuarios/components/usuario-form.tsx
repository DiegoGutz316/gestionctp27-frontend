"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  ETIQUETA_ROL,
  ROLES_USUARIO,
  type RolUsuario,
} from "../models/usuario.model";
import { crearUsuarioSchema } from "../validacion/usuario.validacion";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { fieldErrors } from "@/lib/form-errors";
import { zodValidator } from "@/lib/zod-form";
import { useCrearUsuario } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/usuarios.service";

const rolesItems = ROLES_USUARIO.map((rol) => ({
  value: rol,
  label: ETIQUETA_ROL[rol],
}));

export function UsuarioForm() {
  const router = useRouter();
  const crearUsuario = useCrearUsuario();

  const form = useForm({
    defaultValues: {
      nombre: "",
      correo: "",
      contrasena: "",
      // Vacío hasta que el usuario elija; crearUsuarioSchema lo valida.
      rol: "" as RolUsuario | "",
      activo: true,
    },
    validators: {
      onSubmit: zodValidator(crearUsuarioSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const usuario = await crearUsuario.mutateAsync(
          crearUsuarioSchema.parse(value),
        );
        toast.success(`Usuario "${usuario.nombre}" registrado correctamente.`);
        router.push("/dashboard/usuarios");
      } catch (error) {
        toast.error(getMensajeDeError(error));
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
    >
      <FieldGroup>
        <form.Field name="nombre">
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
                  placeholder="Ej: María Fernández"
                  autoComplete="name"
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

        <form.Field name="correo">
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
                  placeholder="usuario@ctp27abril.ed.cr"
                  autoComplete="email"
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

        <form.Field name="contrasena">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Contraseña
                </FieldLabel>
                <Input
                  id={field.name}
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
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

        <form.Field name="rol">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name} required>
                  Rol
                </FieldLabel>
                <Select
                  items={rolesItems}
                  value={field.state.value === "" ? null : field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange((valor as RolUsuario | null) ?? "")
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={invalid}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesItems.map((item) => (
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

        <form.Field name="activo">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field orientation="horizontal" data-invalid={invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Usuario activo</FieldLabel>
                  <FieldDescription>
                    Si está inactivo, no podrá iniciar sesión en el sistema.
                  </FieldDescription>
                  {invalid ? <FieldError errors={errors} /> : null}
                </FieldContent>
                <Switch
                  id={field.name}
                  checked={field.state.value !== false}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                  aria-invalid={invalid}
                />
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe
          selector={(state) =>
            state.isSubmitting || crearUsuario.isPending
          }
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar usuario"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
