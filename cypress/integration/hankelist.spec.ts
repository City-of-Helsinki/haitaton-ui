/// <reference types="cypress" />

context('HankeForm', () => {
  beforeEach(() => {
    cy.visit('/fi/hankelista');
  });

  it('Hanke list testing', () => {
    cy.get('[data-testid=HankeListPageHeader]').should('contain', 'Hankelista');
    cy.get('[data-testid=toFormLink]').click(); // moves to form
    cy.get('[data-testid=formPageHeader]').should('contain', 'Hanke');
  });
});
