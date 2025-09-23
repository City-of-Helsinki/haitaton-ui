/* eslint-disable @typescript-eslint/no-require-imports*/
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import '@testing-library/jest-dom';
import './jest.polyfills';
import { GlobalWithFetchMock } from 'jest-fetch-mock';
import 'jest-canvas-mock';

// Suppress console errors/warnings as early as possible to catch messages
// emitted during module import (e.g., hds-react CSS injection via jsdom)
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: unknown[]) => {
  const msg = args[0]?.toString?.() ?? '';
  if (
    msg.includes('Could not parse CSS stylesheet') ||
    msg.includes('Error: Could not parse CSS stylesheet') ||
    // Some libraries may emit noisy element warnings we don't care about in tests
    msg.includes('Warning: React.createElement')
  ) {
    return;
  }
  originalConsoleError(...(args as Parameters<typeof originalConsoleError>));
};

console.warn = (...args: unknown[]) => {
  const msg = args[0]?.toString?.() ?? '';
  if (
    msg.includes('React Router Future Flag Warning') ||
    msg.includes('componentWillReceiveProps has been renamed')
  ) {
    return;
  }
  originalConsoleWarn(...(args as Parameters<typeof originalConsoleWarn>));
};

// Require heavy modules after console overrides so their import-time logs are filtered
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { server } = require('./domain/mocks/test-server');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const api = require('./domain/api/api').default;

const customGlobal: GlobalWithFetchMock = global as unknown as GlobalWithFetchMock;

customGlobal.fetch = require('jest-fetch-mock');

customGlobal.fetchMock = customGlobal.fetch;

global.ResizeObserver = require('resize-observer-polyfill');

window.scrollTo = function () {};

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

beforeEach(() => server.resetHandlers());

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  server.close();
});

api.interceptors.request.clear();

jest.mock('./domain/auth/constants', () => {
  jest.requireActual('../public/test-env-config');
  return jest.requireActual('./domain/auth/constants');
});

jest.setTimeout(240000);
