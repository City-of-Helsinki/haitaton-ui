/// <reference types="cypress" />

context('hanke form', () => {
  beforeEach(() => {
    cy.visit('/fi/form');
  });

  it('Hanke form testing', () => {
    const nimi = 'my new nimi value';
    const kuvaus = 'my new kuvaus value';
    const alkuPvm = '10.01.2032';
    const loppuPvm = '11.01.2032';
    const osoite = 'Mannerheimintie 22';
    console.log('host', cy.location('host'));
    console.log('port', cy.location('port'));
    cy.get('input[data-testid=nimi1]').type(nimi);
    cy.get('textarea[data-testid=kuvaus]').type(kuvaus);
    cy.get('#alkuPvm').type(alkuPvm);
    cy.get('#loppuPvm').type(loppuPvm);
    cy.get('input[data-testid=nimi]').click({ force: true }); // because needs make datepicker to disappear
    cy.get('#vaihe-toggle-button').click({ force: true });
    cy.get('#vaihe-item-0').click({ force: true });
    cy.scrollTo('bottom');
    cy.get('[data-testid=forward]').click({ force: true }); // changes view to form1

    cy.get('[data-testid=hankkeenAlue]');
    cy.scrollTo('bottom');
    cy.wait(5000);

    cy.get('[data-testid=hankkeenAlue]').click({ force: true });
    cy.get('[data-testid=forward]').click({ force: true }); // changes view to form2

    cy.wait(15000);
    cy.get('[data-testid=hankkeenAlue]');
    cy.get('[data-testid=omistajat-etunimi]');
    cy.scrollTo('bottom');
    cy.get('[data-testid=forward]').click({ force: true }); // changes view to form3

    cy.get('[data-testid=tyomaaKatuosoite]').type(osoite);
    cy.scrollTo('bottom');
    cy.get('[data-testid=forward]').click({ force: true }); // changes view to form4

    cy.get('#haittaAlkuPvm').type(alkuPvm);
    cy.get('#haittaLoppuPvm').type(loppuPvm);
    cy.get('body').click();
    cy.get('#kaistaHaitta-toggle-button').click({ force: true });
    cy.get('#kaistaHaitta-item-0').click({ force: true });
    cy.get('#kaistaPituusHaitta-toggle-button').click({ force: true });
    cy.get('#kaistaPituusHaitta-item-0').click({ force: true });
    cy.get('#meluHaitta-toggle-button').click({ force: true });
    cy.get('#meluHaitta-item-0').click({ force: true });
    cy.get('#polyHaitta-toggle-button').click({ force: true });
    cy.get('#polyHaitta-item-0').click({ force: true });
    cy.get('#polyHaitta-toggle-button').click({ force: true });
    cy.get('#polyHaitta-item-0').click({ force: true });
    cy.get('#tarinaHaitta-toggle-button').click({ force: true });
    cy.get('#tarinaHaitta-item-0').click({ force: true });
    cy.scrollTo('bottom');
    cy.get('[data-testid=finish]').click({ force: true }); // changes view to FinishedForm
    cy.get('[data-testid=finishedForm]');
  });
});
