import { haveHaittaIndexesIncreased } from './utils';
import { HAITTA_INDEX_TYPE, HaittaIndexData } from './types';

describe('haveHaittaIndexesIncreased', () => {
  const previousData: HaittaIndexData = {
    liikennehaittaindeksi: {
      indeksi: 4,
      tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
    },
    autoliikenne: {
      indeksi: 2.5,
      haitanKesto: 3,
      katuluokka: 3,
      liikennemaara: 3,
      kaistahaitta: 1,
      kaistapituushaitta: 1,
    },
    linjaautoliikenneindeksi: 2,
    raitioliikenneindeksi: 3,
    pyoraliikenneindeksi: 4,
  };

  test('should return false if previousData is not provided', () => {
    const data: HaittaIndexData = { ...previousData };
    expect(haveHaittaIndexesIncreased(data)).toBe(false);
  });

  test('should return false if all indexes are the same', () => {
    const data: HaittaIndexData = { ...previousData };
    expect(haveHaittaIndexesIncreased(data, previousData)).toBe(false);
  });

  test('should return true if autoliikenne index has increased', () => {
    const data: HaittaIndexData = {
      ...previousData,
      autoliikenne: { ...previousData.autoliikenne, indeksi: 3 },
    };
    expect(haveHaittaIndexesIncreased(data, previousData)).toBe(true);
  });

  test('should return true if linjaautoliikenneindeksi has increased', () => {
    const data: HaittaIndexData = { ...previousData, linjaautoliikenneindeksi: 3 };
    expect(haveHaittaIndexesIncreased(data, previousData)).toBe(true);
  });

  test('should return true if raitioliikenneindeksi has increased', () => {
    const data: HaittaIndexData = { ...previousData, raitioliikenneindeksi: 4 };
    expect(haveHaittaIndexesIncreased(data, previousData)).toBe(true);
  });

  test('should return true if pyoraliikenneindeksi has increased', () => {
    const data: HaittaIndexData = { ...previousData, pyoraliikenneindeksi: 5 };
    expect(haveHaittaIndexesIncreased(data, previousData)).toBe(true);
  });

  test('should return false if all indexes have decreased or stayed the same', () => {
    const data: HaittaIndexData = {
      liikennehaittaindeksi: {
        indeksi: 3,
        tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
      },
      autoliikenne: { ...previousData.autoliikenne, indeksi: 2 },
      linjaautoliikenneindeksi: 1,
      raitioliikenneindeksi: 2,
      pyoraliikenneindeksi: 3,
    };
    expect(haveHaittaIndexesIncreased(data, previousData)).toBe(false);
  });
});
