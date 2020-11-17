/// <reference types="cypress" />

context('Frontpage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Frontpage header should contain Haitaton 2.0', () => {
    cy.get('[data-testid=pageHeader]').should('contain', 'Haitaton 2.0');
  });
});
