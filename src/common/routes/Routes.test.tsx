import { waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { InitialEntry } from '@remix-run/router';
import { Provider } from 'react-redux';
import AppRoutes from './AppRoutes';
import { FeatureFlagsProvider } from '../components/featureFlags/FeatureFlagsContext';
import { GlobalNotificationProvider } from '../components/globalNotification/GlobalNotificationContext';
import { store } from '../redux/store';
import i18n from '../../locales/i18n';
import { REDIRECT_PATH_KEY } from './constants';
import { renderWithLoginProvider } from '../../domain/auth/testUtils/renderWithLoginProvider';

afterEach(() => {
  sessionStorage.clear();
});

const path = '/fi/johtoselvityshakemus';

function getWrapper(loggedIn: boolean, routerInitialEntries?: InitialEntry[]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retryDelay: 0,
      },
    },
  });

  return renderWithLoginProvider({
    state: 'NO_SESSION',
    returnUser: true,
    placeUserToStorage: loggedIn,
    children: (
      <MemoryRouter initialEntries={routerInitialEntries}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>
              <FeatureFlagsProvider>
                <GlobalNotificationProvider>
                  <AppRoutes />
                </GlobalNotificationProvider>
              </FeatureFlagsProvider>
            </I18nextProvider>
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>
    ),
  });
}

test('Should save path to session storage and navigate to login if trying to navigate to private route', async () => {
  getWrapper(false, [path]);

  expect(window.sessionStorage.getItem(REDIRECT_PATH_KEY)).toBe(path);
});

test('Should redirect to path stored in session storage after login if one exists', async () => {
  sessionStorage.setItem(REDIRECT_PATH_KEY, path);

  getWrapper(true);

  await waitFor(() =>
    expect(window.document.title).toBe('Haitaton - Luo uusi johtoselvityshakemus'),
  );
});
