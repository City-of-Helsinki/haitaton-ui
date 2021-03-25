/// <reference types="cypress" />

const drawCoordinateX = 100;
const drawCoordinateY = 100;

const hankeMock = {
  hankeTunnus: 'HAI-testi',
  nimi: 'Cypress test',
  kuvaus: 'kuvaus',
  alkuPvm: '10.01.2030',
  loppuPvm: '11.01.2032',
  haittaAlkuPvm: '01.02.2031',
  haittaLoppuPvm: '31.12.2031',
  osoite: 'Mannerheimintie 22',
  vaihe: 'OHJELMOINTI',
};

context('HankeForm', () => {
  beforeEach(() => {
    // cy.injectAxe();
    cy.login();
    cy.visit('/fi/hanke/uusi');
  });

  it('Hanke form testing', () => {
    // cy.checkA11y();
    cy.get('input[data-testid=nimi]').type(hankeMock.nimi);
    cy.get('textarea[data-testid=kuvaus]').type(hankeMock.kuvaus);
    cy.get('#alkuPvm').type(hankeMock.alkuPvm);
    cy.get('#loppuPvm').type(hankeMock.loppuPvm);
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
    // cy.checkA11y();
    cy.get('[data-testid=forward]').click(); // changes view to form3

    cy.get('[data-testid=tyomaaKatuosoite]').type(hankeMock.osoite);
    // cy.checkA11y();
    cy.get('[data-testid=forward]').click(); // changes view to form4

    cy.get('#haittaAlkuPvm').type(hankeMock.haittaAlkuPvm);
    // cy.checkA11y();
    cy.get('#haittaLoppuPvm').type(hankeMock.haittaLoppuPvm);
    cy.get('[data-testid=form4Header]').click(); // Close datepicker because it is over kaitaHaitta-toggle-button
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

    cy.get('[data-testid=save-draft-button]').should('not.be.disabled');
    cy.get('[data-testid=save-draft-button]').click();
  });

  it('Editing hanke should fetch and populate form data', () => {
    cy.visit(`/fi/hankelista`);
    cy.get('[data-testid=hankeEditLink]').first().click();
    cy.get('[data-testid=save-draft-button]').should('be.disabled');
    cy.get('input[data-testid=nimi]').should('have.value', hankeMock.nimi);
    // Type something to make form dirty and enable save-draft-button
    cy.get('textarea[data-testid=kuvaus]')
      .clear()
      .type('Uusi kuvaus')
      .should('have.value', 'Uusi kuvaus');
    cy.get('[data-testid=save-draft-button]').should('not.be.disabled');
  });
});
