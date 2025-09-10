// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import '@testing-library/jest-dom';
import './jest.polyfills';
import { GlobalWithFetchMock } from 'jest-fetch-mock';
import 'jest-canvas-mock';
import { server } from './domain/mocks/test-server';
import api from './domain/api/api';

const customGlobal: GlobalWithFetchMock = global as unknown as GlobalWithFetchMock;

customGlobal.fetch = require('jest-fetch-mock');

customGlobal.fetchMock = customGlobal.fetch;

global.ResizeObserver = require('resize-observer-polyfill');

window.scrollTo = function () {};

// Suppress console errors in tests to improve performance
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress known CSS parsing errors from HDS React components
  console.error = (...args: unknown[]) => {
    const errorMessage = args[0]?.toString() || '';
    if (
      errorMessage.includes('Could not parse CSS stylesheet') ||
      errorMessage.includes('Error: Could not parse CSS stylesheet') ||
      errorMessage.includes('Warning: React.createElement')
    ) {
      return;
    }
    originalConsoleError(...args);
  };

  console.warn = (...args: unknown[]) => {
    if (
      args[0]?.toString().includes('React Router Future Flag Warning') ||
      args[0]?.toString().includes('componentWillReceiveProps has been renamed')
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };

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
