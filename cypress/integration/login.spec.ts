/// <reference types="cypress" />

context('HomePage', () => {
  beforeEach(() => {
    cy.visit('/fi/');
  });

  it('should be redirect to login form', () => {
    cy.get('[data-testid=loginLink]').click();
    cy.url().should('include', '/auth/realms/haitaton');
  });
});
