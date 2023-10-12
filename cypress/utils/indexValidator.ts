/// <reference types="cypress" />
import { HankeIndexData } from '../../src/domain/types/hanke';

export const validateIndexes = (hankeIndexData: Partial<HankeIndexData>) => {
  if (hankeIndexData.liikennehaittaIndeksi && hankeIndexData.liikennehaittaIndeksi.indeksi) {
    cy.get('[data-testid=test-liikennehaittaIndeksi]').should('not.be.empty');
    cy.get('[data-testid=test-liikennehaittaIndeksi]').contains(
      hankeIndexData.liikennehaittaIndeksi.indeksi,
    );
  }
  if (hankeIndexData.pyorailyIndeksi) {
    cy.get('[data-testid=test-pyorailyIndeksi]').should('not.be.empty');
    cy.get('[data-testid=test-pyorailyIndeksi]').contains(hankeIndexData.pyorailyIndeksi);
  }
  if (hankeIndexData.raitiovaunuIndeksi) {
    cy.get('[data-testid=test-raitiovaunuIndeksi]').contains(hankeIndexData.raitiovaunuIndeksi);
  }
  if (hankeIndexData.linjaautoIndeksi) {
    cy.get('[data-testid=test-linjaautoIndeksi]').contains(hankeIndexData.linjaautoIndeksi);
  }
  if (hankeIndexData.perusIndeksi) {
    cy.get('[data-testid=test-ruuhkautumisIndeksi]').contains(hankeIndexData.perusIndeksi);
  }
};
