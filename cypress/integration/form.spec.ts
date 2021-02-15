/// <reference types="cypress" />

const drawCoordinateX = 100;
const drawCoordinateY = 100;

const hankeTunnus = 'HAI-testi';
const nimi = 'nimi';
const kuvaus = 'kuvaus';
const alkuPvm = '10.01.2032';
const loppuPvm = '11.01.2032';
const osoite = 'Mannerheimintie 22';

context('HankeForm', () => {
  beforeEach(() => {
    cy.visit('/fi/hanke/uusi');
    cy.injectAxe();
  });

  it('Hanke form testing', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/hankkeet',
      },
      {
        hankeTunnus,
        nimi,
        kuvaus,
        alkuPvm: '2032-01-10T00:00:00Z',
        loppuPvm: '2032-01-11T00:00:00Z',
        vaihe: 'OHJELMOINTI',
        createdBy: '1',
        createdAt: '2020-12-10T13:35:16.316476Z',
        modifiedBy: '1',
        modifiedAt: '2020-12-10T13:35:17.920239Z',
        saveType: 'DRAFT',
        omistajat: [],
        toteuttajat: [],
        arvioijat: [],
      }
    );

    cy.get('input[data-testid=nimi]').type(nimi);
    cy.checkA11y();
    cy.get('textarea[data-testid=kuvaus]').type(kuvaus);
    cy.get('#alkuPvm').type(alkuPvm);
    cy.get('#loppuPvm').type(loppuPvm);
    cy.get('input[data-testid=nimi]').click();
    cy.get('#vaihe-toggle-button').click();
    cy.get('#vaihe-item-0').click();
    cy.get('[data-testid=forward]').should('not.be.disabled');
    cy.get('[data-testid=forward]').click(); // changes view to form1

    cy.get('[data-testid=hankkeenAlue]');
    // cy.checkA11y(); //enable this after axe fixes has been done to map
    cy.get('[data-testid=save-draft-button]').should('be.disabled');
    cy.mapDrawButton('Square').click();
    cy.get('#ol-map')
      .click(drawCoordinateX, drawCoordinateY)
      .click(drawCoordinateX + 10, drawCoordinateY + 10)
      .click(drawCoordinateX, drawCoordinateY);

    cy.get('[data-testid=save-draft-button]').should('not.be.disabled');
    cy.get('[data-testid=forward]').click(); // changes view to form2

    cy.get('[data-testid=omistajat-etunimi]');
    cy.checkA11y();
    cy.get('[data-testid=forward]').click(); // changes view to form3

    cy.get('[data-testid=tyomaaKatuosoite]').type(osoite);
    cy.checkA11y();
    cy.get('[data-testid=forward]').click(); // changes view to form4

    cy.get('#haittaAlkuPvm').type(alkuPvm);
    cy.checkA11y();
    cy.get('#haittaLoppuPvm').type(loppuPvm);
    cy.get('body').click();
    cy.get('#kaistaHaitta-toggle-button').click();
    cy.get('#kaistaHaitta-item-0').click();
    cy.get('#kaistaPituusHaitta-toggle-button').click();
    cy.get('#kaistaPituusHaitta-item-0').click();
    cy.get('#meluHaitta-toggle-button').click();
    cy.get('#meluHaitta-item-0').click();
    cy.get('#polyHaitta-toggle-button').click();
    cy.get('#polyHaitta-item-0').click();
    cy.get('#polyHaitta-toggle-button').click();
    cy.get('#polyHaitta-item-0').click();
    cy.get('#tarinaHaitta-toggle-button').click();
    cy.get('#tarinaHaitta-item-0').click();

    cy.get('[data-testid=finish]').should('not.be.disabled');
  });
});
