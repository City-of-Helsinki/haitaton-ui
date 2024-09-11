import { calculateLiikennehaittaindeksienYhteenveto } from './useHaittaIndexSummary';
import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../../common/haittaIndexes/types';

describe('calculateLiikennehaittaindeksienYhteenveto', () => {
  test('returns correct summary', async () => {
    const data: HaittaIndexData[] = [
      {
        liikennehaittaindeksi: {
          indeksi: 5,
          tyyppi: HAITTA_INDEX_TYPE.RAITIOLIIKENNEINDEKSI,
        },
        pyoraliikenneindeksi: 3,
        autoliikenne: {
          indeksi: 2,
          haitanKesto: 3,
          katuluokka: 1,
          liikennemaara: 3,
          kaistahaitta: 2,
          kaistapituushaitta: 1,
        },
        linjaautoliikenneindeksi: 1,
        raitioliikenneindeksi: 5,
      },
      {
        liikennehaittaindeksi: {
          indeksi: 3,
          tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
        },
        pyoraliikenneindeksi: 3,
        autoliikenne: {
          indeksi: 1,
          haitanKesto: 2,
          katuluokka: 2,
          liikennemaara: 2,
          kaistahaitta: 1,
          kaistapituushaitta: 2,
        },
        linjaautoliikenneindeksi: 1,
        raitioliikenneindeksi: 1,
      },
      {
        liikennehaittaindeksi: {
          indeksi: 4,
          tyyppi: HAITTA_INDEX_TYPE.AUTOLIIKENNEINDEKSI,
        },
        pyoraliikenneindeksi: 3,
        autoliikenne: {
          indeksi: 4,
          haitanKesto: 5,
          katuluokka: 3,
          liikennemaara: 5,
          kaistahaitta: 3,
          kaistapituushaitta: 3,
        },
        linjaautoliikenneindeksi: 3,
        raitioliikenneindeksi: 1,
      },
    ];
    const summary = calculateLiikennehaittaindeksienYhteenveto(data);

    expect(summary).toEqual({
      liikennehaittaindeksi: {
        indeksi: 5,
        tyyppi: HAITTA_INDEX_TYPE.RAITIOLIIKENNEINDEKSI,
      },
      pyoraliikenneindeksi: 3,
      autoliikenne: {
        indeksi: 4,
        haitanKesto: 5,
        katuluokka: 3,
        liikennemaara: 5,
        kaistahaitta: 3,
        kaistapituushaitta: 3,
      },
      linjaautoliikenneindeksi: 3,
      raitioliikenneindeksi: 5,
    });
  });
});
