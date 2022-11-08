import { HankeDataDraft } from '../types/hanke';

const hankeDraftList: HankeDataDraft[] = [
  {
    id: 1,
    hankeTunnus: 'HANKE_1',
    onYKTHanke: false,
    nimi: 'Hanke 1',
    kuvaus: '',
    alkuPvm: '2020-11-26T00:00:00Z',
    loppuPvm: '2020-11-17T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-27T11:33:17.0875Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistaja: null,
    rakennuttajat: [],
    toteuttajat: [],
    muutTahot: [],
    tyomaaTyyppi: [],
  },
  {
    id: 2,
    hankeTunnus: 'HANKE_2',
    onYKTHanke: true,
    nimi: 'Hanke 2',
    kuvaus: '',
    alkuPvm: '2020-11-26T00:00:00Z',
    loppuPvm: '2020-11-27T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-27T11:43:43.481215Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistaja: null,
    rakennuttajat: [],
    toteuttajat: [],
    muutTahot: [],
    tyomaaTyyppi: [],
    geometriat: {
      id: 37,
      version: 0,
      hankeId: 2,
      createdByUserId: null,
      modifiedByUserId: null,
      createdAt: '2020-11-27T11:43:43.481215Z',
      modifiedAt: null,
      featureCollection: {
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'urn:ogc:def:crs:EPSG::3879',
          },
        },
        features: [
          {
            type: 'Feature',
            properties: {
              hankeTunnus: 'HANKE_2',
            },
            geometry: {
              type: 'Polygon',
              crs: {
                type: 'name',
                properties: {
                  name: 'EPSG:3879',
                },
              },
              coordinates: [
                [
                  [25496803.95, 6671970.73],
                  [25496808.63, 6672031.04],
                  [25496741.78, 6672035.04],
                  [25496723.8, 6671958.88],
                  [25496803.95, 6671970.73],
                ],
              ],
            },
          },
        ],
      },
    },
  },
  {
    id: 3,
    hankeTunnus: 'HANKE_3',
    onYKTHanke: false,
    nimi: 'Hanke 3',
    kuvaus: '',
    alkuPvm: '2020-11-24T00:00:00Z',
    loppuPvm: '2020-11-20T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-27T11:44:22.443735Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistaja: null,
    rakennuttajat: [],
    toteuttajat: [],
    muutTahot: [],
    tyomaaTyyppi: [],
  },
  {
    id: 4,
    hankeTunnus: 'HANKE_4',
    onYKTHanke: false,
    nimi: 'Hanke 4',
    kuvaus: '',
    alkuPvm: '2020-11-25T00:00:00Z',
    loppuPvm: '2020-11-28T00:00:00Z',
    vaihe: 'RAKENTAMINEN',
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-27T12:07:41.210244Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistaja: null,
    rakennuttajat: [],
    toteuttajat: [],
    muutTahot: [],
    tyomaaTyyppi: [],
  },
  {
    id: 5,
    hankeTunnus: 'HANKE_5',
    onYKTHanke: true,
    nimi: 'Hanke 5',
    kuvaus: '',
    alkuPvm: '2020-11-23T00:00:00Z',
    loppuPvm: '2020-11-20T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T10:37:36.362778Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistaja: null,
    rakennuttajat: [],
    toteuttajat: [],
    muutTahot: [],
    tyomaaTyyppi: [],
  },
  {
    id: 6,
    hankeTunnus: 'HANKE_6',
    onYKTHanke: true,
    nimi: 'Hanke 6',
    kuvaus: '',
    alkuPvm: '2020-11-24T00:00:00Z',
    loppuPvm: '2020-11-28T00:00:00Z',
    vaihe: 'SUUNNITTELU',
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T13:43:13.599591Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistaja: null,
    rakennuttajat: [],
    toteuttajat: [],
    muutTahot: [],
    tyomaaTyyppi: [],
  },
  {
    id: 7,
    hankeTunnus: 'HANKE_7',
    onYKTHanke: true,
    nimi: 'Hanke 7',
    kuvaus: '',
    alkuPvm: '2020-11-24T00:00:00Z',
    loppuPvm: '2020-11-28T00:00:00Z',
    vaihe: 'SUUNNITTELU',
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T13:43:15.322044Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistaja: null,
    rakennuttajat: [],
    toteuttajat: [],
    muutTahot: [],
    tyomaaTyyppi: [],
  },
  {
    id: 8,
    hankeTunnus: 'HANKE_8',
    onYKTHanke: true,
    nimi: 'Hanke 8',
    kuvaus: '',
    alkuPvm: '2020-11-24T00:00:00Z',
    loppuPvm: '2020-11-28T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T13:43:24.301796Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistaja: null,
    rakennuttajat: [],
    toteuttajat: [],
    muutTahot: [],
    tyomaaTyyppi: [],
  },
  {
    id: 9,
    hankeTunnus: 'HANKE_9',
    onYKTHanke: true,
    nimi: 'Hanke 9',
    kuvaus: '',
    alkuPvm: '2020-11-24T00:00:00Z',
    loppuPvm: '2020-11-28T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T13:43:27.330822Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistaja: null,
    rakennuttajat: [],
    toteuttajat: [],
    muutTahot: [],
    tyomaaTyyppi: [],
  },
  {
    id: 10,
    hankeTunnus: 'HANKE_10',
    onYKTHanke: false,
    nimi: 'Hanke 10',
    kuvaus: '',
    alkuPvm: '2020-12-02T00:00:00Z',
    loppuPvm: '2020-12-05T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-12-01T14:22:11.838844Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistaja: null,
    rakennuttajat: [],
    toteuttajat: [],
    muutTahot: [],
    tyomaaTyyppi: [],
  },
  {
    id: 11,
    hankeTunnus: 'HANKE_11',
    onYKTHanke: false,
    nimi: 'Hanke 11',
    kuvaus: '',
    alkuPvm: '2020-12-02T00:00:00Z',
    loppuPvm: '2020-11-28T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-12-01T14:34:24.443622Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistaja: null,
    rakennuttajat: [],
    toteuttajat: [],
    muutTahot: [],
    tyomaaTyyppi: [],
  },
];

export default hankeDraftList;
