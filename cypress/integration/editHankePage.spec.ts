/// <reference types="cypress" />

const savedHanke = {
  hankeTunnus: 'HAI-testi',
  nimi: 'nimi',
  kuvaus: 'kuvaus',
  alkuPvm: '10.01.2032',
  loppuPvm: '11.01.2032',
  osoite: 'Mannerheimintie 22',
  vaihe: 'OHJELMOINTI',
};

context('EditHankePage', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/hankkeet/HAI-testi',
      },
      savedHanke
    );
    cy.visit(`/fi/hanke/${savedHanke.hankeTunnus}`);
  });

  it('Editing hanke should fetch and populate form data', () => {
    cy.get('input[data-testid=nimi]').should('have.value', savedHanke.nimi);
    // Type something to make form dirty and enable save-draft-button
    cy.get('textarea[data-testid=kuvaus]')
      .clear()
      .type('Uusi kuvaus')
      .should('have.value', 'Uusi kuvaus');
    cy.get('[data-testid=save-draft-button]').should('not.be.disabled');
  });
});
