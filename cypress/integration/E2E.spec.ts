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
  HANKE_SUUNNITTELUVAIHE,
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
  haittaAlkuPvm: '10.01.2030', // the dates are the same as hankeStart and end on purpose
  haittaLoppuPvm: '11.01.2032',
  tyomaaKatuosoite: 'Mannerheimintie 14',
  vaihe: HANKE_VAIHE.SUUNNITTELU,
  suunnitteluVaihe: HANKE_SUUNNITTELUVAIHE.KATUSUUNNITTELU_TAI_ALUEVARAUS,
  omistaja: {
    id: null, // not used but types require it
    tyyppi: 'YKSITYISHENKILO',
    tunnus: '000000-000X',
    nimi: 'Harri Hankettaja',
    email: 'harri.hanketest@hankekatu.foo',
    puhelinnumero: '12341234',
  },
  kaistaHaitta: HANKE_KAISTAHAITTA.VIISI,
  kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA.VIISI,
  meluHaitta: HANKE_MELUHAITTA.KOLME,
  polyHaitta: HANKE_POLYHAITTA.KOLME,
  tarinaHaitta: HANKE_TARINAHAITTA.KOLME,
};

const hankeMockIndex: Partial<HankeIndexData> = {
  liikennehaittaIndeksi: {
    indeksi: 4.8,
    tyyppi: HANKE_INDEX_TYPE.PERUSINDEKSI,
  },
  pyorailyIndeksi: 3,
  joukkoliikenneIndeksi: 4,
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
