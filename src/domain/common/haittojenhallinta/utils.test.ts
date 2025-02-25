import { getHaittaIndexForTyyppi, sortedLiikenneHaittojenhallintatyyppi } from './utils';
import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../../common/haittaIndexes/types';
import { HAITTOJENHALLINTATYYPPI } from '../../common/haittojenhallinta/types';

test('Should sort nuisance types correctly', () => {
  const tormaysTarkastelunTulos: HaittaIndexData = {
    autoliikenne: {
      indeksi: 1.0,
      haitanKesto: 1,
      katuluokka: 1,
      liikennemaara: 1,
      kaistahaitta: 1,
      kaistapituushaitta: 1,
    },
    pyoraliikenneindeksi: 3.0,
    linjaautoliikenneindeksi: 1.0,
    raitioliikenneindeksi: 0.0,
    liikennehaittaindeksi: {
      indeksi: 3.0,
      tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
    },
  };

  const sorted: [string, number][] = sortedLiikenneHaittojenhallintatyyppi(tormaysTarkastelunTulos);

  expect(sorted).toEqual([
    [HAITTOJENHALLINTATYYPPI.PYORALIIKENNE, 3.0],
    [HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE, 1.0],
    [HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE, 1.0],
    [HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE, 0.0],
  ]);
});

test('Should sort nuisance types in default order if tormaysTarkastelunTulos is undefined', () => {
  const tormaysTarkastelunTulos: HaittaIndexData | undefined = undefined;

  const sorted = sortedLiikenneHaittojenhallintatyyppi(tormaysTarkastelunTulos);

  expect(sorted).toEqual([
    [HAITTOJENHALLINTATYYPPI.PYORALIIKENNE, 0.0],
    [HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE, 0.0],
    [HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE, 0.0],
    [HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE, 0.0],
  ]);
});

describe('getHaittaIndexForTyyppi', () => {
  const tormaysTarkastelunTulos: HaittaIndexData = {
    autoliikenne: {
      indeksi: 2.0,
      haitanKesto: 1,
      katuluokka: 1,
      liikennemaara: 1,
      kaistahaitta: 1,
      kaistapituushaitta: 1,
    },
    pyoraliikenneindeksi: 5.0,
    linjaautoliikenneindeksi: 1.0,
    raitioliikenneindeksi: 0.0,
    liikennehaittaindeksi: {
      indeksi: 3.0,
      tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
    },
  };

  test.each([
    [HAITTOJENHALLINTATYYPPI.PYORALIIKENNE, 5.0],
    [HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE, 2.0],
    [HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE, 1.0],
    [HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE, 0.0],
  ])('Should return correct haitta index for %s', (haittojenhallintaTyyppi, expected) => {
    const haittaIndex = getHaittaIndexForTyyppi(tormaysTarkastelunTulos, haittojenhallintaTyyppi);

    expect(haittaIndex).toEqual(expected);
  });
});
