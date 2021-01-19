/// <reference types="cypress" />
// import { initialData } from '../../src/domain/hanke/list/testInitialData';

context('HankeList', () => {
  beforeEach(() => {
    cy.visit('/fi/hankelista');
  });

  it('Hanke list testing', () => {
    cy.intercept(
      {
        method: 'GET', // Route all GET requests
        url: '/api/hankkeet/', // that have a URL that matches.
      },
      [] // and force the response to be: []
    );
    cy.get('[data-testid=HankeListPageHeader]').should('contain', 'Hankelista');
    cy.get('[data-testid=toFormLink]').click(); // moves to form
    cy.get('[data-testid=formPageHeader]').should('contain', 'Hanke');
  });
});
