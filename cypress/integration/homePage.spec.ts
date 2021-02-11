/// <reference types="cypress" />

context('HomePage', () => {
  beforeEach(() => {
    cy.visit('/fi/');
    cy.injectAxe();
  });

  it('should be accessible', () => {
    cy.checkA11y();
  });
});
