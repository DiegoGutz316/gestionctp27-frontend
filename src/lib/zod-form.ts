import type { z } from "zod";

/**
 * Adaptador para usar schemas Zod (incl. preprocess/transform) con TanStack Form.
 * Standard Schema tipa mal z.preprocess; validamos con safeParse y devolvemos
 * errores por campo en el formato que espera el form.
 */
export function zodValidator<TSchema extends z.ZodType>(schema: TSchema) {
  return ({ value }: { value: unknown }) => {
    const result = schema.safeParse(value);
    if (result.success) return undefined;

    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fields[key]) {
        fields[key] = issue.message;
      }
    }

    return { fields };
  };
}
