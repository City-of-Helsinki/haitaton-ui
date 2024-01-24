import { styleFunction, STYLES } from './geometryStyle';

describe('styleFunction', () => {
  it.each([
    [null, STYLES.BLUE],
    [undefined, STYLES.BLUE],
    [0.9, STYLES.GREEN],
    [1, STYLES.GREEN],
    [2, STYLES.GREEN],
    [2.9, STYLES.GREEN],
    [3, STYLES.YELLOW],
    [3.9, STYLES.YELLOW],
    [4, STYLES.RED],
    [5, STYLES.RED],
  ])('when liikennehaittaindeksi is %s, style is %s', (liikennehaittaindeksi, expectedStyle) => {
    expect(styleFunction({ get: () => liikennehaittaindeksi }, undefined, false)).toBe(
      expectedStyle,
    );
  });
});
