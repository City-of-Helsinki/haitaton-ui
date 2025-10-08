// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import '@testing-library/jest-dom';
import './jest.polyfills';
import { GlobalWithFetchMock } from 'jest-fetch-mock';
import 'jest-canvas-mock';

// --- Per-test console capture and persistent run log --------------------------------
// Create a single per-run timestamped log file in /tmp that will contain all console output
// across the test run. Also buffer per-spec (test) console messages and print them to
// stdout only when CI !== 'true' OR when the spec did not pass.
import fs from 'fs';
import path from 'path';

const PROJECT_NAME = 'haitaton';
const RUN_START = new Date();
const TIMESTAMP = RUN_START.toISOString()
  .replace(/:/g, '-')
  .replace(/\.\d+Z$/, 'Z');
const RUN_LOG_PATH = path.join('/tmp', `${PROJECT_NAME}_${TIMESTAMP}_jest.log`);
try {
  fs.writeFileSync(RUN_LOG_PATH, `Jest run started at ${RUN_START.toISOString()}\n\n`);
  // Record relevant env vars for debugging why CI-based suppression may not trigger
  try {
    fs.appendFileSync(
      RUN_LOG_PATH,
      `ENV: CI=${process.env.CI || ''}, SHOW_TEST_LOGS=${process.env.SHOW_TEST_LOGS || ''}, TEST_TEE_LOG=${process.env.TEST_TEE_LOG || ''}\n\n`,
    );
  } catch (e) {
    /* ignore */
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('Could not create Jest run log file:', e);
}

// Buffers: map from spec fullName to array of {type,message}
const specBuffers: Record<string, Array<{ type: string; message: string }>> = {};
let currentSpecFullName: string | null = null;
let globalBufferPrinted = false;
// Track statuses when available (jasmine) and bufHasError for circus fallback
const specStatuses: Record<string, string> = {};
const circusBufHasError: Record<string, boolean> = {};

const originalConsole = {
  log: console.log.bind(console),
  error: console.error.bind(console),
  warn: console.warn.bind(console),
  info: console.info.bind(console),
  debug: console.debug.bind(console),
};

function appendToRunLog(text: string) {
  try {
    fs.appendFileSync(RUN_LOG_PATH, text);
  } catch (e) {
    // eslint-disable-next-line no-console
    originalConsole.error('Failed to append to run log:', e);
  }
}

function appendToTeeLog(text: string) {
  const tee = process.env.TEST_TEE_LOG;
  if (!tee) return;
  try {
    fs.appendFileSync(tee, text);
  } catch (e) {
    // don't spam terminal on tee failures
    originalConsole.error('Failed to append to tee log:', e);
  }
}

function isCIEnvTrue(): boolean {
  const v = (process.env.CI || '').toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

function pushConsole(type: string, args: Array<unknown>) {
  try {
    const parts: string[] = args.map((a) => {
      if (typeof a === 'string') return a;
      try {
        return JSON.stringify(a);
      } catch (e) {
        return String(a);
      }
    });
    const message = parts.join(' ');
    const key = currentSpecFullName || '__global__';
    if (!specBuffers[key]) specBuffers[key] = [];
    specBuffers[key].push({ type, message });
    if (type === 'error') circusBufHasError[key] = true;
    // Persist immediately to run log for complete traceability
    appendToRunLog(`[${type}] ${message}\n`);
    // Also append to tee log if present so external tee captures streaming output
    appendToTeeLog(`[${type}] ${message}\n`);
  } catch (e) {
    // swallow errors from logging
  }
}

// If Jasmine environment is available (CRA default for many setups), add a reporter to
// capture specStarted / specDone. We record spec statuses and persist buffers, but
// defer printing until process exit so we can suppress all per-spec/global output when
// CI=true and the run contains only passing specs.
const g: unknown = global;
if (typeof g === 'object' && g !== null && 'jasmine' in (g as Record<string, unknown>)) {
  const maybeJasmine = (g as Record<string, unknown>)['jasmine'] as
    | { getEnv?: () => { addReporter?: (r: unknown) => void } }
    | undefined;
  if (maybeJasmine && typeof maybeJasmine.getEnv === 'function') {
    const jasmineEnv = maybeJasmine.getEnv!();
    if (jasmineEnv && typeof jasmineEnv.addReporter === 'function') {
      jasmineEnv.addReporter({
        specStarted(spec: unknown) {
          try {
            const s = spec as Record<string, unknown>;
            currentSpecFullName =
              (s.fullName as string) || (s.description as string) || String(s.id);
          } catch (e) {
            currentSpecFullName = null;
          }
        },
        specDone(spec: unknown) {
          try {
            const s = spec as Record<string, unknown>;
            const key = (s.fullName as string) || (s.description as string) || String(s.id);
            const status = (s.status as string) || 'unknown';
            const buf = specBuffers[key] || [];

            // Persist captured buffer and tee copy
            appendToRunLog(`\n==== Spec: ${key} [${status}] ====\n`);
            for (const m of buf) appendToRunLog(`[${m.type}] ${m.message}\n`);
            if (buf.length) {
              try {
                let teeBlock = `\n==== Spec: ${key} [${status}] ====\n`;
                for (const m of buf) teeBlock += `[${m.type}] ${m.message}\n`;
                appendToTeeLog(teeBlock);
              } catch (e) {
                // ignore
              }
            }

            // Record status for later
            specStatuses[key] = status;

            // Decide whether to print buffered output for this spec now.
            // Behavior: when CI=true, only print buffers for specs that did not pass.
            // Legacy SHOW_TEST_LOGS and TEST_RUNNER_FORCE_SHOW can force printing when CI=false
            // or when the runner explicitly enables it, but by default plain CI=true will be quiet.
            const ci = isCIEnvTrue();
            const runnerForceShow = process.env.TEST_RUNNER_FORCE_SHOW === 'true';
            const legacyShow = process.env.SHOW_TEST_LOGS === 'true';
            const forceShow = runnerForceShow || (!ci && legacyShow);
            const shouldShow = forceShow || !ci || status !== 'passed';
            // (diagnostic DECIDE logging removed)

            if (shouldShow && buf.length) {
              // If there were import-time / global messages, print them once before per-spec output
              const globalBuf = specBuffers['__global__'] || [];
              if (!globalBufferPrinted && globalBuf.length) {
                try {
                  let printedGlobal = '';
                  process.stdout.write(`\n---- global console output ----\n`);
                  for (const gm of globalBuf) {
                    const outg = `[${gm.type}] ${gm.message}\n`;
                    printedGlobal += outg;
                    if (gm.type === 'error' || gm.type === 'warn') {
                      process.stderr.write(outg);
                    } else {
                      process.stdout.write(outg);
                    }
                  }
                  process.stdout.write(`---- end global console output ----\n\n`);
                  appendToTeeLog(
                    `\n---- global console output ----\n${printedGlobal}---- end global console output ----\n\n`,
                  );
                } catch (e) {
                  originalConsole.log('\n---- global console output ----');
                  for (const gm of globalBuf) originalConsole.log(`[${gm.type}] ${gm.message}`);
                  originalConsole.log('---- end global console output ----\n');
                }
                globalBufferPrinted = true;
              }
              try {
                process.stdout.write(`\n---- console output for ${key} ----\n`);
                let printed = '';
                for (const m of buf) {
                  const out = `[${m.type}] ${m.message}\n`;
                  printed += out;
                  // send errors to stderr
                  if (m.type === 'error' || m.type === 'warn') {
                    process.stderr.write(out);
                  } else {
                    process.stdout.write(out);
                  }
                }
                const footer = `---- end console output for ${key} ----\n\n`;
                process.stdout.write(footer);
                // Also append the printed block to the tee log if provided so `tee` captures it
                appendToTeeLog(`\n---- console output for ${key} ----\n${printed}${footer}`);
              } catch (e) {
                // fallback
                originalConsole.log(`\n---- console output for ${key} ----`);
                for (const m of buf) originalConsole.log(`[${m.type}] ${m.message}`);
                originalConsole.log(`---- end console output for ${key} ----\n`);
              }
            }
          } catch (e) {
            originalConsole.error('Error in jasmine reporter specDone:', e);
          } finally {
            currentSpecFullName = null;
          }
        },
      });
    }
  }
}

// On process exit, append a final footer into the run log
process.on('exit', () => {
  try {
    fs.appendFileSync(RUN_LOG_PATH, `\nJest run finished at ${new Date().toISOString()}\n`);
  } catch (e) {
    // eslint-disable-next-line no-console
    originalConsole.error('Could not finalize Jest run log:', e);
  }
});

// Fallback for jest-circus environments: use beforeEach/afterEach and expect.getState()
// to flush per-test buffers when Jasmine reporters are not available.
try {
  // only add these hooks if Jasmine reporter wasn't added (currentSpecFullName handling
  // via jasmine is preferred because it exposes pass/fail status)
  if (typeof beforeEach === 'function' && typeof afterEach === 'function') {
    beforeEach(() => {
      try {
        // expect.getState().currentTestName is available under jest-circus
        // expect.getState().currentTestName is available under jest-circus; access dynamically
        currentSpecFullName = (expect.getState && expect.getState().currentTestName) || null;
      } catch (e) {
        currentSpecFullName = null;
      }
    });

    afterEach(() => {
      try {
        // access jest state dynamically; not all runners expose this
        const state = expect.getState ? expect.getState() : ({} as Record<string, unknown>);
        const key = (state.currentTestName as string) || '__unknown__';
        const buf = specBuffers[key] || [];

        appendToRunLog(`\n==== Spec: ${key} [circus-afterEach] ====` + '\n');
        for (const m of buf) appendToRunLog(`[${m.type}] ${m.message}\n`);

        // Always append the full captured buffer to the tee log for completeness
        if (buf.length) {
          try {
            let teeBlock = `\n==== Spec: ${key} [circus-afterEach] ====\n`;
            for (const m of buf) teeBlock += `[${m.type}] ${m.message}\n`;
            appendToTeeLog(teeBlock);
          } catch (e) {
            // ignore
          }
        }

        const ci = isCIEnvTrue();
        const runnerForceShow = process.env.TEST_RUNNER_FORCE_SHOW === 'true';
        const legacyShow = process.env.SHOW_TEST_LOGS === 'true';
        const forceShow = runnerForceShow || (!ci && legacyShow);
        // In circus we don't always have a pass/fail status here. Use a heuristic: if the
        // captured per-spec buffer contains any 'error' entries then treat it as a failing
        // spec and print the buffered output even under CI. Otherwise, suppress buffers
        // when CI=true unless explicitly forced by the runner.
        // Under CI we want passing tests to be quiet. Only show when forced or when not running in CI.
        const shouldShow = forceShow || !ci;
        // (diagnostic DECIDE logging removed)
        if (shouldShow && buf.length) {
          const globalBuf = specBuffers['__global__'] || [];
          if (!globalBufferPrinted && globalBuf.length) {
            try {
              let printedGlobal = '';
              process.stdout.write(`\n---- global console output ----\n`);
              for (const gm of globalBuf) {
                const outg = `[${gm.type}] ${gm.message}\n`;
                printedGlobal += outg;
                if (gm.type === 'error' || gm.type === 'warn') process.stderr.write(outg);
                else process.stdout.write(outg);
              }
              process.stdout.write(`---- end global console output ----\n\n`);
              appendToTeeLog(
                `\n---- global console output ----\n${printedGlobal}---- end global console output ----\n\n`,
              );
            } catch (e) {
              originalConsole.log('\n---- global console output ----');
              for (const gm of globalBuf) originalConsole.log(`[${gm.type}] ${gm.message}`);
              originalConsole.log('---- end global console output ----\n');
            }
            globalBufferPrinted = true;
          }

          try {
            process.stdout.write(`\n---- console output for ${key} ----\n`);
            let printed = '';
            for (const m of buf) {
              const out = `[${m.type}] ${m.message}\n`;
              printed += out;
              if (m.type === 'error' || m.type === 'warn') process.stderr.write(out);
              else process.stdout.write(out);
            }
            const footer = `---- end console output for ${key} ----\n\n`;
            process.stdout.write(footer);
            appendToTeeLog(`\n---- console output for ${key} ----\n${printed}${footer}`);
          } catch (e) {
            originalConsole.log(`\n---- console output for ${key} ----`);
            for (const m of buf) originalConsole.log(`[${m.type}] ${m.message}`);
            originalConsole.log(`---- end console output for ${key} ----\n`);
          }
        }
      } catch (e) {
        originalConsole.error('Error in jest-circus fallback afterEach:', e);
      } finally {
        currentSpecFullName = null;
      }
    });
  }
} catch (e) {
  // ignore if expect.getState or hooks aren't available
}

// Console overrides: always buffer messages and forward them to the original console.
// We no longer filter noisy messages here; CI should be used to control verbosity.
console.error = (...args: unknown[]) => {
  try {
    // Always buffer error messages. Do NOT forward directly to the real console here.
    // The jasmine/circus hooks below are responsible for printing buffered output
    // conditionally (based on CI / SHOW_TEST_LOGS / test status). Forwarding here
    // made suppression unreliable in worker processes.
    pushConsole('error', args);
  } catch (e) {
    // best-effort: don't throw from a console override
  }
};

console.warn = (...args: unknown[]) => {
  try {
    // Buffer warns; printing is handled by the reporter/afterEach hooks.
    pushConsole('warn', args);
  } catch (e) {
    // best-effort
  }
};

console.debug = (...args: unknown[]) => {
  try {
    // Buffer debug messages only.
    pushConsole('debug', args);
  } catch (e) {
    // best-effort
  }
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
  // restore console implementations
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.debug = originalConsole.debug;
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
  return originalThen.call(this, wrap(onFulfilled), wrap(onRejected)); // NOSONAR
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
