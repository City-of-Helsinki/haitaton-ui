// Shared normalization helpers
// Keeps form + persistence logic consistent when translating empty user input into nulls

export function normalizeEmptyToNull<T>(value: T | '' | undefined): T | null {
  return value === '' || value === undefined ? null : (value as T);
}

// Narrow helper for string-ish fields
export function normalizeStringEmptyToNull(value: string | null | undefined): string | null {
  return value === '' || value === undefined ? null : (value ?? null);
}
