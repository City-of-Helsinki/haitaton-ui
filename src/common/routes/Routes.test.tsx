import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { InitialEntry } from '@remix-run/router';
import { User } from 'oidc-client';
import { Provider } from 'react-redux';
import AppRoutes from './AppRoutes';
import { FeatureFlagsProvider } from '../components/featureFlags/FeatureFlagsContext';
import { GlobalNotificationProvider } from '../components/globalNotification/GlobalNotificationContext';
import authService from '../../domain/auth/authService';
import { store } from '../redux/store';
import i18n from '../../locales/i18n';
import { REDIRECT_PATH_KEY } from './constants';

afterEach(() => {
  sessionStorage.clear();
});

const path = '/fi/johtoselvityshakemus';

const mockUser: Partial<User> = {
  id_token: 'fffff-aaaaaa-11111',
  access_token: '.BnutWVN1x7RSAP5bU2a-tXdVPuof_9pBNd_Ozw',
  profile: {
    iss: '',
    sub: '',
    aud: '',
    exp: 0,
    iat: 0,
  },
};

function getWrapper(routerInitialEntries?: InitialEntry[]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retryDelay: 0,
      },
    },
  });

  return render(
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
    </MemoryRouter>,
  );
}

test('Should save path to session storage and navigate to login if trying to navigate to private route', async () => {
  const login = jest.spyOn(authService, 'login').mockResolvedValue();

  getWrapper([path]);

  await waitFor(() => expect(login).toHaveBeenCalled());
  expect(window.sessionStorage.getItem(REDIRECT_PATH_KEY)).toBe(path);
});

test('Should redirect to path stored in session storage after login if one exists', async () => {
  sessionStorage.setItem(REDIRECT_PATH_KEY, path);
  jest.spyOn(authService.userManager, 'getUser').mockResolvedValue(mockUser as User);

  getWrapper();

  await waitFor(() =>
    expect(window.document.title).toBe('Haitaton - Luo uusi johtoselvityshakemus'),
  );
});
