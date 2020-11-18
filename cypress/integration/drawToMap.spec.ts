/// <reference types="cypress" />

const x = 100;
const y = 100;

context('DrawMap', () => {
  beforeEach(() => {
    cy.visit('/fi/map');
  });

  it('should draw polygon to map and show save button', () => {
    cy.mapDrawButton('Polygon').click();

    cy.get('#ol-map')
      .click(x, y)
      .click(x + 10, y + 10)
      .click(x + 20, y + 20)
      .click(x, y);

    cy.get('[data-testid=save-geometry-button]').should('exist');
  });
});
