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
    cy.get('#vaihe-toggle-button').click();
    cy.wait(500);
    cy.get('#vaihe-item-0').click();
    cy.wait(500);
    cy.get('input[data-testid=nimi]').type(nimi);
    cy.wait(500);
    cy.get('textarea[data-testid=kuvaus]').type(kuvaus);
    cy.wait(500);
    cy.get('#alkuPvm').type(alkuPvm);
    cy.wait(500);
    cy.get('#loppuPvm').type(loppuPvm);
    cy.wait(500);
    cy.get('[data-testid=forward]').trigger('mouseover').click();
    cy.wait(500);
    cy.get('[data-testid=hankkeenAlue]').then(function () {
      cy.get('[data-testid=forward]').trigger('mouseover').click();
    });
    cy.wait(500);
    cy.get('[data-testid=forward]').trigger('mouseover').click();
    cy.wait(500);
    cy.get('[data-testid=forward]').trigger('mouseover').click();
    cy.wait(500);
    cy.get('#haittaAlkuPvm').type(alkuPvm);
    cy.wait(500);
    cy.get('#haittaLoppuPvm').type(loppuPvm);
    cy.wait(500);
    cy.get('body').click();
    cy.wait(500);
    cy.get('#kaistaHaitta-toggle-button').trigger('mouseover').click();
    cy.wait(500);
    cy.get('#kaistaHaitta-item-0').trigger('mouseover').click();
    cy.wait(500);
    cy.get('#kaistaPituusHaitta-toggle-button').trigger('mouseover').click();
    cy.wait(500);
    cy.get('#kaistaPituusHaitta-item-0').trigger('mouseover').click();
    cy.wait(500);
    cy.get('#meluHaitta-toggle-button').trigger('mouseover').click();
    cy.wait(500);
    cy.get('#meluHaitta-item-0').trigger('mouseover').click();
    cy.wait(500);
    cy.get('#polyHaitta-toggle-button').trigger('mouseover').click();
    cy.wait(500);
    cy.get('#polyHaitta-item-0').trigger('mouseover').click();
    cy.wait(500);
    cy.get('#polyHaitta-toggle-button').trigger('mouseover').click();
    cy.wait(500);
    cy.get('#polyHaitta-item-0').trigger('mouseover').click();
    cy.wait(500);
    cy.get('#tarinaHaitta-toggle-button').trigger('mouseover').click();
    cy.wait(500);
    cy.get('#tarinaHaitta-item-0').trigger('mouseover').click();
    cy.wait(500);
    cy.get('[data-testid=finish]').trigger('mouseover').click();
    cy.wait(500);
    cy.get('[data-testid=finishedForm]');
  });
});
