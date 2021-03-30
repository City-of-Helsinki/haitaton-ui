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
  it('Hankelist should be accessible', () => {
    cy.login('/hankelista').then(() => {
      cy.injectAxe();
      cy.configureAxe(axeConfig);
      cy.checkA11y();
    });
  });

  it('Hankemap should be accessible', () => {
    cy.login('/map').then(() => {
      cy.injectAxe();
      cy.configureAxe(axeConfig);
      cy.checkA11y();
    });
  });

  it('Hankeform should be accessible', () => {
    cy.login('/hanke/uusi');
    cy.injectAxe();
    cy.configureAxe(axeConfig);
    cy.checkA11y();
  });

  it('Saavutettavuusseloste should be accessible', () => {
    cy.login('/saavutettavuusseloste');
    cy.injectAxe();
    cy.configureAxe(axeConfig);
  });
});
