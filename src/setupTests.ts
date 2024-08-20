// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { GlobalWithFetchMock } from 'jest-fetch-mock';
import 'jest-canvas-mock';
import { server } from './domain/mocks/test-server';
import api from './domain/api/api';

const customGlobal: GlobalWithFetchMock = global as unknown as GlobalWithFetchMock;

customGlobal.fetch = require('jest-fetch-mock');

customGlobal.fetchMock = customGlobal.fetch;

global.ResizeObserver = require('resize-observer-polyfill');

window.scrollTo = function () {};

api.interceptors.request.clear();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('./domain/auth/constants', () => {
  jest.requireActual('../public/test-env-config');
  return jest.requireActual('./domain/auth/constants');
});

jest.setTimeout(240000);
