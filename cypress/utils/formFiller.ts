/// <reference types="cypress" />

import {
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAHAITTA_KEY,
  HANKE_KAISTAPITUUSHAITTA,
  HANKE_KAISTAPITUUSHAITTA_KEY,
  HANKE_MELUHAITTA,
  HANKE_MELUHAITTA_KEY,
  HANKE_POLYHAITTA,
  HANKE_POLYHAITTA_KEY,
  HANKE_TARINAHAITTA,
  HANKE_TARINAHAITTA_KEY,
} from './../../src/domain/types/hanke';

import {
  HANKE_VAIHE,
  HankeDataDraft,
  HANKE_SUUNNITTELUVAIHE,
  HANKE_VAIHE_KEY,
  HANKE_SUUNNITTELUVAIHE_KEY,
} from './../../src/domain/types/hanke';

export const selectHankeVaihe = (
  vaihe: HANKE_VAIHE_KEY,
  suunnitteluVaihe?: HANKE_SUUNNITTELUVAIHE_KEY
) => {
  cy.get('#vaihe-toggle-button').click();
  switch (vaihe) {
    case HANKE_VAIHE.OHJELMOINTI:
      cy.get('#vaihe-item-0').click();
      break;
    case HANKE_VAIHE.SUUNNITTELU:
      cy.get('#vaihe-item-1').click();
      if (suunnitteluVaihe) {
        cy.get('#suunnitteluVaihe-toggle-button').click();
        switch (suunnitteluVaihe) {
          case HANKE_SUUNNITTELUVAIHE.YLEIS_TAI_HANKE:
            cy.get('#suunnitteluVaihe-item-0').click();
            break;
          case HANKE_SUUNNITTELUVAIHE.KATUSUUNNITTELU_TAI_ALUEVARAUS:
            cy.get('#suunnitteluVaihe-item-1').click();
            break;
          case HANKE_SUUNNITTELUVAIHE.RAKENNUS_TAI_TOTEUTUS:
            cy.get('#suunnitteluVaihe-item-2').click();
            break;
          case HANKE_SUUNNITTELUVAIHE.TYOMAAN_TAI_HANKKEEN_AIKAINEN:
            cy.get('#suunnitteluVaihe-item-3').click();
            break;
          default:
            break;
        }
      } else {
        throw new Error('Tämä testin vaihe tarvitsee suunnitteluvaiheen');
      }
      break;
    case HANKE_VAIHE.RAKENTAMINEN:
      cy.get('#vaihe-item-2').click();
      break;
    default:
      break;
  }
};

export const fillForm0 = (hankeData: HankeDataDraft) => {
  if (hankeData.onYKTHanke) {
    cy.get('input[data-testid=onYKTHanke]').click();
  }
  cy.get('input[data-testid=nimi]').type(hankeData.nimi);
  cy.get('textarea[data-testid=kuvaus]').type(hankeData.kuvaus);
  cy.get('#alkuPvm').type(hankeData.alkuPvm);
  cy.get('#loppuPvm').type(hankeData.loppuPvm);
  cy.get('input[data-testid=nimi]').click();
  selectHankeVaihe(
    hankeData.vaihe,
    hankeData.suunnitteluVaihe ? hankeData.suunnitteluVaihe : undefined
  );
};

export const nextFormPage = () => {
  cy.get('[data-testid=forward]').should('not.be.disabled');
  cy.get('[data-testid=forward]').click();
};

export const drawPolygonToMap = () => {
  const drawCoordinateX = 100;
  const drawCoordinateY = 100;
  cy.get('[data-testid=draw-control-Polygon]').click();
  cy.get('#ol-map').click(drawCoordinateX, drawCoordinateY);
  cy.get('#ol-map').click(drawCoordinateX + 300, drawCoordinateY);
  cy.get('#ol-map').click(drawCoordinateX + 300, drawCoordinateY + 300);
  cy.get('#ol-map').click(drawCoordinateX, drawCoordinateY + 300);
  cy.get('#ol-map').dblclick(drawCoordinateX + 20, drawCoordinateY + 20);
};

export const saveDraft = () => {
  cy.get('[data-testid=save-draft-button]').click();
};

export const fillForm2 = (hankeData: HankeDataDraft) => {
  if (hankeData.omistajat && hankeData.omistajat[0]) {
    cy.get('input[data-testid=omistajat-etunimi]').type(hankeData.omistajat[0].etunimi);
    cy.get('input[data-testid=omistajat-sukunimi]').type(hankeData.omistajat[0].sukunimi);
    cy.get('input[data-testid=omistajat-email]').type(hankeData.omistajat[0].email);
    cy.get('input[data-testid=omistajat-puhelinnumero]').type(hankeData.omistajat[0].puhelinnumero);
  }
};

export const fillForm3 = (hankeData: HankeDataDraft) => {
  if ('tyomaaKatuosoite' in hankeData && typeof hankeData.tyomaaKatuosoite === 'string') {
    cy.get('input[data-testid=tyomaaKatuosoite]').type(hankeData.tyomaaKatuosoite);
  }
};

