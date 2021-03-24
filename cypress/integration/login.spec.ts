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

  it('should logout and login again with user without haitaton-user group', () => {
    cy.visit('/fi/');
    cy.get('[data-testid=logoutLink]').click();
    cy.url().should('include', '/auth/realms/haitaton');

    // Timo does not belong to haitaton-user group. API-calls should fail
    cy.get('#username').type('timotestaaja@gofore.com');
    cy.get('#password').type('timo12');
    cy.get('#kc-login').click();

    cy.visit('/fi/hankelista');
    // Header exists only when API-request success
    cy.get('[data-testid=HankeListPageHeader]').should('not.exist');
  });
});
