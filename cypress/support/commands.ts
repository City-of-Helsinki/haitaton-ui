// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-localstorage-commands';

Cypress.Commands.add('mapDrawButton', (name) => cy.get(`[data-testid=draw-control-${name}]`));

Cypress.Commands.add('login', () => {
  cy.restoreLocalStorage();
  cy.visit('/fi/');

  // cy.get('[data-testid=loginLink]').then(($loginLink) => {
  //  if ($loginLink.text() === 'Kirjaudu') {
  //    cy.get('[data-testid=loginLink]').click();

  cy.url().then(($url) => {
    if ($url.indexOf('/auth/realms/haitaton') !== -1) {
      cy.url().should('include', '/auth/realms/haitaton');
      cy.get('#username').type('tiinatestaaja@gofore.com');
      cy.get('#password').type('tiina12');
      cy.get('#kc-login').click();
      cy.url().should('include', '/fi');
      cy.saveLocalStorage();
    }
  });
});
