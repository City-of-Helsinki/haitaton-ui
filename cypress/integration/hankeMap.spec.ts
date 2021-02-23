/// <reference types="cypress" />

context('HankeMap', () => {
  beforeEach(() => {
    cy.visit('/fi/map');
    cy.injectAxe();
  });

  it('should be accessible', () => {
    cy.checkA11y();
  });
});
