/**
 * Converts an unknown value to an array of strings.
 */
export default function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string');
  } else {
    return [];
  }
}
