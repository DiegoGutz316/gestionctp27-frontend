import type { z } from "zod";

function rutaDeCampo(path: PropertyKey[]): string | null {
  if (path.length === 0) return null;

  let nombre = "";
  for (const parte of path) {
    if (typeof parte === "number") {
      nombre += `[${parte}]`;
      continue;
    }
    if (typeof parte !== "string") return null;
    nombre = nombre === "" ? parte : `${nombre}.${parte}`;
  }

  return nombre === "" ? null : nombre;
}

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
      const key = rutaDeCampo(issue.path);
      if (key && !fields[key]) {
        fields[key] = issue.message;
      }
    }

    return { fields };
  };
}
