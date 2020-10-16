/// <reference types="cypress" />

context('Frontpage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Project title should contain Not found', () => {
    cy.get('[data-testid=project-title]').should('contain', 'Not found');
  });
});
