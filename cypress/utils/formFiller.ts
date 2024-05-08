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
  HANKE_VAIHE,
  HankeDataDraft,
  HANKE_VAIHE_KEY,
} from '../../src/domain/types/hanke';

export const selectHankeVaihe = (vaihe: HANKE_VAIHE_KEY) => {
  cy.get('#vaihe-toggle-button').click();
  switch (vaihe) {
    case HANKE_VAIHE.OHJELMOINTI:
      cy.get('#vaihe-item-0').click();
      break;
    case HANKE_VAIHE.SUUNNITTELU:
      cy.get('#vaihe-item-1').click();
      break;
    case HANKE_VAIHE.RAKENTAMINEN:
      cy.get('#vaihe-item-2').click();
      break;
    default:
      break;
  }
};

export const fillForm0 = (hankeData: HankeDataDraft) => {
  cy.get('[data-testid=formStepIndicator]').should('exist');

  cy.get('input[data-testid=nimi]').type(hankeData.nimi);
  if (hankeData.kuvaus) {
    cy.get('textarea[data-testid=kuvaus]').type(hankeData.kuvaus);
  }
  if (hankeData.tyomaaKatuosoite) {
    cy.get('#tyomaaKatuosoite').type(hankeData.tyomaaKatuosoite);
  }
  cy.get('input[data-testid=nimi]').click();

  if (hankeData.vaihe) {
    selectHankeVaihe(hankeData.vaihe);
  }

  if (hankeData.onYKTHanke) {
    cy.get('input[data-testid=onYKTHanke]').click();
  }
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
  cy.get('[data-testid=formStepIndicator]').click();
};

export const saveDraft = () => {
  cy.get('[data-testid=save-draft-button]').click();
};

export const waitForToast = () => {
  cy.get('[data-testid=formToastSuccess]').should('be.visible');
  cy.get('[data-testid=formToastSuccess]').should('not.be.visible');
};

export const fillForm2 = (hankeData: HankeDataDraft) => {
  if (hankeData.omistajat) {
    cy.get('input[data-testid=omistaja.nimi]').type(hankeData.omistajat[0].nimi);
    cy.get('input[data-testid=omistaja.email]').type(hankeData.omistajat[0].email);
    cy.get('input[data-testid=omistaja.puhelinnumero]').type(hankeData.omistajat[0].puhelinnumero);
  }
};

export const selectKaistaHaitta = (kaistaHaitta: HANKE_KAISTAHAITTA_KEY) => {
  cy.get('#kaistaHaitta-toggle-button').click();
  switch (kaistaHaitta) {
    case HANKE_KAISTAHAITTA.EI_VAIKUTA:
      cy.get('#kaistaHaitta-item-0').click();
      break;
    case HANKE_KAISTAHAITTA.VAHENTAA_KAISTAN_YHDELLA_AJOSUUNNALLA:
      cy.get('#kaistaHaitta-item-1').click();
      break;
    case HANKE_KAISTAHAITTA.VAHENTAA_SAMANAIKAISESTI_KAISTAN_KAHDELLA_AJOSUUNNALLA:
      cy.get('#kaistaHaitta-item-2').click();
      break;
    case HANKE_KAISTAHAITTA.VAHENTAA_SAMANAIKAISESTI_USEITA_KAISTOJA_KAHDELLA_AJOSUUNNALLA:
      cy.get('#kaistaHaitta-item-3').click();
      break;
    case HANKE_KAISTAHAITTA.VAHENTAA_SAMANAIKAISESTI_USEITA_KAISTOJA_LIITTYMIEN_ERI_SUUNNILLA:
      cy.get('#kaistaHaitta-item-4').click();
      break;
    default:
      break;
  }
};

export const selectKaistanPituusHaitta = (kaistanPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY) => {
  cy.get('#kaistaPituusHaitta-toggle-button').click();
  switch (kaistanPituusHaitta) {
    case HANKE_KAISTAPITUUSHAITTA.EI_VAIKUTA_KAISTAJARJESTELYIHIN:
      cy.get('#kaistaPituusHaitta-item-0').click();
      break;
    case HANKE_KAISTAPITUUSHAITTA.PITUUS_ALLE_10_METRIA:
      cy.get('#kaistaPituusHaitta-item-1').click();
      break;
    case HANKE_KAISTAPITUUSHAITTA.PITUUS_10_99_METRIA:
      cy.get('#kaistaPituusHaitta-item-2').click();
      break;
    case HANKE_KAISTAPITUUSHAITTA.PITUUS_100_499_METRIA:
      cy.get('#kaistaPituusHaitta-item-3').click();
      break;
    case HANKE_KAISTAPITUUSHAITTA.PITUUS_500_METRIA_TAI_ENEMMAN:
      cy.get('#kaistaPituusHaitta-item-4').click();
      break;
    default:
      break;
  }
};

