/// <reference types="cypress" />
import {
  HankeIndexData,
  HANKE_INDEX_TYPE,
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
  HANKE_VAIHE,
  HankeDataDraft,
  HANKE_SUUNNITTELUVAIHE,
} from '../../src/domain/types/hanke';
import { createHankeFromUI } from '../utils/formFiller';
import { validateIndexes } from '../utils/indexValidator';

const hankeMock: HankeDataDraft = {
  id: 0, // not used but types require it!
  hankeTunnus: 'not used', // not used but types require it
  tilat: {
    // not used but types require it
    onGeometrioita: false,
    onKaikkiPakollisetLuontiTiedot: false,
    onTiedotLiikenneHaittaIndeksille: false,
    onLiikenneHaittaIndeksi: false,
    onViereisiaHankkeita: false,
    onAsiakasryhmia: false,
  },
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
  omistajat: [
    {
      id: null, // not used but types require it
      etunimi: 'Harri',
      sukunimi: 'Hankettaja',
      email: 'harri.hanketest@hankekatu.foo',
      puhelinnumero: '12341234',
      organisaatioId: null, // not used but types require it
      organisaatioNimi: '', // not used but types require it
      osasto: '', // not used but types require it
    },
  ],
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
  pyorailyIndeksi: 1,
  joukkoliikenneIndeksi: 4,
  perusIndeksi: 4.8,
};

context('HankeForm', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/fi/hanke/uusi');
  });

  it('Validate indexes are counted correctly with given hankeData', () => {
    const countIndexes = true;
    createHankeFromUI(hankeMock, countIndexes);
    validateIndexes(hankeMockIndex);
  });
});
