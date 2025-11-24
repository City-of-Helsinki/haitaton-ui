import {
  extractPersistedArray,
  getCurrentArray,
  FormContextLike,
  areasInclude,
} from './persistenceGeometry';

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

describe('areasInclude', () => {
  test('returns false for null arrays', () => {
    expect(areasInclude(null, { hankealueId: 1 } as Record<string, unknown>)).toBe(false);
  });

  test('detects matching area by hankealueId', () => {
    const areas = [{ hankealueId: 1 }, { hankealueId: 2 }].map((a) => a as Record<string, unknown>);
    expect(areasInclude(areas, { hankealueId: 2 } as Record<string, unknown>)).toBe(true);
  });
});
