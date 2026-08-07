/** Normaliza errores de campo de TanStack Form (+ Zod Standard Schema) para FieldError. */
export function fieldErrors(
  errors: unknown,
): Array<{ message?: string }> {
  if (!Array.isArray(errors) || errors.length === 0) return [];

  return errors
    .map((error) => {
      if (typeof error === "string") return { message: error };
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
      ) {
        return { message: (error as { message: string }).message };
      }
      return null;
    })
    .filter((error): error is { message: string } => Boolean(error?.message));
}
