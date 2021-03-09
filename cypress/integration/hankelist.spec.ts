/// <reference types="cypress" />

context('HankeList', () => {
  before(() => {
    cy.injectAxe();
  });
  beforeEach(() => {
    cy.testLogin();
  });

  // False positives?
  // https://github.com/component-driven/cypress-axe/issues/22
  /* it('should be accessible', () => {
    cy.visit('/fi/hankelista');
    cy.intercept(
      {
        method: 'GET',
        url: '/api/hankkeet/',
      },
      []
    );
    cy.checkA11y();
    cy.get('[data-testid=HankeListPageHeader]').should('contain', 'Hankelista');
  });
  */

  it('Hanke list testing', () => {
    cy.visit('/fi/hankelista');
    cy.intercept(
      {
        method: 'GET',
        url: '/api/hankkeet/',
      },
      []
    );
    cy.get('[data-testid=HankeListPageHeader]').should('contain', 'Hankelista');
    cy.get('[data-testid=toFormLink]').click();
    cy.get('[data-testid=formPageHeader]').should('contain', 'Hanke');
  });

  // Zero results in CI, should be tested after adding new hanke
  /* it('Navigate to hanke edit page', () => {
    cy.visit('/fi/hankelista');
    cy.intercept(
      {
        method: 'GET',
        url: '/api/hankkeet/',
      },
      [
        {
          id: 1,
          hankeTunnus: 'SMTGEN2_1',
          onYKTHanke: false,
          nimi: 'dsf',
          kuvaus: '',
          alkuPvm: '2020-11-26T00:00:00Z',
          loppuPvm: '2020-11-17T00:00:00Z',
          vaihe: 'OHJELMOINTI',
          suunnitteluVaihe: null,
          version: 0,
          modifiedBy: null,
          modifiedAt: null,
          saveType: 'DRAFT',
          omistajat: [],
          arvioijat: [],
          toteuttajat: [],
          tyomaaTyyppi: [],
        },
      ]
    );
    cy.get('[data-testid=hankeEditLink]').first().click();
    cy.url().should('include', '/muokkaa');
  }); */
});
