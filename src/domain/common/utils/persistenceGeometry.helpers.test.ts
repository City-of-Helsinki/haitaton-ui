import { extractPersistedArray, getCurrentArray, FormContextLike } from './persistenceGeometry';

describe('extractPersistedArray', () => {
  test('returns undefined for non-object raw', () => {
    expect(extractPersistedArray(null, 'areas')).toBeUndefined();
    expect(extractPersistedArray('string' as unknown, 'areas')).toBeUndefined();
  });

  test('extracts top-level snapshot key', () => {
    const raw = { areas: [{ geometry: null }], other: 1 };
    const result = extractPersistedArray(raw, 'areas');
    expect(Array.isArray(result)).toBe(true);
    expect((result as unknown[]).length).toBe(1);
  });

  test('extracts __geometry fallback', () => {
    const raw = { __geometry: { areas: [{ geometry: null }, { geometry: null }] } };
    const result = extractPersistedArray(raw, 'areas');
    expect(Array.isArray(result)).toBe(true);
    expect((result as unknown[]).length).toBe(2);
  });
});

describe('getCurrentArray', () => {
  const makeCtx = (arr: unknown) =>
    ({
      getValues: (path?: string) => {
        void path;
        return arr;
      },
      setValue: () => undefined,
    }) as FormContextLike;

  test('returns undefined for non-array', () => {
    const ctx = makeCtx({});
    expect(getCurrentArray(ctx, 'foo')).toBeUndefined();
  });

  test('returns array when present', () => {
    const ctx = makeCtx([{ a: 1 }, { b: 2 }]);
    const arr = getCurrentArray(ctx, 'foo');
    expect(Array.isArray(arr)).toBe(true);
    expect((arr as unknown[]).length).toBe(2);
  });
});
