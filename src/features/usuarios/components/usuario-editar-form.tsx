"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  ETIQUETA_ROL,
  ROLES_USUARIO,
  type RolUsuario,
} from "../models/usuario.model";
import {
  editarUsuarioSchema,
  type EditarUsuarioInput,
  type UsuarioRespuesta,
} from "../validacion/usuario.validacion";
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
import { useEditarUsuario } from "../hooks/hooks";
import { getMensajeDeError } from "../servicios/usuarios.service";

const rolesItems = ROLES_USUARIO.map((rol) => ({
  value: rol,
  label: ETIQUETA_ROL[rol],
}));

export function UsuarioEditarForm({
  usuario,
}: {
  usuario: UsuarioRespuesta;
}) {
  const router = useRouter();
  const editarUsuario = useEditarUsuario(usuario.id);

  const valoresIniciales: EditarUsuarioInput = {
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol,
    activo: usuario.activo,
  };

  const form = useForm({
    defaultValues: valoresIniciales,
    validators: {
      onSubmit: zodValidator(editarUsuarioSchema),
    },
    onSubmit: async ({ value }) => {
      try {
        const actualizado = await editarUsuario.mutateAsync(
          editarUsuarioSchema.parse(value),
        );
        toast.success(
          `Usuario "${actualizado.nombre}" actualizado correctamente.`,
        );
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
                <FieldLabel htmlFor={field.name}>Nombre completo</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Correo electrónico</FieldLabel>
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

        <form.Field name="rol">
          {(field) => {
            const errors = fieldErrors(field.state.meta.errors);
            const invalid = errors.length > 0;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Rol</FieldLabel>
                <Select
                  items={rolesItems}
                  value={field.state.value}
                  onValueChange={(valor) =>
                    field.handleChange(valor as RolUsuario)
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
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                  aria-invalid={invalid}
                />
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe
          selector={(state) =>
            state.isSubmitting || editarUsuario.isPending
          }
        >
          {(guardando) => (
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar cambios"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
