import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './common/components/app/App';
import './locales/i18n';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

// Ensure window._env_ exists to prevent runtime errors
if (!window._env_) {
  console.warn('window._env_ not found, using defaults');
  window._env_ = {};
}

if (String(window._env_.REACT_APP_DISABLE_SENTRY || '') !== '1') {
  Sentry.init({
    dsn: String(window._env_.REACT_APP_SENTRY_DSN || ''),
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.captureConsoleIntegration(),
    ],
    tracesSampleRate:
      // no traces if not in prod or test
      String(window._env_.REACT_APP_DISABLE_SENTRY || '') === '1' ? 0.0 : 1.0,
    environment: process.env.NODE_ENV,
  });
}

const matomoEnabled = String(window._env_.REACT_APP_MATOMO_ENABLED || '') === '1';

const container = document.getElementById('root');

const root = createRoot(container!);

async function enableMocking() {
  if (String(window._env_.REACT_APP_MOCK_API || '') !== 'use') {
    return;
  }
  const { worker } = await import('./domain/mocks/browser');
  return worker.start();
}

if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then((axe) => {
    // https://github.com/dequelabs/axe-core-npm/issues/176
    axe.default(React, ReactDOM, 1000, {}, undefined);
    enableMocking().then(() => {
      root.render(<App matomoEnabled={matomoEnabled} />);
    });
  });
} else {
  root.render(<App matomoEnabled={matomoEnabled} />);
}

declare global {
  interface Window {
    _env_: {
      REACT_APP_DISABLE_SENTRY?: string;
      REACT_APP_SENTRY_DSN?: string;
      REACT_APP_MATOMO_ENABLED?: string;
      REACT_APP_MOCK_API?: string;
      [key: string]: string | number | undefined;
    };

    _paq: [string, ...(string | number | boolean)[]][];
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
