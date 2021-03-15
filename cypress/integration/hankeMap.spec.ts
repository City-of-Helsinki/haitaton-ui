/// <reference types="cypress" />

context('HankeMap', () => {
  before(() => {
    cy.injectAxe();
  });

  beforeEach(() => {
    cy.login();
  });

  it('should be accessible', () => {
    cy.visit('/fi/map');
    cy.checkA11y();
  });
});
