import React from 'react';
import { renderWithLoginProvider } from '../../../domain/auth/testUtils/renderWithLoginProvider';
import { screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import i18next from '../../../locales/i18nForTests';
import { FeatureFlagsProvider } from '../featureFlags/FeatureFlagsContext';

// Ensure persistence keys are cleared when clicking header links (except language change)
test('clicking header navigation clears functional persistence keys', async () => {
  // Seed sessionStorage with keys matching the functional patterns
  sessionStorage.setItem('functional-hanke-form-new', JSON.stringify({ foo: 'bar' }));
  sessionStorage.setItem('functional-application-form-1-KAIVU', JSON.stringify({ a: 1 }));
  sessionStorage.setItem('functional-hanke-form-step-new-activeStep', '2');

  // Provide minimal environment expected by FeatureFlagsContext and other components
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window._env_ = window._env_ || {};
  window._env_.REACT_APP_FEATURE_PUBLIC_HANKKEET = '1';
  window._env_.REACT_APP_FEATURE_HANKE = '1';

  const queryClient = new QueryClient();
  const { user } = renderWithLoginProvider({
    state: 'NO_SESSION',
    returnUser: true,
    placeUserToStorage: true,
    children: (
      <I18nextProvider i18n={i18next}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <FeatureFlagsProvider>
              <Header />
            </FeatureFlagsProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </I18nextProvider>
    ),
  });

  // Click the hanke list link which should clear persistence keys
  const link = await screen.findByTestId('hankeListLink');
  await user.click(link);

  expect(sessionStorage.getItem('functional-hanke-form-new')).toBeNull();
  expect(sessionStorage.getItem('functional-application-form-1-KAIVU')).toBeNull();
  expect(sessionStorage.getItem('functional-hanke-form-step-new-activeStep')).toBeNull();
});
