/// <reference types="cypress" />

context('HomePage', () => {
  beforeEach(() => {
    cy.visit('/fi/');
  });

  it('should be accessible', () => {
    cy.injectAxe();
    cy.checkA11y();
  });
});
