/**
 * This is compiled from a few sources to get MWS 2 to work with jest and create-react-app.
 *
 * https://mswjs.io/docs/migrations/1.x-to-2.x/
 * https://github.com/mswjs/msw/issues/1796
 */

/**
 * @note The block below contains polyfills for Node.js globals
 * required for Jest to function when running JSDOM tests.
 * These HAVE to be require's and HAVE to be in this exact
 * order, since "undici" depends on the "TextEncoder" global API.
 *
 * Consider migrating to a more modern test runner if
 * you don't want to deal with this.
 */

import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web';

Object.defineProperties(globalThis, {
  ReadableStream: { value: ReadableStream, writable: true },
  TransformStream: { value: TransformStream, writable: true },
  WritableStream: { value: WritableStream, writable: true },
});

// Add BroadcastChannel polyfill for MSW
if (!globalThis.BroadcastChannel) {
  class BroadcastChannel {
    constructor(name) {
      this.name = name;
      this.listeners = [];
    }

    addEventListener(type, listener) {
      if (type === 'message') {
        this.listeners.push(listener);
      }
    }

    removeEventListener(type, listener) {
      if (type === 'message') {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
          this.listeners.splice(index, 1);
        }
      }
    }

    postMessage(data) {
      this.listeners.forEach((listener) => {
        listener({ data, type: 'message' });
      });
    }

    close() {
      this.listeners = [];
    }
  }

  globalThis.BroadcastChannel = BroadcastChannel;
}

const { TextDecoder, TextEncoder } = require('node:util');

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
});

// Add scrollTo polyfill for DOM elements (needed for Chakra UI Menu)
if (typeof globalThis.window !== 'undefined' && !Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function (options) {
    if (typeof options === 'object' && options !== null) {
      this.scrollLeft = options.left || 0;
      this.scrollTop = options.top || 0;
    } else {
      this.scrollLeft = arguments[0] || 0;
      this.scrollTop = arguments[1] || 0;
    }
  };
}

const { Blob, File } = require('node:buffer');
const { fetch, Headers, FormData, Request, Response } = require('undici');

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response },
});
