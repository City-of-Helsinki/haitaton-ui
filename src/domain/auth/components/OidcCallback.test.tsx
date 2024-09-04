import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { cleanup, waitFor } from '@testing-library/react';
import OidcCallback from './OidcCallback';
import { LOGIN_CALLBACK_PATH } from '../constants';
import i18n from '../../../locales/i18nForTests';
import {
  RenderWithLoginProviderProps,
  renderWithLoginProvider,
} from '../testUtils/renderWithLoginProvider';

function getWrapper({ state, returnUser, errorType }: RenderWithLoginProviderProps) {
  return renderWithLoginProvider({
    state,
    returnUser,
    errorType,
    children: (
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[LOGIN_CALLBACK_PATH]}>
          <Routes>
            <Route path={LOGIN_CALLBACK_PATH} element={<OidcCallback />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    ),
  });
}

describe('<OidcCallback />', () => {
  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it('as a user I want to see an generic error message about failed authentication', async () => {
    const { findByText, getByRole } = getWrapper({
      state: 'NO_SESSION',
      returnUser: false,
      errorType: 'INVALID_OR_EXPIRED_USER',
    });

    expect(
      await findByText('Kirjautumisessa tapahtui virhe. Yritä uudestaan.'),
    ).toBeInTheDocument();
    expect(getByRole('link', { name: 'etusivulle.' })).toHaveAttribute('href', '/fi/');
  });

  it('as a user I want to be informed when I deny permissions, because the application is unusable due to my choice', async () => {
    const { findByText } = getWrapper({
      state: 'NO_SESSION',
      returnUser: false,
      errorType: 'SIGNIN_ERROR',
    });

    expect(
      await findByText(
        'Sinun täytyy hyväksyä pyytämämme oikeudet käyttääksesi tätä palvelua. Ole hyvä ja yritä kirjautua uudelleen.',
      ),
    ).toBeInTheDocument();
  });

  it('should redirect user after successful login', async () => {
    getWrapper({ state: 'NO_SESSION', returnUser: true, errorType: 'RENEWAL_FAILED' });

    await waitFor(() => expect(window.location.pathname).toEqual('/'));
  });
});
