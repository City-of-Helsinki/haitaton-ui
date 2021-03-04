/// <reference types="cypress" />

context('HankeList', () => {
  beforeEach(() => {
    cy.testLogin();
    cy.injectAxe();
    cy.visit('/fi/hankelista');
  });
  it('should be accessible', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/hankkeet/',
      },
      []
    );
    cy.get('[data-testid=HankeListPageHeader]').should('contain', 'Hankelista');
    cy.checkA11y();
  });
  it('Hanke list testing', () => {
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

  it('Navigate to hanke edit page', () => {
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
  });
});
