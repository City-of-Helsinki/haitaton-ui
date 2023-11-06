/// <reference types="cypress" />
import {
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
  HANKE_VAIHE,
  HankeDataDraft,
  HankeIndexData,
  HANKE_INDEX_TYPE,
} from '../../src/domain/types/hanke';
import { createHankeFromUI } from '../utils/formFiller';
import { validateIndexes } from '../utils/indexValidator';

const hankeMock: HankeDataDraft = {
  id: 0, // not used but types require it
  hankeTunnus: 'not used', // not used but types require it
  onYKTHanke: true,
  nimi: 'E2E-hankkeen-testaus',
  kuvaus: 'Tämä on hankkeen kuvaus',
  alkuPvm: '10.01.2030',
  loppuPvm: '11.01.2032',
  alueet: [
    {
      id: 0,
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
      haittaAlkuPvm: '10.01.2030', // the dates are the same as hankeStart and end on purpose
      haittaLoppuPvm: '11.01.2032',
      kaistaHaitta: HANKE_KAISTAHAITTA.VIISI,
      kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA.VIISI,
      meluHaitta: HANKE_MELUHAITTA.KOLME,
      polyHaitta: HANKE_POLYHAITTA.KOLME,
      tarinaHaitta: HANKE_TARINAHAITTA.KOLME,
    },
  ],
  tyomaaKatuosoite: 'Mannerheimintie 14',
  vaihe: HANKE_VAIHE.SUUNNITTELU,
  omistajat: [
    {
      id: null, // not used but types require it
      nimi: 'Harri Hankettaja',
      email: 'harri.hanketest@hankekatu.foo',
      puhelinnumero: '12341234',
      tyyppi: 'YKSITYISHENKILO',
      ytunnus: 'tunnus',
    },
  ],
};

const hankeMockIndex: Partial<HankeIndexData> = {
  liikennehaittaIndeksi: {
    indeksi: 4.8,
    tyyppi: HANKE_INDEX_TYPE.PERUSINDEKSI,
  },
  pyorailyIndeksi: 3,
  raitiovaunuIndeksi: 4,
  linjaautoIndeksi: 3,
  perusIndeksi: 4.8,
};

context('HankeForm', () => {
  beforeEach(() => {
    cy.login('/hanke/uusi');
  });

  it('Validate indexes are counted correctly with given hankeData', () => {
    createHankeFromUI(hankeMock);
    validateIndexes(hankeMockIndex);
  });
});
