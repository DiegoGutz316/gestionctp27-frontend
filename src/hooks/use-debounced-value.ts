"use client";

import { useEffect, useState } from "react";

/**
 * Devuelve `value` con un retraso de `delayMs`, reiniciando el temporizador
 * en cada cambio. Útil para no disparar una petición por cada tecla en
 * campos de búsqueda.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debounced;
}
