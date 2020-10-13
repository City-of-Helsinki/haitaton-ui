/// <reference types="cypress" />

context('Frontpage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Project title should contain Not found', () => {
    cy.get('[data-testid=project-title]').should('contain', 'Not found');
  });
});
