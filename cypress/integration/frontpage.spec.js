/// <reference types="cypress" />

context('Frontpage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('.type() - type into a DOM element', () => {
    cy.get('[data-testid=project-title]').should('contain', 'Not found');
  });
});
