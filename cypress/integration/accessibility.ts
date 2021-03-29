/// <reference types="cypress" />

const axeConfig = {
  rules: [
    {
      id: 'color-contrast',
      enabled: false,
    },
  ],
  exclude: [['footer']],
};

context('Accessibility', () => {
  beforeEach(() => {
    cy.login();
  });

  /* it('Hankelist should be accessible', () => {
    cy.visit('/fi/hankelista');
    cy.injectAxe();
    cy.configureAxe(axeConfig);
    cy.checkA11y();
  });

  it('Hankemap should be accessible', () => {
    cy.visit('/fi/map');
    cy.injectAxe();
    cy.configureAxe(axeConfig);
    cy.checkA11y();
  }); */

  /* it('Hankeform should be accessible', () => {
    cy.visit('/fi/hanke/uusi');
    cy.injectAxe();
    cy.configureAxe(axeConfig);
    cy.checkA11y();
  }); */

  it('Saavutettavuusseloste should be accessible', () => {
    cy.visit('/fi/saavutettavuusseloste');
    cy.injectAxe();
    cy.configureAxe(axeConfig);
    cy.checkA11y();
  });
});
