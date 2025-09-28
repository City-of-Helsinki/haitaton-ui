import { styleFunction, STYLES } from './geometryStyle';
import { FeatureLike } from 'ol/Feature';

// Mock FeatureLike object for testing
const createMockFeature = (properties: Record<string, unknown>): FeatureLike => {
  return {
    getProperties: () => properties,
  } as unknown as FeatureLike;
};

describe('styleFunction', () => {
  it.each([
    [null, STYLES.BLUE],
    [undefined, STYLES.BLUE],
    [0, STYLES.GREY],
    [0.9, STYLES.GREEN],
    [1, STYLES.GREEN],
    [2, STYLES.GREEN],
    [2.9, STYLES.GREEN],
    [3, STYLES.YELLOW],
    [3.9, STYLES.YELLOW],
    [4, STYLES.RED],
    [5, STYLES.RED],
  ])('when liikennehaittaindeksi is %s, style is %s', (liikennehaittaindeksi, expectedStyle) => {
    expect(
      styleFunction(
        createMockFeature({ liikennehaittaindeksi, statusKey: undefined }),
        undefined,
        false,
      ),
    ).toBe(expectedStyle);
  });

  it('when statusKey is LAVENDER_BLUE, style is STYLES.LAVENDER_BLUE', () => {
    expect(
      styleFunction(
        createMockFeature({ liikennehaittaindeksi: undefined, statusKey: 'LAVENDER_BLUE' }),
        undefined,
        false,
      ),
    ).toBe(STYLES.LAVENDER_BLUE);
  });
});
