/// <reference lib="dom" />
/**
 * Polyfills for jsdom test environment
 * Fixes issues with MSW (Mock Service Worker) and other libraries
 */
// ProgressEvent is not defined in jsdom, causing issues with XMLHttpRequest mocking
// This polyfill adds it to the global scope
if (globalThis.ProgressEvent === undefined) {
  globalThis.ProgressEvent = Event as unknown as typeof ProgressEvent;
}
