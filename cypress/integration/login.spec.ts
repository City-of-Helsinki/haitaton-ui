/// <reference types="cypress" />

context('Login', () => {
  beforeEach(() => {
    cy.visit('/fi/');
  });

  it('should be redirect to login form', () => {
    cy.get('[data-testid=loginLink]').click();
    cy.url().should('include', '/auth/realms/haitaton');
    cy.get('#username').type('tiinatestaaja@gofore.com');
    cy.get('#password').type('tiina12');
    cy.get('#kc-login').click();
    cy.url().should('include', '/fi');

    cy.get('[data-testid=should-login-text]').should('not.exist');
  });
});
