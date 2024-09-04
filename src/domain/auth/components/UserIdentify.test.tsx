import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { InitialEntry } from '@remix-run/router';
import { Provider } from 'react-redux';
import AppRoutes from '../../../common/routes/AppRoutes';
import { FeatureFlagsProvider } from '../../../common/components/featureFlags/FeatureFlagsContext';
import { GlobalNotificationProvider } from '../../../common/components/globalNotification/GlobalNotificationContext';
import GlobalNotification from '../../../common/components/globalNotification/GlobalNotification';
import { store } from '../../../common/redux/store';
import i18n from '../../../locales/i18nForTests';
import { REDIRECT_PATH_KEY } from '../../../common/routes/constants';
import * as hankeUsersApi from '../../hanke/hankeUsers/hankeUsersApi';
import { renderWithLoginProvider } from '../testUtils/renderWithLoginProvider';

afterEach(() => {
  sessionStorage.clear();
});

const id = '5ArrqPT6kW97QTK7t7ya9PA2';
const path = `/fi/kutsu?id=${id}`;

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
          <I18nextProvider i18n={i18n}>
            <QueryClientProvider client={queryClient}>
              <FeatureFlagsProvider>
                <GlobalNotificationProvider>
                  <AppRoutes />
                  <GlobalNotification />
                </GlobalNotificationProvider>
              </FeatureFlagsProvider>
            </QueryClientProvider>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    ),
  });
}

test('Should save path with query string to session storage and navigate to login when going to invitation route', async () => {
  getWrapper(false, [path]);

  expect(window.sessionStorage.getItem(REDIRECT_PATH_KEY)).toBe(path);
});

test('Should identify user after login', async () => {
  sessionStorage.setItem(REDIRECT_PATH_KEY, path);
  const identifyUser = jest.spyOn(hankeUsersApi, 'identifyUser');

  getWrapper(true);

  await waitFor(() => expect(window.document.title).toBe('Haitaton - Etusivu'));
  expect(identifyUser).toHaveBeenCalledWith(id);
  expect(
    screen.queryByText(
      'Tunnistautuminen onnistui. Sinut on nyt lisätty hankkeelle (Aidasmäentien vesihuollon rakentaminen HAI22-2).',
    ),
  ).toBeInTheDocument();
});
