/// <reference types="cypress" />

context('Accessibility', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
    cy.configureAxe({
      exclude: [['footer']], // False positives on footer color contrast
    });
  });

  it('Hankelist should be accessible', () => {
    cy.visit('/fi/hankelista');
    cy.checkA11y();
  });

  it('Hankemap should be accessible', () => {
    cy.visit('/fi/map');
    cy.checkA11y();
  });

  it('Hankeform should be accessible', () => {
    cy.visit('/fi/hanke/uusi');
    cy.checkA11y();
  });
});