export const selectMeluHaitta = (meluHaitta: HANKE_MELUHAITTA_KEY) => {
  cy.get('#meluHaitta-toggle-button').click();
  switch (meluHaitta) {
    case HANKE_MELUHAITTA.EI_MELUHAITTAA:
      cy.get('#meluHaitta-item-0').click();
      break;
    case HANKE_MELUHAITTA.SATUNNAINEN_MELUHAITTA:
      cy.get('#meluHaitta-item-1').click();
      break;
    case HANKE_MELUHAITTA.TOISTUVA_MELUHAITTA:
      cy.get('#meluHaitta-item-2').click();
      break;
    case HANKE_MELUHAITTA.JATKUVA_MELUHAITTA:
      cy.get('#meluHaitta-item-3').click();
      break;
    default:
      break;
  }
};

export const selectPolyHaitta = (polyHaitta: HANKE_POLYHAITTA_KEY) => {
  cy.get('#polyHaitta-toggle-button').click();
  switch (polyHaitta) {
    case HANKE_POLYHAITTA.EI_POLYHAITTAA:
      cy.get('#polyHaitta-item-0').click();
      break;
    case HANKE_POLYHAITTA.SATUNNAINEN_POLYHAITTA:
      cy.get('#polyHaitta-item-1').click();
      break;
    case HANKE_POLYHAITTA.TOISTUVA_POLYHAITTA:
      cy.get('#polyHaitta-item-2').click();
      break;
    case HANKE_POLYHAITTA.JATKUVA_POLYHAITTA:
      cy.get('#polyHaitta-item-3').click();
      break;
    default:
      break;
  }
};

export const selectTarinaHaitta = (tarinaHaitta: HANKE_TARINAHAITTA_KEY) => {
  cy.get('#tarinaHaitta-toggle-button').click();
  switch (tarinaHaitta) {
    case HANKE_TARINAHAITTA.EI_TARINAHAITTAA:
      cy.get('#tarinaHaitta-item-0').click();
      break;
    case HANKE_TARINAHAITTA.SATUNNAINEN_TARINAHAITTA:
      cy.get('#tarinaHaitta-item-1').click();
      break;
    case HANKE_TARINAHAITTA.TOISTUVA_TARINAHAITTA:
      cy.get('#tarinaHaitta-item-2').click();
      break;
    case HANKE_TARINAHAITTA.JATKUVA_TARINAHAITTA:
      cy.get('#tarinaHaitta-item-3').click();
      break;
    default:
      break;
  }
};

export const fillForm1 = (hankeData: HankeDataDraft) => {
  cy.get('[data-testid=formStepIndicator]').should('exist');

  cy.get('[data-testid=draw-control-Square]').click();

  cy.get('#ol-map').click(300, 300).click(600, 600);

  if (hankeData.alkuPvm) {
    cy.get('#haittaAlkuPvm').type(hankeData.alkuPvm);
  }

  if (hankeData.loppuPvm) {
    cy.get('#haittaLoppuPvm').type(hankeData.loppuPvm);
  }

  cy.get('[data-testid=formStepIndicator]').click(); // Close datepicker because it is over kaistaHaitta-toggle-button

  if (hankeData.alueet && hankeData.alueet[0].kaistaHaitta) {
    selectKaistaHaitta(hankeData.alueet[0].kaistaHaitta);
  }

  if (hankeData.alueet && hankeData.alueet[0].kaistaPituusHaitta) {
    selectKaistanPituusHaitta(hankeData.alueet[0].kaistaPituusHaitta);
  }

  if (hankeData.alueet && hankeData.alueet[0].meluHaitta) {
    selectMeluHaitta(hankeData.alueet[0].meluHaitta);
  }

  if (hankeData.alueet && hankeData.alueet[0].polyHaitta) {
    selectPolyHaitta(hankeData.alueet[0].polyHaitta);
  }

  if (hankeData.alueet && hankeData.alueet[0].tarinaHaitta) {
    selectTarinaHaitta(hankeData.alueet[0].tarinaHaitta);
  }
};

export const createHankeFromUI = (hankeData: HankeDataDraft) => {
  cy.visit('/fi/hanke/uusi');
  fillForm0(hankeData);
  nextFormPage();

  waitForToast();
  drawPolygonToMap();
  fillForm1(hankeData);
  saveDraft();
  nextFormPage();

  waitForToast();
  fillForm2(hankeData);
  saveDraft();
};
