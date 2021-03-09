/// <reference types="cypress" />

// https://github.com/cypress-io/cypress/issues/1065
declare namespace Cypress {
  interface CustomWindow extends Window {
    foo: string;
  }

  export interface Chainable {
    window(options?: Partial<Loggable & Timeoutable>): Chainable<CustomWindow>;

    mapDrawButton(name: string): Chainable<string>;

    login(): Chainable<Element>;
  }
}
