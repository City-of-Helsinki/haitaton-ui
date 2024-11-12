import { HankeData, HANKE_POLYHAITTA } from '../types/hanke';

const hankeList: HankeData[] = [
  {
    id: 1,
    hankeTunnus: 'SMTGEN2_1',
    onYKTHanke: false,
    nimi: 'Mannerheimintie autottomaksi',
    kuvaus: 'Hankkeen kuvaus',
    alkuPvm: '2022-10-02:00:00Z',
    loppuPvm: '2022-10-10:00:00Z',
    vaihe: 'OHJELMOINTI',
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-27T11:33:17.0875Z',
    modifiedBy: null,
    modifiedAt: null,
    status: 'PUBLIC',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: ['VESI', 'VIEMARI'],
    alueet: [
      {
        id: 1,
        hankeId: 1,
        geometriat: {
          id: 1,
          featureCollection: {
            type: 'FeatureCollection',
            crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::3879' } },
            features: [
              {
                type: 'Feature',
                properties: { hankeTunnus: 'SMTGEN2_2' },
                geometry: {
                  type: 'Polygon',
                  crs: { type: 'name', properties: { name: 'EPSG:3879' } },
                  coordinates: [
                    [
                      [2.549619729e7, 6673799.79],
                      [2.549618361e7, 6674382.48],
                      [2.549560092e7, 6674368.79],
                      [2.549561461e7, 6673786.1],
                      [2.549619729e7, 6673799.79],
                    ],
                  ],
                },
              },
            ],
          },
          version: 0,
          createdByUserId: null,
          createdAt: '2022-01-19T13:01:26.024Z',
          modifiedByUserId: null,
          modifiedAt: '2022-01-19T13:01:26.024Z',
        },
        haittaAlkuPvm: new Date('2022-11-21T21:59:59.999Z'),
        haittaLoppuPvm: new Date('2022-11-30T21:59:59.999Z'),
        meluHaitta: 'SATUNNAINEN_MELUHAITTA',
        polyHaitta: HANKE_POLYHAITTA.TOISTUVA_POLYHAITTA,
        tarinaHaitta: 'SATUNNAINEN_TARINAHAITTA',
        kaistaHaitta: 'YKSI_KAISTA_VAHENEE',
        kaistaPituusHaitta: 'PITUUS_10_99_METRIA',
      },
    ],
    tyomaaKatuosoite: '',
    tormaystarkasteluTulos: null,
  },
  {
    id: 2,
    hankeTunnus: 'SMTGEN2_2',
    onYKTHanke: true,
    nimi: 'dsf',
    kuvaus: '',
    alkuPvm: '2022-10-02:00:00Z',
    loppuPvm: '2022-10-05:00:00Z',
    vaihe: 'OHJELMOINTI',
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-27T11:43:43.481215Z',
    modifiedBy: null,
    modifiedAt: null,
    status: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: ['SADEVESI'],
    alueet: [
      {
        id: 2,
        hankeId: 2,
        geometriat: {
          id: 2,
          featureCollection: {
            type: 'FeatureCollection',
            crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::3879' } },
            features: [
              {
                type: 'Feature',
                properties: { hankeTunnus: 'SMTGEN2_2' },
                geometry: {
                  type: 'Polygon',
                  crs: { type: 'name', properties: { name: 'EPSG:3879' } },
                  coordinates: [
                    [
                      [2.549619722e7, 6673792.79],
                      [2.549618354e7, 6674375.48],
                      [2.549560085e7, 6674361.79],
                      [2.549561454e7, 6673779.1],
                      [2.549619722e7, 6673792.79],
                    ],
                  ],
                },
              },
            ],
          },
          version: 0,
          createdByUserId: null,
          createdAt: '2022-01-19T13:01:26.024Z',
          modifiedByUserId: null,
          modifiedAt: '2022-01-19T13:01:26.024Z',
        },
        haittaAlkuPvm: new Date('2022-11-14T21:59:59.999Z'),
        haittaLoppuPvm: new Date('2022-11-27T21:59:59.999Z'),
        meluHaitta: 'JATKUVA_MELUHAITTA',
        polyHaitta: HANKE_POLYHAITTA.JATKUVA_POLYHAITTA,
        tarinaHaitta: 'JATKUVA_TARINAHAITTA',
        kaistaHaitta: 'YKSI_KAISTA_VAHENEE_KAHDELLA_AJOSUUNNALLA',
        kaistaPituusHaitta: 'PITUUS_500_METRIA_TAI_ENEMMAN',
      },
    ],
    tyomaaKatuosoite: '',
    tormaystarkasteluTulos: null,
  },
];

export default hankeList;
