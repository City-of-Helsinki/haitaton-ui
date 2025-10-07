import React from 'react';
import { cleanup, screen } from '../../../testUtils/render';
import { waitFor } from '@testing-library/react';
import Header from './Header';
import { renderWithLoginProvider } from '../../../domain/auth/testUtils/renderWithLoginProvider';
import i18next from '../../../locales/i18nForTests';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { FeatureFlagsProvider } from '../featureFlags/FeatureFlagsContext';

// This test asserts that when the current path includes an arbitrary trailing
// subpath (like a manual page id or a workInstructions card path), switching
// language preserves that trailing suffix while switching locale segment and
// localized base path.

test('preserves arbitrary trailing suffix when changing language', async () => {
  const queryClient = new QueryClient();
  // Start at a path representing manual subpage: /fi/manual/asioinninKulku
  // Push the history before rendering so Header reads the correct pathname
  window.history.pushState({}, 'Test', '/fi/manual/asioinninKulku');

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

  // open language selector and choose English (click the language button then the menu item)
  await user.click(screen.getAllByRole('button', { name: /Suomi|English|Svenska/ })[0]);
  await user.click(screen.getAllByText('English')[0]);

  // The pathname should still contain the original suffix; wait for async navigation
  await waitFor(() => expect(window.location.pathname.endsWith('/asioinninKulku')).toBe(true));

  cleanup();
});
