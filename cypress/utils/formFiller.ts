/// <reference types="cypress" />

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

export const createHankeFromUI = (hankeData: HankeDataDraft) => {
  cy.visit('/fi/hanke/uusi');
  fillForm0(hankeData);
  nextFormPage();
};
