import { getStatusByIndex, getColorByStatus, LIIKENNEHAITTA_STATUS } from './liikennehaittaindeksi';

const INDEX_BLUE = `rgba(0, 98, 185, 1)`;
const INDEX_GREEN = `rgba(0, 146, 70, 1)`;
const INDEX_GREY = `rgba(176, 184, 191, 1)`;
const INDEX_YELLOW = `rgba(255, 218, 7, 1)`;
const INDEX_RED = 'rgba(196, 18, 62, 1)';

describe('Liikennehaittaindeksi utils', () => {
  test('status and color with null should be blue', async () => {
    const status = getStatusByIndex(null);
    expect(status).toBe(LIIKENNEHAITTA_STATUS.BLUE);
    expect(getColorByStatus(status)).toBe(INDEX_BLUE);
  });

  test('status and color with 0 should be green', async () => {
    const status = getStatusByIndex(0);
    expect(status).toBe(LIIKENNEHAITTA_STATUS.GREY);
    expect(getColorByStatus(status)).toBe(INDEX_GREY);
  });

  test('status and color with 2.9 should be green', async () => {
    const status = getStatusByIndex(2.9);
    expect(status).toBe(LIIKENNEHAITTA_STATUS.GREEN);
    expect(getColorByStatus(status)).toBe(INDEX_GREEN);
  });

  test('status and color with 3 should be yellow', async () => {
    const status = getStatusByIndex(3);
    expect(status).toBe(LIIKENNEHAITTA_STATUS.YELLOW);
    expect(getColorByStatus(status)).toBe(INDEX_YELLOW);
  });

  test('status and color with 4 should be red', async () => {
    const status = getStatusByIndex(4);
    expect(status).toBe(LIIKENNEHAITTA_STATUS.RED);
    expect(getColorByStatus(status)).toBe(INDEX_RED);
  });

  test('status and color with 5 should be red', async () => {
    const status = getStatusByIndex(5);
    expect(status).toBe(LIIKENNEHAITTA_STATUS.RED);
    expect(getColorByStatus(status)).toBe(INDEX_RED);
  });
});
