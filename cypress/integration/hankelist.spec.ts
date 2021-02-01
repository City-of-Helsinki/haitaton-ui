/// <reference types="cypress" />

import initialData from '../../src/domain/hanke/list/e2eInitialData.json';

// import { initialData } from '../../src/domain/hanke/list/testInitialData';

context('HankeList', () => {
  beforeEach(() => {
    cy.visit('/fi/hankelista');
  });

  it('Hanke list testing', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/hankkeet/',
      },
      initialData
    );

    cy.get('[data-testid=tableHeader0]').click(); // sorts table
    cy.get('[data-testid=tableHeader1]').click(); // sorts table
    cy.get('[data-testid=tableHeader2]').click(); // sorts table
    cy.get('[data-testid=tableHeader3]').click(); // sorts table
    cy.get('[data-testid=tableHeader4]').click(); // sorts table

    cy.get('[data-testid=HankeListPageHeader]').should('contain', 'Hankelista');
    cy.get('[data-testid=toFormLink]').click(); // moves to form
    cy.get('[data-testid=formPageHeader]').should('contain', 'Hanke');
  });
});
