import { HankeIndexData, HANKE_INDEX_TYPE } from './../../src/domain/types/hanke';
/// <reference types="cypress" />
import {
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
} from './../../src/domain/types/hanke';
import { createHankeFromUI } from './../utils/formFiller';
import {
  HANKE_VAIHE,
  HankeDataDraft,
  HANKE_SUUNNITTELUVAIHE,
} from './../../src/domain/types/hanke';
import { validateIndexes } from '../utils/indexValidator';

// TODO: define types that would not require unnecessary types
const hankeMock: HankeDataDraft = {
  id: 0, // not used but types require it
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
  haittaAlkuPvm: '10.01.2030',
  haittaLoppuPvm: '10.01.2032', // TODO: BUG: HAI-974: loppuPvm cant be same as haittaLoppuPvm
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
  pyorailyIndeksi: 3,
  joukkoliikenneIndeksi: 4,
  perusIndeksi: 4.8,
};

context('HankeForm', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Hanke form testing', () => {
    const countIndexes = true;
    createHankeFromUI(hankeMock, countIndexes);
    // TODO: validateHankeInfoFromHankeList(hankeMock)
    // TODO: validateHankeInfoFromMap(hankeMock)
    validateIndexes(hankeMockIndex);
  });
});
