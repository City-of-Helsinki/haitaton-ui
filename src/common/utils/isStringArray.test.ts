import isStringArray from './isStringArray';

describe('isStringArray', () => {
  test('returns true for an array of strings', () => {
    expect(isStringArray(['a', 'b', 'c'])).toBe(true);
  });

  test('returns false for an array of numbers', () => {
    expect(isStringArray([1, 2, 3])).toBe(false);
  });

  test('returns false for an array of mixed types', () => {
    expect(isStringArray(['a', 1, 'b'])).toBe(false);
  });

  test('returns false for a string', () => {
    expect(isStringArray('string')).toBe(false);
  });

  test('returns false for an object', () => {
    expect(isStringArray({ key: 'value' })).toBe(false);
  });

  test('returns false for null', () => {
    expect(isStringArray(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isStringArray(undefined)).toBe(false);
  });

  test('returns false for an empty object', () => {
    expect(isStringArray({})).toBe(false);
  });

  test('returns true for an empty array', () => {
    expect(isStringArray([])).toBe(true);
  });
});
