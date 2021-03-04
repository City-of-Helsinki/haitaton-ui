/// <reference types="cypress" />

context('Login', () => {
  beforeEach(() => {
    cy.testLogin();
    cy.visit('/fi/');
  });

  it('should be logged in', () => {
    cy.get('[data-testid=should-login-text]').should('not.exist');
  });

  it('should be render hankeLista header', () => {
    cy.visit('/fi/hankelista');
    cy.get('[data-testid=HankeListPageHeader]').should('contain', 'Hankelista');
  });
});
