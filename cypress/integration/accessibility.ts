/// <reference types="cypress" />

cy.configureAxe({
  rules: {
    'color-contrast': {
      enabled: false,
    },
  },
  exclude: [['footer']],
});

context('Accessibility', () => {
  beforeEach(() => {
    cy.login();
    cy.injectAxe();
  });

  it('Hankelist should be accessible', () => {
    cy.visit('/fi/hankelista');
    cy.checkA11y();
  });

  it('Hankemap should be accessible', () => {
    cy.visit('/fi/map');
    cy.checkA11y();
  });

  it('Hankemap should be accessible', () => {
    cy.visit('/fi/hanke/uusi');
    cy.checkA11y();
  });
});
