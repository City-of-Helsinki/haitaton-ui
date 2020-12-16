/// <reference types="cypress" />

context('HankeForm', () => {
  beforeEach(() => {
    cy.visit('/fi/form');
  });

  it('Hanke form testing', () => {
    const nimi = 'nimi';
    const kuvaus = 'kuvaus';
    const alkuPvm = '10.01.2032';
    const loppuPvm = '11.01.2032';
    const osoite = 'Mannerheimintie 22';
    cy.get('input[data-testid=nimi]').type(nimi);
    cy.get('textarea[data-testid=kuvaus]').type(kuvaus);
    cy.get('#alkuPvm').type(alkuPvm);
    cy.get('#loppuPvm').type(loppuPvm);
    cy.get('input[data-testid=nimi]').click();
    cy.get('#vaihe-toggle-button').click();
    cy.get('#vaihe-item-0').click();
    cy.get('[data-testid=forward]').should('not.be.disabled');
    cy.get('[data-testid=forward]').click(); // changes view to form1

    cy.get('[data-testid=hankkeenAlue]');
    cy.get('[data-testid=forward]').click(); // changes view to form2

    cy.get('[data-testid=omistajat-etunimi]');
    cy.get('[data-testid=forward]').click(); // changes view to form3

    cy.get('[data-testid=tyomaaKatuosoite]').type(osoite);
    cy.get('[data-testid=forward]').click(); // changes view to form4

    cy.get('#haittaAlkuPvm').type(alkuPvm);
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
