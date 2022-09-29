// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import 'jest-localstorage-mock';
import { GlobalWithFetchMock } from 'jest-fetch-mock';
import 'jest-canvas-mock';

const customGlobal: GlobalWithFetchMock = (global as unknown) as GlobalWithFetchMock;

customGlobal.fetch = require('jest-fetch-mock');

customGlobal.fetchMock = customGlobal.fetch;

jest.mock('./domain/auth/constants', () => {
  jest.requireActual('../public/test-env-config');
  return jest.requireActual('./domain/auth/constants');
});
