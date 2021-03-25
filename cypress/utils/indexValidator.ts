/// <reference types="cypress" />
import { HankeIndexData } from '../../src/domain/types/hanke';

export const validateIndexes = (hankeIndexData: Partial<HankeIndexData>) => {
  if (hankeIndexData.liikennehaittaIndeksi && hankeIndexData.liikennehaittaIndeksi.indeksi) {
    cy.get('[data-testid=test-liikennehaittaIndeksi]').contains(
      hankeIndexData.liikennehaittaIndeksi.indeksi
    );
  }
  if (hankeIndexData.pyorailyIndeksi) {
    cy.get('[data-testid=test-pyorailyIndeksi]').contains(hankeIndexData.pyorailyIndeksi);
  }
  if (hankeIndexData.joukkoliikenneIndeksi) {
    cy.get('[data-testid=test-joukkoliikenneIndeksi]').contains(
      hankeIndexData.joukkoliikenneIndeksi
    );
  }
  if (hankeIndexData.perusIndeksi) {
    cy.get('[data-testid=test-ruuhkautumisIndeksi]').contains(hankeIndexData.perusIndeksi);
  }
};
