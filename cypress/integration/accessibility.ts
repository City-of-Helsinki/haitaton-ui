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

  it('Saavutettavuusseloste should be accessible', () => {
    cy.visit('/fi/saavutettavuusseloste');
    cy.injectAxe();
    cy.configureAxe(axeConfig);
  });
});
