// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import './jest.polyfills';

// Increase async timeout for waitFor/findBy* — the default 1000ms is too tight
// when running 73 test files in parallel and the system is under CPU load.
configure({ asyncUtilTimeout: 5000 });
import 'vitest-canvas-mock';
import { server } from './domain/mocks/test-server';
import api from './domain/api/api';

// Load test env config so window._env_ is available
import '../public/test-env-config';

import ResizeObserver from 'resize-observer-polyfill';
globalThis.ResizeObserver = ResizeObserver;

globalThis.scrollTo = function () {};
globalThis.HTMLElement.prototype.scrollTo = function () {};
globalThis.HTMLElement.prototype.scrollIntoView = function () {};

api.interceptors.request.clear();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());
