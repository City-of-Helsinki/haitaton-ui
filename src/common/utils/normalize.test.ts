import { normalizeEmptyToNull, normalizeStringEmptyToNull } from './normalize';

describe('normalizeEmptyToNull', () => {
  it('returns null for empty string', () => {
    expect(normalizeEmptyToNull('')).toBeNull();
  });
  it('returns null for undefined', () => {
    expect(normalizeEmptyToNull(undefined)).toBeNull();
  });
  it('returns value for non-empty input', () => {
    expect(normalizeEmptyToNull('abc')).toBe('abc');
    expect(normalizeEmptyToNull(0)).toBe(0);
  });
});

describe('normalizeStringEmptyToNull', () => {
  it('returns null for empty string', () => {
    expect(normalizeStringEmptyToNull('')).toBeNull();
  });
  it('returns null for undefined', () => {
    expect(normalizeStringEmptyToNull(undefined)).toBeNull();
  });
  it('returns original string when not empty', () => {
    expect(normalizeStringEmptyToNull('value')).toBe('value');
  });
  it('returns null when value is null', () => {
    expect(normalizeStringEmptyToNull(null)).toBeNull();
  });
});
