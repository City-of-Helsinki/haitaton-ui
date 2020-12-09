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

    cy.get('input[data-testid=nimi]').type(nimi);

    cy.get('textarea[data-testid=kuvaus]').type(kuvaus);

    cy.get('#alkuPvm').type(alkuPvm);

    cy.get('#loppuPvm').type(loppuPvm);

    cy.get('input[data-testid=nimi]').click(); // because needs make datepicker to disappear

    cy.get('#vaihe-toggle-button').click();

    cy.get('#vaihe-item-0').click();

    cy.get('[data-testid=forward]').trigger('mouseover').click();

    cy.get('[data-testid=hankkeenAlue]').then(function () {
      cy.get('[data-testid=forward]').trigger('mouseover').click();
    });

    cy.get('[data-testid=forward]').trigger('mouseover').click();

    cy.get('[data-testid=forward]').trigger('mouseover').click();

    cy.get('#haittaAlkuPvm').type(alkuPvm);

    cy.get('#haittaLoppuPvm').type(loppuPvm);

    cy.get('body').click();

    cy.get('#kaistaHaitta-toggle-button').trigger('mouseover').click();

    cy.get('#kaistaHaitta-item-0').trigger('mouseover').click();

    cy.get('#kaistaPituusHaitta-toggle-button').trigger('mouseover').click();

    cy.get('#kaistaPituusHaitta-item-0').trigger('mouseover').click();

    cy.get('#meluHaitta-toggle-button').trigger('mouseover').click();

    cy.get('#meluHaitta-item-0').trigger('mouseover').click();

    cy.get('#polyHaitta-toggle-button').trigger('mouseover').click();

    cy.get('#polyHaitta-item-0').trigger('mouseover').click();

    cy.get('#polyHaitta-toggle-button').trigger('mouseover').click();

    cy.get('#polyHaitta-item-0').trigger('mouseover').click();

    cy.get('#tarinaHaitta-toggle-button').trigger('mouseover').click();

    cy.get('#tarinaHaitta-item-0').trigger('mouseover').click();

    cy.get('[data-testid=finish]').trigger('mouseover').click();

    cy.get('[data-testid=finishedForm]');
  });
});
