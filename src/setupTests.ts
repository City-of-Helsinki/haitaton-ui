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
const originalConsoleDebug = console.debug;

// act() warning suppression bookkeeping declared early so console overrides can reference it
let actWarningCount = 0;
function suppressActWarning(): boolean {
  actWarningCount += 1;
  return actWarningCount > 1; // show only first occurrence
}

console.error = (...args: unknown[]) => {
  const msg = args[0]?.toString?.() ?? '';
  if (
    msg.includes('Could not parse CSS stylesheet') ||
    msg.includes('Error: Could not parse CSS stylesheet') ||
    // Some libraries may emit noisy element warnings we don't care about in tests
    msg.includes('Warning: React.createElement') ||
    // HDS / React 18 synthetic events: unknown pointer capture props on inputs
    msg.includes('Unknown event handler property `onPointerEnterCapture`') ||
    msg.includes('Unknown event handler property `onPointerLeaveCapture`') ||
    // DOM nesting warnings from composed HDS components (low signal for tests)
    msg.includes('Warning: validateDOMNesting') ||
    // Axios expected 500 test case for /laheta failure test (avoid clutter)
    (msg.includes('Request failed with status code 500') &&
      msg.includes('/hakemukset/') &&
      msg.includes('/laheta')) ||
    // Filter extremely noisy act() warnings AFTER we add auto-act patches below. We still
    // want to see one representative instance for debugging, so allow only the first.
    (msg.includes('not wrapped in act') && suppressActWarning())
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

// Suppress extremely noisy repeated validation debug output
console.debug = (...args: unknown[]) => {
  const msg = args[0]?.toString?.() ?? '';
  if (msg.startsWith('mapValidationError')) {
    return;
  }
  originalConsoleDebug(...(args as Parameters<typeof originalConsoleDebug>));
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
  console.debug = originalConsoleDebug;
  server.close();
});

api.interceptors.request.clear();

jest.mock('./domain/auth/constants', () => {
  jest.requireActual('../public/test-env-config');
  return jest.requireActual('./domain/auth/constants');
});

jest.setTimeout(240000);

// ---- Auto-act patching & act warning control ---------------------------------
// Many libraries (react-query mutations, RHF subscriptions, downshift) trigger asynchronous
// state updates just after user-event interactions. To reduce log noise and make the tests
// deterministic, we monkey patch a few common async utilities to run inside React Testing
// Library's act() implicitly.
import { act } from '@testing-library/react';

// Wrap setTimeout / queueMicrotask driven async callbacks that we control
const originalSetTimeout = global.setTimeout;
// Only wrap timeouts scheduled from test code (stack includes '.test.' or 'Kaivuilmoitus')
global.setTimeout = ((handler: TimerHandler, timeout?: number, ...rest: unknown[]) => {
  if (typeof handler === 'function') {
    const stack = new Error().stack || '';
    if (/\.test\.|KaivuilmoitusForm/.test(stack)) {
      return originalSetTimeout(
        (...cbArgs: unknown[]) => {
          act(() => {
            // handler may accept variadic args; dynamic invocation is intentional
            // eslint-disable-next-line @typescript-eslint/ban-types
            (handler as Function)(...(cbArgs as []));
          });
        },
        timeout,
        ...(rest as []),
      );
    }
  }
  return originalSetTimeout(handler, timeout, ...(rest as []));
}) as typeof setTimeout;

// Wrap Promise.then microtasks initiated from tests (best-effort, lightweight)
const originalThen = Promise.prototype.then;
// eslint-disable-next-line no-extend-native
Promise.prototype.then = function patchedThen<TResult1 = unknown, TResult2 = never>(
  onFulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
  onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
): Promise<TResult1 | TResult2> {
  const wrap = <T>(cb?: ((arg: unknown) => T | PromiseLike<T>) | null) =>
    cb
      ? (value: unknown) => {
          let result: T | PromiseLike<T>;
          act(() => {
            result = cb(value);
          });
          // @ts-expect-error result is assigned inside act callback
          return result;
        }
      : undefined;
  // @ts-expect-error generic forwarding
  return originalThen.call(this, wrap(onFulfilled), wrap(onRejected));
};

// Provide a helper to await all pending promises within act for places where tests can call it
// (opt-in): await flushAsync();
export async function flushAsync() {
  await act(async () => {
    await Promise.resolve();
  });
}

// NOTE: True root-cause elimination should still favor awaiting specific user-event actions,
// react-query settles, or RHF validation promises. The above is a pragmatic reduction of noise
// while underlying tests are being refactored.
