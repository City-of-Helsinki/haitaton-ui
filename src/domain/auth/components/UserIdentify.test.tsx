import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { InitialEntry } from '@remix-run/router';
import { User } from 'oidc-client';
import { Provider } from 'react-redux';
import AppRoutes from '../../../common/routes/AppRoutes';
import { FeatureFlagsProvider } from '../../../common/components/featureFlags/FeatureFlagsContext';
import { GlobalNotificationProvider } from '../../../common/components/globalNotification/GlobalNotificationContext';
import GlobalNotification from '../../../common/components/globalNotification/GlobalNotification';
import { store } from '../../../common/redux/store';
import i18n from '../../../locales/i18n';
import authService from '../authService';
import { REDIRECT_PATH_KEY } from '../../../common/routes/constants';
import * as hankeUsersApi from '../../hanke/hankeUsers/hankeUsersApi';

afterEach(() => {
  sessionStorage.clear();
});

const id = '5ArrqPT6kW97QTK7t7ya9PA2';
const path = `/fi/kutsu?id=${id}`;

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
                <GlobalNotification />
              </GlobalNotificationProvider>
            </FeatureFlagsProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </Provider>
    </MemoryRouter>,
  );
}

test('Should save path with query string to session storage and navigate to login when going to invitation route', async () => {
  const login = jest.spyOn(authService, 'login').mockResolvedValue();

  getWrapper([path]);

  await waitFor(() => expect(login).toHaveBeenCalled());
  expect(window.sessionStorage.getItem(REDIRECT_PATH_KEY)).toBe(path);
});

test('Should identify user after login', async () => {
  sessionStorage.setItem(REDIRECT_PATH_KEY, path);
  jest.spyOn(authService.userManager, 'getUser').mockResolvedValue(mockUser as User);
  const identifyUser = jest.spyOn(hankeUsersApi, 'identifyUser');

  getWrapper();

  await waitFor(() => expect(window.document.title).toBe('Haitaton - Etusivu'));
  expect(identifyUser).toHaveBeenCalledWith(id);
  expect(
    screen.queryByText(
      'Tunnistautuminen onnistui. Sinut on nyt lisätty hankkeelle (Aidasmäentien vesihuollon rakentaminen HAI22-2).',
    ),
  ).toBeInTheDocument();
});
