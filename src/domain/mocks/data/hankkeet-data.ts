import {
  HankeDataDraft,
  HANKE_POLYHAITTA,
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
  HANKE_MELUHAITTA,
  HANKE_TARINAHAITTA,
} from '../../types/hanke';

const hankkeet: HankeDataDraft[] = [
  {
    id: 1,
    hankeTunnus: 'HAI22-1',
    onYKTHanke: false,
    nimi: 'Mannerheimintien katutyöt',
    kuvaus:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    alkuPvm: '2022-11-26T00:00:00Z',
    loppuPvm: '2022-12-17T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-27T11:33:17.0875Z',
    modifiedBy: null,
    modifiedAt: null,
    status: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
    alueet: [],
  },
  {
    id: 2,
    hankeTunnus: 'HAI22-2',
    onYKTHanke: true,
    nimi: 'Aidasmäentien vesihuollon rakentaminen',
    kuvaus:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    tyomaaKatuosoite: 'Aidasmäentie 5',
    alkuPvm: '2023-01-12T00:00:00Z',
    loppuPvm: '2024-11-27T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    version: 0,
    createdBy: '1',
    createdAt: '2022-11-27T11:43:43.481215Z',
    modifiedBy: null,
    modifiedAt: null,
    status: 'PUBLIC',
    tormaystarkasteluTulos: {
      hankeId: 2,
      hankeTunnus: 'HAI22-2',
      hankeGeometriatId: 2,
      tila: 'VOIMASSA',
      autoliikenneindeksi: 3.5,
      pyoraliikenneindeksi: 3,
      linjaautoliikenneindeksi: 4,
      raitioliikenneindeksi: 2,
      liikennehaittaindeksi: {
        indeksi: 4,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tyyppi: 'LINJAAUTOLIIKENNEINDEKSI' as any,
      },
    },
    omistajat: [
      {
        id: 1,
        tyyppi: 'YRITYS',
        nimi: 'Yritys Oy',
        ytunnus: '6006332-9',
        email: 'yritys@testi.com',
        puhelinnumero: '0000000000',
        yhteyshenkilot: [
          {
            id: '129fd4d0-4a00-4c43-8c02-2e32c31dd1f9',
            etunimi: 'Esa',
            sukunimi: 'Kauppinen',
            sahkoposti: 'esa.kauppinen@maansiirtofirma.com',
            puhelinnumero: '0000000000',
          },
        ],
      },
    ],
    rakennuttajat: [
      {
        id: 1,
        tyyppi: 'YRITYS',
        nimi: 'Yritys 2 Oy',
        ytunnus: '6502327-0',
        email: 'yritys2@testi.com',
        puhelinnumero: '1111111111',
        yhteyshenkilot: [
          {
            id: 'ef9856fc-6b8b-4fff-b5f6-3522af2f4554',
            etunimi: 'Matti',
            sukunimi: 'Meikäläinen',
            sahkoposti: 'matti.meikalainen@testi.com',
            puhelinnumero: '1111111111',
          },
          {
            id: '129fd4d0-4a00-4c43-8c02-2e32c31dd1f9',
            etunimi: 'Esa',
            sukunimi: 'Kauppinen',
            sahkoposti: 'esa.kauppinen@maansiirtofirma.com',
            puhelinnumero: '1111111111',
          },
        ],
      },
    ],
    toteuttajat: [],
    muut: [
      {
        rooli: 'Isännöitsijä',
        nimi: 'Yritys 3 Oy',
        email: 'yritys3@testi.com',
        puhelinnumero: '2222222222',
        organisaatioNimi: 'Organisaatio',
        osasto: '',
        yhteyshenkilot: [
          {
            id: '197a6051-6043-4c3d-9889-95e263d17f76',
            etunimi: 'Matti',
            sukunimi: 'Meikäläinen',
            sahkoposti: 'matti.meikalainen@testi.com',
            puhelinnumero: '2222222222',
          },
        ],
      },
    ],
    tyomaaTyyppi: [],
    alueet: [
      {
        id: 1,
        hankeId: 2,
        haittaAlkuPvm: new Date('2023-01-12T00:00:00Z'),
        haittaLoppuPvm: new Date('2024-11-27T00:00:00Z'),
        kaistaHaitta: HANKE_KAISTAHAITTA.VAHENTAA_SAMANAIKAISESTI_KAISTAN_KAHDELLA_AJOSUUNNALLA,
        kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA.PITUUS_100_499_METRIA,
        meluHaitta: HANKE_MELUHAITTA.PITKAKESTOINEN_TOISTUVA_HAITTA,
        polyHaitta: HANKE_POLYHAITTA.PITKAKESTOINEN_TOISTUVA_HAITTA,
        tarinaHaitta: HANKE_TARINAHAITTA.SATUNNAINEN_HAITTA,
        nimi: 'Hankealue 1',
        geometriat: {
          id: 37,
          version: 0,
          createdByUserId: null,
          modifiedByUserId: null,
          createdAt: '2022-11-27T11:43:43.481215Z',
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
                  hankeTunnus: 'HAI22-2',
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
                      [25498583.867247857, 6679281.28058593],
                      [25498584.13087749, 6679314.065289769],
                      [25498573.17171292, 6679313.3807182815],
                      [25498571.913494226, 6679281.456795131],
                      [25498583.867247857, 6679281.28058593],
                    ],
                  ],
                },
              },
            ],
          },
        },
      },
      {
        id: 2,
        hankeId: 2,
        haittaAlkuPvm: new Date('2023-05-15T20:59:59.999Z'),
        haittaLoppuPvm: new Date('2023-09-30T20:59:59.999Z'),
        meluHaitta: HANKE_MELUHAITTA.LYHYTAIKAINEN_TOISTUVA_HAITTA,
        polyHaitta: HANKE_POLYHAITTA.PITKAKESTOINEN_TOISTUVA_HAITTA,
        tarinaHaitta: HANKE_TARINAHAITTA.SATUNNAINEN_HAITTA,
        kaistaHaitta: HANKE_KAISTAHAITTA.VAHENTAA_KAISTAN_YHDELLA_AJOSUUNNALLA,
        kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA.PITUUS_10_99_METRIA,
        nimi: 'Hankealue 2',
        geometriat: {
          featureCollection: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [25498584.03, 6679338],
                      [25498590.26, 6679375.03],
                      [25498578.5, 6679383.45],
                      [25498573.66, 6679337.88],
                      [25498584.03, 6679338],
                    ],
                  ],
                },
                properties: {
                  hankeTunnus: 'HAI22-2',
                },
              },
            ],
            crs: {
              type: 'name',
              properties: {
                name: 'urn:ogc:def:crs:EPSG::3879',
              },
            },
          },
        },
      },
    ],
  },
  {
    id: 3,
    hankeTunnus: 'HAI22-3',
    onYKTHanke: false,
    nimi: 'Mannerheimintien kaukolämpö',
    kuvaus:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    tyomaaKatuosoite: 'Mannerheimintie 6',
    alkuPvm: '2023-01-02T00:00:00Z',
    loppuPvm: '2023-02-24T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    tyomaaTyyppi: ['KAUKOLAMPO'],
    version: 0,
    createdBy: '1',
    createdAt: '2022-11-27T11:44:22.443735Z',
    modifiedBy: null,
    modifiedAt: null,
    status: 'PUBLIC',
    omistajat: [
      {
        id: 1,
        tyyppi: 'YRITYS',
        nimi: 'Kauppisen maansiirtofirma KY',
        ytunnus: '5341034-5',
        email: 'toimisto@testi.com',
        puhelinnumero: '0501234567',
        yhteyshenkilot: [
          {
            id: '129fd4d0-4a00-4c43-8c02-2e32c31dd1f9',
            etunimi: 'Esa',
            sukunimi: 'Kauppinen',
            sahkoposti: 'esa.kauppinen@maansiirtofirma.com',
            puhelinnumero: '0507654321',
          },
        ],
      },
    ],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tormaystarkasteluTulos: {
      hankeId: 3,
      hankeTunnus: 'HAI22-3',
      hankeGeometriatId: 1,
      tila: 'VOIMASSA',
      autoliikenneindeksi: 1.5,
      pyoraliikenneindeksi: 3.5,
      linjaautoliikenneindeksi: 1,
      raitioliikenneindeksi: 2,
      liikennehaittaindeksi: {
        indeksi: 3.5,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tyyppi: 'PYORALIIKENNEINDEKSI' as any,
      },
    },
    alueet: [
      {
        id: 1,
        haittaAlkuPvm: new Date('2023-01-02T21:59:59.999Z'),
        haittaLoppuPvm: new Date('2023-02-24T21:59:59.999Z'),
        meluHaitta: HANKE_MELUHAITTA.SATUNNAINEN_HAITTA,
        polyHaitta: HANKE_POLYHAITTA.LYHYTAIKAINEN_TOISTUVA_HAITTA,
        tarinaHaitta: HANKE_TARINAHAITTA.PITKAKESTOINEN_TOISTUVA_HAITTA,
        kaistaHaitta: HANKE_KAISTAHAITTA.VAHENTAA_KAISTAN_YHDELLA_AJOSUUNNALLA,
        kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA.PITUUS_ALLE_10_METRIA,
        nimi: 'Hankealue 1',
        geometriat: {
          featureCollection: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [25496559.78, 6672988.05],
                      [25496681.62, 6672825.27],
                      [25496727.94, 6672856.74],
                      [25496595.92, 6673029.09],
                      [25496549.25, 6673005.46],
                      [25496559.78, 6672988.05],
                    ],
                  ],
                },
                properties: {
                  hankeTunnus: 'HAI22-3',
                },
              },
            ],
            crs: {
              type: 'name',
              properties: {
                name: 'urn:ogc:def:crs:EPSG::3879',
              },
            },
          },
        },
      },
    ],
  },
  {
    id: 4,
    hankeTunnus: 'HAI22-4',
    onYKTHanke: true,
    nimi: 'Pohjoisesplanadin valojen uusiminen',
    kuvaus:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    alkuPvm: '2022-11-25T00:00:00Z',
    loppuPvm: '2022-11-28T00:00:00Z',
    tyomaaKatuosoite: 'Pohjoisesplanadi 2',
    vaihe: 'RAKENTAMINEN',
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-27T12:07:41.210244Z',
    modifiedBy: null,
    modifiedAt: null,
    status: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
    alueet: [],
  },
  {
    id: 5,
    hankeTunnus: 'HAI22-5',
    onYKTHanke: true,
    nimi: 'Erottajan tietyöt',
    kuvaus:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    alkuPvm: '2022-11-23T00:00:00Z',
    loppuPvm: '2022-11-28T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    version: 0,
    createdBy: '1',
    createdAt: '2022-11-23T10:37:36.362778Z',
    modifiedBy: null,
    modifiedAt: null,
    status: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
    alueet: [],
  },
  {
    id: 6,
    hankeTunnus: 'HAI22-6',
    onYKTHanke: true,
    nimi: 'Tähtitorninkadun tietoliikenneyhteydet',
    kuvaus:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    alkuPvm: '2022-11-24T00:00:00Z',
    loppuPvm: '2022-11-28T00:00:00Z',
    vaihe: 'SUUNNITTELU',
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T13:43:13.599591Z',
    modifiedBy: null,
    modifiedAt: null,
    status: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
    alueet: [],
  },
  {
    id: 7,
    hankeTunnus: 'HAI22-7',
    onYKTHanke: true,
    nimi: 'Puistokadun korjaukset',
    kuvaus:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    alkuPvm: '2022-11-24T00:00:00Z',
    loppuPvm: '2022-11-28T00:00:00Z',
    vaihe: 'SUUNNITTELU',
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T13:43:15.322044Z',
    modifiedBy: null,
    modifiedAt: null,
    status: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
    alueet: [],
  },
  {
    id: 8,
    hankeTunnus: 'HAI22-8',
    onYKTHanke: true,
    nimi: 'Eiranrannan asfaltointi',
    kuvaus:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    alkuPvm: '2022-11-24T00:00:00Z',
    loppuPvm: '2022-11-28T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T13:43:24.301796Z',
    modifiedBy: null,
    modifiedAt: null,
    omistajat: [],
    status: 'DRAFT',
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
    alueet: [],
  },
  {
    id: 9,
    hankeTunnus: 'HAI22-9',
    onYKTHanke: true,
    nimi: 'Sillilaiturin korjaus',
    kuvaus:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    alkuPvm: '2022-11-24T00:00:00Z',
    loppuPvm: '2022-11-28T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T13:43:27.330822Z',
    modifiedBy: null,
    modifiedAt: null,
    status: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
    alueet: [],
  },
  {
    id: 10,
    hankeTunnus: 'HAI22-10',
    onYKTHanke: false,
    nimi: 'Santakadun ehostaminen',
    kuvaus:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    alkuPvm: '2022-12-02T00:00:00Z',
    loppuPvm: '2022-12-05T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    version: 0,
    createdBy: '1',
    createdAt: '2020-12-01T14:22:11.838844Z',
    modifiedBy: null,
    modifiedAt: null,
    status: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
    alueet: [],
  },
  {
    id: 11,
    hankeTunnus: 'HAI22-11',
    onYKTHanke: false,
    nimi: 'Kuvitteellinen hanke',
    kuvaus:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    alkuPvm: '2022-12-02T00:00:00Z',
    loppuPvm: '2022-11-28T00:00:00Z',
    vaihe: 'OHJELMOINTI',
    version: 0,
    createdBy: '1',
    createdAt: '2020-12-01T14:34:24.443622Z',
    modifiedBy: null,
    modifiedAt: null,
    status: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
    generated: true,
    alueet: [],
  },
];

export default hankkeet;