export const selectKaistaHaitta = (kaistaHaitta: HANKE_KAISTAHAITTA_KEY) => {
  cy.get('#kaistaHaitta-toggle-button').click();
  switch (kaistaHaitta) {
    case HANKE_KAISTAHAITTA.YKSI:
      cy.get('#kaistaHaitta-item-0').click();
      break;
    case HANKE_KAISTAHAITTA.KAKSI:
      cy.get('#kaistaHaitta-item-1').click();
      break;
    case HANKE_KAISTAHAITTA.KOLME:
      cy.get('#kaistaHaitta-item-2').click();
      break;
    case HANKE_KAISTAHAITTA.NELJA:
      cy.get('#kaistaHaitta-item-3').click();
      break;
    case HANKE_KAISTAHAITTA.VIISI:
      cy.get('#kaistaHaitta-item-4').click();
      break;
    default:
      break;
  }
};

export const selectKaistanPituusHaitta = (kaistanPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY) => {
  cy.get('#kaistaPituusHaitta-toggle-button').click();
  switch (kaistanPituusHaitta) {
    case HANKE_KAISTAPITUUSHAITTA.YKSI:
      cy.get('#kaistaPituusHaitta-item-0').click();
      break;
    case HANKE_KAISTAPITUUSHAITTA.KAKSI:
      cy.get('#kaistaPituusHaitta-item-1').click();
      break;
    case HANKE_KAISTAPITUUSHAITTA.KOLME:
      cy.get('#kaistaPituusHaitta-item-2').click();
      break;
    case HANKE_KAISTAPITUUSHAITTA.NELJA:
      cy.get('#kaistaPituusHaitta-item-3').click();
      break;
    case HANKE_KAISTAPITUUSHAITTA.VIISI:
      cy.get('#kaistaPituusHaitta-item-4').click();
      break;
    default:
      break;
  }
};

export const selectMeluHaitta = (meluHaitta: HANKE_MELUHAITTA_KEY) => {
  cy.get('#meluHaitta-toggle-button').click();
  switch (meluHaitta) {
    case HANKE_MELUHAITTA.YKSI:
      cy.get('#meluHaitta-item-0').click();
      break;
    case HANKE_MELUHAITTA.KAKSI:
      cy.get('#meluHaitta-item-1').click();
      break;
    case HANKE_MELUHAITTA.KOLME:
      cy.get('#meluHaitta-item-2').click();
      break;
    default:
      break;
  }
};

export const selectPolyHaitta = (polyHaitta: HANKE_POLYHAITTA_KEY) => {
  cy.get('#polyHaitta-toggle-button').click();
  switch (polyHaitta) {
    case HANKE_POLYHAITTA.YKSI:
      cy.get('#polyHaitta-item-0').click();
      break;
    case HANKE_POLYHAITTA.KAKSI:
      cy.get('#polyHaitta-item-1').click();
      break;
    case HANKE_POLYHAITTA.KOLME:
      cy.get('#polyHaitta-item-2').click();
      break;
    default:
      break;
  }
};

export const selectTarinaHaitta = (tarinaHaitta: HANKE_TARINAHAITTA_KEY) => {
  cy.get('#tarinaHaitta-toggle-button').click();
  switch (tarinaHaitta) {
    case HANKE_TARINAHAITTA.YKSI:
      cy.get('#tarinaHaitta-item-0').click();
      break;
    case HANKE_TARINAHAITTA.KAKSI:
      cy.get('#tarinaHaitta-item-1').click();
      break;
    case HANKE_TARINAHAITTA.KOLME:
      cy.get('#tarinaHaitta-item-2').click();
      break;
    default:
      break;
  }
};

export const fillForm4 = (hankeData: HankeDataDraft) => {
  typeof hankeData.haittaAlkuPvm === 'string'
    ? cy.get('#haittaAlkuPvm').type(hankeData.haittaAlkuPvm)
    : cy.get('#haittaAlkuPvm').type(hankeData.alkuPvm);

  typeof hankeData.haittaLoppuPvm === 'string'
    ? cy.get('#haittaLoppuPvm').type(hankeData.haittaLoppuPvm)
    : cy.get('#haittaLoppuPvm').type(hankeData.loppuPvm);

  cy.get('[data-testid=form4Header]').click(); // Close datepicker because it is over kaistaHaitta-toggle-button

  if (typeof hankeData.kaistaHaitta === 'string') {
    selectKaistaHaitta(hankeData.kaistaHaitta);
  }

  if (typeof hankeData.kaistaPituusHaitta === 'string') {
    selectKaistanPituusHaitta(hankeData.kaistaPituusHaitta);
  }

  if (typeof hankeData.meluHaitta === 'string') {
    selectMeluHaitta(hankeData.meluHaitta);
  }

  if (typeof hankeData.polyHaitta === 'string') {
    selectPolyHaitta(hankeData.polyHaitta);
  }

  if (typeof hankeData.tarinaHaitta === 'string') {
    selectTarinaHaitta(hankeData.tarinaHaitta);
  }
};

export const countIndexes = () => {
  // TODO: count indexes implementation here
};

export const createHankeFromUI = (hankeData: HankeDataDraft, countIndexes: boolean) => {
  cy.visit('/fi/hanke/uusi');
  fillForm0(hankeData);
  nextFormPage();
  drawPolygonToMap();
  saveDraft();
  nextFormPage();
  fillForm2(hankeData);
  saveDraft();
  nextFormPage();
  fillForm3(hankeData);
  saveDraft();
  nextFormPage();
  fillForm4(hankeData);
  saveDraft();
  if (countIndexes) {
    // TODO: laske indeksit, hyväksy ehdot
  }
};
