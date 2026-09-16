import { useState, useCallback } from "react";

export function useFormState<T extends Record<string, unknown>>(
  initialValues: T,
) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback(
    <K extends keyof T>(field: K) =>
      (value: T[K]) =>
        setValues((prev) => ({ ...prev, [field]: value })),
    [],
  );

  const reset = useCallback(() => setValues(initialValues), [initialValues]);

  return { values, handleChange, setValues, reset };
}
