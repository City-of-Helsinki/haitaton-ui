/**
 * Checks if the given value is an array of strings.
 *
 * @param value - The value to check.
 * @returns True if the value is an array of strings, otherwise false.
 */
export default function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
