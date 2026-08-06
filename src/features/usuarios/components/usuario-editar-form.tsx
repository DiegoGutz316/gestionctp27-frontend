"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  editarUsuarioSchema,
  ETIQUETA_ROL,
  ROLES_USUARIO,
  type EditarUsuario,
  type EditarUsuarioInput,
  type UsuarioRespuesta,
} from "../models/usuario.model";
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

  const form = useForm<EditarUsuarioInput, unknown, EditarUsuario>({
    resolver: zodResolver(editarUsuarioSchema),
    defaultValues: {
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      activo: usuario.activo,
    },
  });

  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((datos) => {
    editarUsuario.mutate(datos, {
      onSuccess: (actualizado) => {
        toast.success(
          `Usuario "${actualizado.nombre}" actualizado correctamente.`,
        );
        router.push("/dashboard/usuarios");
      },
      onError: (error) => {
        toast.error(getMensajeDeError(error));
      },
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.nombre}>
          <FieldLabel htmlFor="nombre">Nombre completo</FieldLabel>
          <Input
            id="nombre"
            placeholder="Ej: María Fernández"
            autoComplete="name"
            aria-invalid={!!errors.nombre}
            {...form.register("nombre")}
          />
          <FieldError errors={[errors.nombre]} />
        </Field>

        <Field data-invalid={!!errors.correo}>
          <FieldLabel htmlFor="correo">Correo electrónico</FieldLabel>
          <Input
            id="correo"
            type="email"
            placeholder="usuario@ctp27abril.ed.cr"
            autoComplete="email"
            aria-invalid={!!errors.correo}
            {...form.register("correo")}
          />
          <FieldError errors={[errors.correo]} />
        </Field>

        <Field data-invalid={!!errors.rol}>
          <FieldLabel htmlFor="rol">Rol</FieldLabel>
          <Controller
            control={form.control}
            name="rol"
            render={({ field }) => (
              <Select
                items={rolesItems}
                value={field.value}
                onValueChange={(valor) => field.onChange(valor)}
              >
                <SelectTrigger
                  id="rol"
                  className="w-full"
                  aria-invalid={!!errors.rol}
                  onBlur={field.onBlur}
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
            )}
          />
          <FieldError errors={[errors.rol]} />
        </Field>

        <Controller
          control={form.control}
          name="activo"
          render={({ field, fieldState }) => (
            <Field
              orientation="horizontal"
              data-invalid={fieldState.invalid}
            >
              <FieldContent>
                <FieldLabel htmlFor="activo">Usuario activo</FieldLabel>
                <FieldDescription>
                  Si está inactivo, no podrá iniciar sesión en el sistema.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Switch
                id="activo"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
            </Field>
          )}
        />

        <Button type="submit" disabled={editarUsuario.isPending}>
          {editarUsuario.isPending ? "Guardando…" : "Guardar cambios"}
        </Button>
      </FieldGroup>
    </form>
  );
}
