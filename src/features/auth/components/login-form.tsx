"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldAlert,
} from "lucide-react";
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
import {
  getMensajeDeErrorAuth,
  segundosDeBloqueo,
} from "../servicios/auth.service";
import { loginSchema } from "../validacion/auth.validacion";

/** mm:ss para la cuenta regresiva del bloqueo. */
function formatearEspera(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  return `${minutos}:${String(resto).padStart(2, "0")}`;
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [mostrarContrasena, setMostrarContrasena] =
    useState(false);

  /**
   * Segundos que faltan para poder reintentar tras agotar los intentos.
   *
   * Es solo comodidad: quien lo desee puede saltarse este bloqueo recargando la
   * página o llamando a la API directamente, y el backend lo rechazará igual.
   * La validación real vive allí.
   */
  const [esperaSegundos, setEsperaSegundos] = useState(0);
  const bloqueado = esperaSegundos > 0;

  // El intervalo se crea al empezar el bloqueo y se destruye al terminar, no en
  // cada segundo: la dependencia es el booleano, no el contador.
  useEffect(() => {
    if (!bloqueado) return;

    const id = setInterval(() => {
      setEsperaSegundos((restante) => Math.max(0, restante - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [bloqueado]);

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

        toast.success(
          "Sesión iniciada correctamente.",
        );

        router.replace("/dashboard");
      } catch (error) {
        const espera = segundosDeBloqueo(error);
        if (espera !== null) {
          setEsperaSegundos(espera);
        }

        toast.error(
          getMensajeDeErrorAuth(error),
        );
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
      className="flex w-full flex-col"
    >
      <FieldGroup className="gap-5">

        {/* ============================
            CORREO
            ============================ */}

        <form.Field name="correo">
          {(field) => {
            const errors = fieldErrors(
              field.state.meta.errors,
            );

            const invalid =
              errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  required
                  className="
                    mb-2
                    text-xs
                    font-semibold
                    text-[#4b5348]
                  "
                >
                  Correo electrónico
                </FieldLabel>

                <div className="group relative">
                  <Mail
                    className="
                      pointer-events-none
                      absolute
                      top-1/2
                      left-4
                      size-[17px]
                      -translate-y-1/2
                      text-[#92998e]
                      transition-colors
                      duration-200
                      group-focus-within:text-[#637a36]
                    "
                  />

                  <Input
                    id={field.name}
                    type="email"
                    autoComplete="email"
                    placeholder="usuario@ctp27abril.ed.cr"
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(
                        event.target.value,
                      )
                    }
                    className="
                      h-12
                      rounded-xl
                      border-[#dde3da]
                      bg-[#fafbf9]
                      pr-4
                      pl-11
                      text-sm
                      text-[#252b23]
                      shadow-none
                      transition-all
                      duration-200

                      placeholder:text-[#a4aba0]

                      hover:border-[#cfd7cb]

                      focus-visible:border-[#8da267]
                      focus-visible:bg-white
                      focus-visible:ring-4
                      focus-visible:ring-[#637a36]/10
                    "
                  />
                </div>

                {invalid ? (
                  <FieldError
                    errors={errors}
                    className="mt-1 text-xs"
                  />
                ) : null}
              </Field>
            );
          }}
        </form.Field>

        {/* ============================
            CONTRASEÑA
            ============================ */}

        <form.Field name="contrasena">
          {(field) => {
            const errors = fieldErrors(
              field.state.meta.errors,
            );

            const invalid =
              errors.length > 0;

            return (
              <Field data-invalid={invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  required
                  className="
                    mb-2
                    text-xs
                    font-semibold
                    text-[#4b5348]
                  "
                >
                  Contraseña
                </FieldLabel>

                <div className="group relative">
                  <Lock
                    className="
                      pointer-events-none
                      absolute
                      top-1/2
                      left-4
                      size-[17px]
                      -translate-y-1/2
                      text-[#92998e]
                      transition-colors
                      duration-200
                      group-focus-within:text-[#637a36]
                    "
                  />

                  <Input
                    id={field.name}
                    type={
                      mostrarContrasena
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-invalid={invalid}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(
                        event.target.value,
                      )
                    }
                    className="
                      h-12
                      rounded-xl
                      border-[#dde3da]
                      bg-[#fafbf9]
                      pr-12
                      pl-11
                      text-sm
                      text-[#252b23]
                      shadow-none
                      transition-all
                      duration-200

                      placeholder:text-[#a4aba0]

                      hover:border-[#cfd7cb]

                      focus-visible:border-[#8da267]
                      focus-visible:bg-white
                      focus-visible:ring-4
                      focus-visible:ring-[#637a36]/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarContrasena(
                        (valor) => !valor,
                      )
                    }
                    className="
                      absolute
                      top-1/2
                      right-1
                      flex
                      size-10
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      text-[#92998e]
                      transition-all
                      duration-200

                      hover:bg-[#eef2eb]
                      hover:text-[#596153]
                    "
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

                {invalid ? (
                  <FieldError
                    errors={errors}
                    className="mt-1 text-xs"
                  />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      {/* ============================
          BOTÓN LOGIN
          ============================ */}

      {bloqueado ? (
        <div
          role="alert"
          aria-live="polite"
          className="
            mt-6
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-[#e6d3b8]
            bg-[#fdf7ec]
            px-4
            py-3
          "
        >
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-[#a8791f]" />

          <div className="text-xs leading-5 text-[#6b5426]">
            <p className="font-semibold">
              Demasiados intentos fallidos
            </p>
            <p>
              Por seguridad, espere{" "}
              <span className="font-semibold tabular-nums">
                {formatearEspera(esperaSegundos)}
              </span>{" "}
              antes de volver a intentarlo.
            </p>
          </div>
        </div>
      ) : null}

      <form.Subscribe
        selector={(state) =>
          state.isSubmitting
        }
      >
        {(isSubmitting) => (
          <Button
            type="submit"
            disabled={isSubmitting || bloqueado}
            className="
              group
              mt-7
              h-12
              w-full
              rounded-xl
              border
              border-[#242a23]
              bg-[#242a23]
              text-sm
              font-semibold
              text-white

              shadow-[0_10px_24px_rgba(28,34,27,0.15)]

              transition-all
              duration-200

              hover:-translate-y-0.5
              hover:border-[#34452d]
              hover:bg-[#34452d]
              hover:shadow-[0_14px_28px_rgba(28,34,27,0.2)]

              active:translate-y-0
              active:scale-[0.995]

              disabled:pointer-events-none
              disabled:opacity-70
            "
          >
            {isSubmitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Ingresando...
              </>
            ) : (
              <>
                Iniciar sesión

                <ArrowRight
                  className="
                    size-4
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                />
              </>
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}