/// <reference types="cypress" />

context('Login', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/fi/');
  });

  it('should be logged in', () => {
    cy.url().should('not.contain', '/auth/realms/haitaton');
  });

  it('should be render hankeLista header', () => {
    cy.visit('/fi/hankelista');
    cy.get('[data-testid=HankeListPageHeader]').should('contain', 'Hankelista');
  });
});
