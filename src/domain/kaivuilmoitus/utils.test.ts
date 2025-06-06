import { calculateLiikennehaittaindeksienYhteenveto, hasHaittaIndexesChanged } from './utils';
import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../common/haittaIndexes/types';
import { ApplicationGeometry, KaivuilmoitusAlue } from '../application/types/application';

const geometry: ApplicationGeometry = {
  coordinates: [
    [
      [0, 0],
      [1, 1],
      [2, 2],
      [0, 0],
    ],
  ],
  type: 'Polygon',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:EPSG::3879',
    },
  },
};

const kaivuilmoitusalue: KaivuilmoitusAlue = {
  name: 'testialue',
  hankealueId: 1,
  katuosoite: 'Kotikatu 1',
  tyonTarkoitukset: ['VESI'],
  meluhaitta: 'EI_MELUHAITTAA',
  polyhaitta: 'EI_POLYHAITTAA',
  tarinahaitta: 'EI_TARINAHAITTAA',
  kaistahaitta: 'EI_VAIKUTA',
  kaistahaittojenPituus: 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
  tyoalueet: [
    {
      geometry: geometry,
      area: 1,
      tormaystarkasteluTulos: {
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
    },
    {
      geometry: geometry,
      area: 1,
      tormaystarkasteluTulos: {
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
    },
    {
      geometry: geometry,
      area: 1,
      tormaystarkasteluTulos: {
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
    },
  ],
};

describe('calculateLiikennehaittaindeksienYhteenveto', () => {
  test('returns correct summary', async () => {
    const summary = calculateLiikennehaittaindeksienYhteenveto(kaivuilmoitusalue);

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

describe('hasHaittaIndexesChanged', () => {
  test('returns true if haittaIndexes have increased', async () => {
    const changedArea: KaivuilmoitusAlue = {
      ...kaivuilmoitusalue,
      tyoalueet: [
        kaivuilmoitusalue.tyoalueet[0],
        kaivuilmoitusalue.tyoalueet[1],
        {
          ...kaivuilmoitusalue.tyoalueet[2],
          tormaystarkasteluTulos: {
            ...(kaivuilmoitusalue.tyoalueet[2].tormaystarkasteluTulos as HaittaIndexData),
            autoliikenne: {
              indeksi: 5,
              haitanKesto: 5,
              katuluokka: 5,
              liikennemaara: 5,
              kaistahaitta: 5,
              kaistapituushaitta: 5,
            },
          },
        },
      ],
    };

    const hasChanged = hasHaittaIndexesChanged(kaivuilmoitusalue, changedArea);

    expect(hasChanged).toBe(true);
  });

  test('returns true if haittaIndexes have decreased', async () => {
    const changedArea: KaivuilmoitusAlue = {
      ...kaivuilmoitusalue,
      tyoalueet: [
        kaivuilmoitusalue.tyoalueet[0],
        kaivuilmoitusalue.tyoalueet[1],
        {
          ...kaivuilmoitusalue.tyoalueet[2],
          tormaystarkasteluTulos: {
            ...(kaivuilmoitusalue.tyoalueet[2].tormaystarkasteluTulos as HaittaIndexData),
            autoliikenne: {
              indeksi: 3,
              haitanKesto: 3,
              katuluokka: 3,
              liikennemaara: 3,
              kaistahaitta: 3,
              kaistapituushaitta: 3,
            },
          },
        },
      ],
    };

    const hasChanged = hasHaittaIndexesChanged(kaivuilmoitusalue, changedArea);

    expect(hasChanged).toBe(true);
  });

  test('returns false if haittaIndexes are the same', async () => {
    const changedArea: KaivuilmoitusAlue = {
      ...kaivuilmoitusalue,
      tyoalueet: [
        kaivuilmoitusalue.tyoalueet[0],
        kaivuilmoitusalue.tyoalueet[1],
        {
          ...kaivuilmoitusalue.tyoalueet[2],
          tormaystarkasteluTulos: {
            ...(kaivuilmoitusalue.tyoalueet[2].tormaystarkasteluTulos as HaittaIndexData),
            autoliikenne: {
              indeksi: 4,
              haitanKesto: 5,
              katuluokka: 3,
              liikennemaara: 5,
              kaistahaitta: 3,
              kaistapituushaitta: 3,
            },
          },
        },
      ],
    };

    const hasChanged = hasHaittaIndexesChanged(kaivuilmoitusalue, changedArea);

    expect(hasChanged).toBe(false);
  });
});
