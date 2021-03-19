/// <reference types="cypress" />
import { createHankeFromUI } from './../utils/formFiller';
import {
  HANKE_VAIHE,
  HankeDataDraft,
  HANKE_SUUNNITTELUVAIHE,
} from './../../src/domain/types/hanke';

const drawCoordinateX = 100;
const drawCoordinateY = 100;

const hankeMock: HankeDataDraft = {
  onYKTHanke: true,
  nimi: 'E2E-hankkeen-testaus',
  kuvaus: 'Tämä on hankkeen kuvaus',
  alkuPvm: '10.01.2030',
  loppuPvm: '11.01.2032',
  tyomaaKatuosoite: '',
  vaihe: HANKE_VAIHE.SUUNNITTELU,
  suunnitteluVaihe: HANKE_SUUNNITTELUVAIHE.KATUSUUNNITTELU_TAI_ALUEVARAUS,
  haittaLoppuPvm: new Date('31.12.2031'),
};

context('HankeForm', () => {
  it('Hanke form testing', () => {
    cy.login();
    createHankeFromUI(hankeMock);
  });
});
