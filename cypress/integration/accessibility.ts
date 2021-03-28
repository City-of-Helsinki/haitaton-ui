/// <reference types="cypress" />

context('Accessibility', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Hankelist should be accessible', () => {
    cy.visit('/fi/hankelista');
    cy.injectAxe();
    cy.configureAxe({
      exclude: [['footer']],
    });
    cy.checkA11y();
  });

  it('Hankemap should be accessible', () => {
    cy.visit('/fi/map');
    cy.injectAxe();
    cy.configureAxe({
      exclude: [['footer']],
    });
    cy.checkA11y();
  });

  it('Hankeform should be accessible', () => {
    cy.visit('/fi/hanke/uusi');
    cy.injectAxe();
    cy.configureAxe({
      exclude: [['footer']],
    });
    cy.checkA11y();
  });
});
