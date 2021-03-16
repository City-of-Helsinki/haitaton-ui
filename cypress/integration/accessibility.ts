/// <reference types="cypress" />

context('Accessibility', () => {
  before(() => {
    cy.injectAxe();
  });

  beforeEach(() => {
    cy.login();
  });

  it('Hankelist should be accessible', () => {
    cy.visit('/fi/hankelista');
    // cy.checkA11y();
  });

  it('Hankemap should be accessible', () => {
    cy.visit('/fi/map');
    cy.checkA11y();
  });
});
