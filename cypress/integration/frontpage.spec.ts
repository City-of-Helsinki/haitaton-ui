/// <reference types="cypress" />

context('Frontpage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Project title should contain Not found', () => {
    cy.get('[data-testid=page-header]').should('contain', 'Haitaton 2.0');
  });
});
