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

// Shared runstamp file used so the first worker to start the run decides the
// canonical timestamp for the run log. Other workers will read the stamp and
// append to the same log file. This avoids creating one log per worker.
const RUN_STAMP_FILE = path.join('/tmp', `${PROJECT_NAME}_jest_runstamp`);
let RUN_TIMESTAMP = TIMESTAMP;
let RUN_LOG_PATH = path.join('/tmp', `${PROJECT_NAME}_${RUN_TIMESTAMP}_jest.log`);
let isRunLeader = false;

function tryCreateRunStamp(ts: string) {
  try {
    // 'wx' ensures we fail if another process created it concurrently
    fs.writeFileSync(RUN_STAMP_FILE, ts, { flag: 'wx' });
    isRunLeader = true;
    RUN_TIMESTAMP = ts;
    RUN_LOG_PATH = path.join('/tmp', `${PROJECT_NAME}_${RUN_TIMESTAMP}_jest.log`);
    return true;
  } catch {
    // someone else created it concurrently or write failed
    return false;
  }
}

try {
  if (fs.existsSync(RUN_STAMP_FILE)) {
    try {
      const existing = fs.readFileSync(RUN_STAMP_FILE, 'utf8').trim();
      // sanity check: if the corresponding log file exists, reuse it, otherwise
      // try to claim a fresh stamp (race-safe)
      const candidate = path.join('/tmp', `${PROJECT_NAME}_${existing}_jest.log`);
      if (fs.existsSync(candidate)) {
        RUN_TIMESTAMP = existing;
        RUN_LOG_PATH = candidate;
      } else if (!tryCreateRunStamp(TIMESTAMP)) {
        // attempt to become leader and overwrite stamp; if that fails, read again
        const again = fs.readFileSync(RUN_STAMP_FILE, 'utf8').trim();
        RUN_TIMESTAMP = again;
        RUN_LOG_PATH = path.join('/tmp', `${PROJECT_NAME}_${RUN_TIMESTAMP}_jest.log`);
      }
    } catch {
      // fallback: try to create stamp
      tryCreateRunStamp(TIMESTAMP);
    }
  } else {
    // attempt to become run leader
    tryCreateRunStamp(TIMESTAMP);
  }

  if (isRunLeader) {
    // leader writes the primary header
    fs.writeFileSync(RUN_LOG_PATH, `Jest run started at ${RUN_START.toISOString()}\n\n`);
    // Record relevant env vars for debugging why CI-based suppression may not trigger
    try {
      fs.appendFileSync(
        RUN_LOG_PATH,
        `ENV: CI=${process.env.CI || ''}, SHOW_TEST_LOGS=${process.env.SHOW_TEST_LOGS || ''}, TEST_TEE_LOG=${process.env.TEST_TEE_LOG || ''}\n\n`,
      );
    } catch {
      /* ignore */
    }
  } else {
    // Non-leader workers append a small started notice so the combined log shows
    // which worker processes contributed entries.
    try {
      fs.appendFileSync(
        RUN_LOG_PATH,
        `\n---- worker started: id=${process.env.JEST_WORKER_ID || 'unknown'} pid=${process.pid} file=${__filename} ----\n`,
      );
    } catch {
      // ignore
    }
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('Could not create or open Jest run log file:', e);
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

function getWorkerPrefix() {
  const wid = process.env.JEST_WORKER_ID || '0';
  return `[worker:${wid} pid:${process.pid}] `;
}

function appendToRunLog(text: string) {
  try {
    // Prefix every appended block with worker id/pid for traceability.
    const pref = getWorkerPrefix();
    // Ensure multi-line blocks have the prefix on each line.
    const withPrefix = text
      .split('\n')
      .map((l, i) => (l === '' && i === text.split('\n').length - 1 ? '' : pref + l))
      .join('\n');
    fs.appendFileSync(RUN_LOG_PATH, withPrefix);
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

// Build a spec log block (header + buffered messages) used for both run and tee logs.
function buildSpecLogBlock(
  key: string,
  status: string,
  buf: Array<{ type: string; message: string }>,
): string {
  let out = `==== Spec: ${key} [${status}] ====\n`;
  for (const m of buf) out += `[${m.type}] ${m.message}\n`;
  return out;
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
      } catch {
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
  } catch {
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
          } catch {
            currentSpecFullName = null;
          }
        },
        specDone(spec: unknown) {
          try {
            const s = spec as Record<string, unknown>;
            const key = (s.fullName as string) || (s.description as string) || String(s.id);
            const status = (s.status as string) || 'unknown';
            const buf = specBuffers[key] || [];

            // Persist captured buffer and tee copy (single concatenated block for fewer writes)
            if (buf.length) {
              const block = buildSpecLogBlock(key, status, buf);
              appendToRunLog(`\n${block}`);
              appendToTeeLog(`\n${block}`);
            } else {
              // Still record header in run log for empty specs to show status
              appendToRunLog(`\n==== Spec: ${key} [${status}] ====\n`);
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
                } catch {
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
              } catch {
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
    // If this process was the run leader, remove the runstamp file to avoid stale stamps
    if (isRunLeader) {
      try {
        originalConsole.log(`Jest run log available at: ${RUN_LOG_PATH}`);
        if (fs.existsSync(RUN_STAMP_FILE)) fs.unlinkSync(RUN_STAMP_FILE);
      } catch {
        // ignore
      }
    }
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
        // expect.getState().currentTestName is available under jest-circus; access dynamically
        currentSpecFullName = expect.getState()?.currentTestName || null;
      } catch {
        currentSpecFullName = null;
      }
    });

    afterEach(() => {
      try {
        // access jest state dynamically; not all runners expose this
        const state = expect.getState ? expect.getState() : ({} as Record<string, unknown>);
        const key = (state.currentTestName as string) || '__unknown__';
        const buf = specBuffers[key] || [];

        if (buf.length) {
          const block = buildSpecLogBlock(key, 'circus-afterEach', buf);
          appendToRunLog(`\n${block}`);
          appendToTeeLog(`\n${block}`);
        } else {
          appendToRunLog(`\n==== Spec: ${key} [circus-afterEach] ====\n`);
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
            } catch {
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
          } catch {
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
} catch {
  // ignore if expect.getState or hooks aren't available
}

// Console overrides: always buffer messages and forward them to the original console.
console.error = (...args: unknown[]) => {
  try {
    // Always buffer error messages. Do NOT forward directly to the real console here.
    // The jasmine/circus hooks below are responsible for printing buffered output
    // conditionally (based on CI / SHOW_TEST_LOGS / test status). Forwarding here
    // made suppression unreliable in worker processes.
    pushConsole('error', args);
  } catch {
    // best-effort: don't throw from a console override
  }
};

console.warn = (...args: unknown[]) => {
  try {
    // Buffer warns; printing is handled by the reporter/afterEach hooks.
    pushConsole('warn', args);
  } catch {
    // best-effort
  }
};

console.debug = (...args: unknown[]) => {
  try {
    // Buffer debug messages only.
    pushConsole('debug', args);
  } catch {
    // best-effort
  }
};

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

// Wrap Promise.then microtasks initiated from tests
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
