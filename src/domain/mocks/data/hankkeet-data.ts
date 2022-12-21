import { HankeDataDraft, HANKE_POLYHAITTA, HANKE_TYOMAAKOKO } from '../../types/hanke';

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
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-27T11:33:17.0875Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
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
    suunnitteluVaihe: null,
    tyomaaKoko: HANKE_TYOMAAKOKO.SUPPEA_TAI_PISTE,
    version: 0,
    createdBy: '1',
    createdAt: '2022-11-27T11:43:43.481215Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    liikennehaittaindeksi: {
      indeksi: 4.0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tyyppi: 'JOUKKOLIIKENNEINDEKSI' as any,
    },
    tormaystarkasteluTulos: {
      hankeId: 2,
      hankeTunnus: 'HAI22-2',
      hankeGeometriatId: 2,
      tila: 'VOIMASSA',
      perusIndeksi: 3.5,
      pyorailyIndeksi: 3,
      joukkoliikenneIndeksi: 4,
      liikennehaittaIndeksi: {
        indeksi: 4,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tyyppi: 'JOUKKOLIIKENNEINDEKSI' as any,
      },
    },
    omistajat: [
      {
        id: 1,
        tyyppi: 'YRITYS',
        nimi: 'Yritys Oy',
        ytunnusTaiHetu: 'y-1234567',
        osoite: '',
        postinumero: '',
        postitoimipaikka: '',
        email: 'yritys@testi.com',
        puhelinnumero: '',
        alikontaktit: [
          {
            nimi: 'Esa Kauppinen',
            osoite: 'Lehdenkatu 3',
            postinumero: '42100',
            postitoimipaikka: 'Lahti',
            email: 'esa.kauppinen@maansiirtofirma.com',
            puhelinnumero: '',
          },
        ],
      },
    ],
    rakennuttajat: [
      {
        id: 1,
        tyyppi: 'YRITYS',
        nimi: 'Yritys 2 Oy',
        ytunnusTaiHetu: 'y-1234567',
        osoite: '',
        postinumero: '',
        postitoimipaikka: '',
        email: 'yritys2@testi.com',
        puhelinnumero: '',
        alikontaktit: [
          {
            nimi: 'Matti Meikäläinen',
            osoite: 'Katukuja 6',
            postinumero: '',
            postitoimipaikka: '',
            email: 'matti.meikalainen@testi.com',
            puhelinnumero: '',
          },
          {
            nimi: 'Esa Kauppinen',
            osoite: 'Lehdenkatu 3',
            postinumero: '42100',
            postitoimipaikka: 'Lahti',
            email: 'esa.kauppinen@maansiirtofirma.com',
            puhelinnumero: '',
          },
        ],
      },
    ],
    toteuttajat: [],
    muut: [
      {
        rooli: 'Isännöitsijä',
        nimi: 'Yritys 2 Oy',
        email: 'yritys2@testi.com',
        puhelinnumero: '',
        organisaatioNimi: 'Organisaatio',
        osasto: '',
        alikontaktit: [
          {
            nimi: 'Matti Meikäläinen',
            osoite: 'Katukuja 6',
            postinumero: '',
            postitoimipaikka: '',
            email: 'matti.meikalainen@testi.com',
            puhelinnumero: '',
          },
        ],
      },
    ],
    tyomaaTyyppi: [],
    alueet: [
      {
        id: 1,
        hankeId: 2,
        haittaAlkuPvm: '2023-01-12T00:00:00Z',
        haittaLoppuPvm: '2024-11-27T00:00:00Z',
        kaistaHaitta: 'KOLME',
        kaistaPituusHaitta: 'NELJA',
        meluHaitta: 'KOLME',
        polyHaitta: HANKE_POLYHAITTA.KOLME,
        tarinaHaitta: 'YKSI',
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
        haittaAlkuPvm: '2023-05-15T20:59:59.999Z',
        haittaLoppuPvm: '2023-09-30T20:59:59.999Z',
        meluHaitta: 'KAKSI',
        polyHaitta: HANKE_POLYHAITTA.KOLME,
        tarinaHaitta: 'YKSI',
        kaistaHaitta: 'KAKSI',
        kaistaPituusHaitta: 'KOLME',
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
    suunnitteluVaihe: null,
    tyomaaTyyppi: ['KAUKOLAMPO'],
    tyomaaKoko: 'LAAJA_TAI_USEA_KORTTELI',
    version: 0,
    createdBy: '1',
    createdAt: '2022-11-27T11:44:22.443735Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistajat: [
      {
        id: 1,
        tyyppi: 'YRITYS',
        nimi: 'Kauppisen maansiirtofirma KY',
        ytunnusTaiHetu: 'y-1234567',
        osoite: 'Lahdenkatu 3',
        postinumero: '42100',
        postitoimipaikka: 'Lahti',
        email: 'toimisto@testi.com',
        puhelinnumero: '',
      },
    ],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    liikennehaittaindeksi: {
      indeksi: 3.0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tyyppi: 'JOUKKOLIIKENNEINDEKSI' as any,
    },
    tormaystarkasteluTulos: {
      hankeId: 3,
      hankeTunnus: 'HAI22-3',
      hankeGeometriatId: 1,
      tila: 'VOIMASSA',
      perusIndeksi: 1.5,
      pyorailyIndeksi: 3.5,
      joukkoliikenneIndeksi: 2,
      liikennehaittaIndeksi: {
        indeksi: 3,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tyyppi: 'JOUKKOLIIKENNEINDEKSI' as any,
      },
    },
    alueet: [
      {
        id: 1,
        haittaAlkuPvm: '2023-01-02T21:59:59.999Z',
        haittaLoppuPvm: '2023-02-24T21:59:59.999Z',
        meluHaitta: 'YKSI',
        polyHaitta: HANKE_POLYHAITTA.YKSI,
        tarinaHaitta: 'KAKSI',
        kaistaHaitta: 'YKSI',
        kaistaPituusHaitta: 'YKSI',
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
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-27T12:07:41.210244Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
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
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2022-11-23T10:37:36.362778Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
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
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T13:43:13.599591Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
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
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T13:43:15.322044Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
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
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T13:43:24.301796Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
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
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-11-30T13:43:27.330822Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
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
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-12-01T14:22:11.838844Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
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
    suunnitteluVaihe: null,
    version: 0,
    createdBy: '1',
    createdAt: '2020-12-01T14:34:24.443622Z',
    modifiedBy: null,
    modifiedAt: null,
    saveType: 'DRAFT',
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tyomaaTyyppi: [],
  },
];

export default hankkeet;
