/// <reference types="cypress" />
import { HankeIndexData } from '../../src/domain/types/hanke';

export const validateIndexes = (hankeIndexData: Partial<HankeIndexData>) => {
  if (hankeIndexData.liikennehaittaindeksi && hankeIndexData.liikennehaittaindeksi.indeksi) {
    cy.get('[data-testid=test-liikennehaittaindeksi]').should('not.be.empty');
    cy.get('[data-testid=test-liikennehaittaindeksi]').contains(
      hankeIndexData.liikennehaittaindeksi.indeksi,
    );
  }
  if (hankeIndexData.pyoraliikenneindeksi) {
    cy.get('[data-testid=test-pyoraliikenneindeksi]').should('not.be.empty');
    cy.get('[data-testid=test-pyoraliikenneindeksi]').contains(hankeIndexData.pyoraliikenneindeksi);
  }
  if (hankeIndexData.raitioliikenneindeksi) {
    cy.get('[data-testid=test-raitioliikenneindeksi]').contains(
      hankeIndexData.raitioliikenneindeksi,
    );
  }
  if (hankeIndexData.linjaautoliikenneindeksi) {
    cy.get('[data-testid=test-linjaautoliikenneindeksi]').contains(
      hankeIndexData.linjaautoliikenneindeksi,
    );
  }
  if (hankeIndexData.autoliikenneindeksi) {
    cy.get('[data-testid=test-autoliikenneindeksi]').contains(hankeIndexData.autoliikenneindeksi);
  }
};
