import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { cleanup } from '@testing-library/react';
import OidcCallback from './OidcCallback';
import { LOGIN_CALLBACK_PATH } from '../constants';
import i18n from '../../../locales/i18nForTests';
import {
  RenderWithLoginProviderProps,
  renderWithLoginProvider,
} from '../testUtils/renderWithLoginProvider';

function getWrapper({ state, returnUser, errorType, userADGroups }: RenderWithLoginProviderProps) {
  return renderWithLoginProvider({
    state,
    returnUser,
    errorType,
    userADGroups,
    children: (
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[LOGIN_CALLBACK_PATH]}>
          <Routes>
            <Route path="/" element={<div>Home page</div>} />
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

  it('should redirect user to home page after successful login', async () => {
    const { findByText } = getWrapper({
      state: 'NO_SESSION',
      returnUser: true,
      errorType: undefined,
    });

    expect(await findByText('Home page')).toBeInTheDocument();
  });

  it('should show AD group error message when user does not have required AD groups', async () => {
    const OLD_ENV = { ...window._env_ };
    window._env_ = {
      ...OLD_ENV,
      REACT_APP_USE_AD_FILTER: '1',
      REACT_APP_ALLOWED_AD_GROUPS: 'test_group_2;test_group_3',
    };
    const { findByText } = getWrapper({
      state: 'NO_SESSION',
      returnUser: true,
      errorType: undefined,
      userADGroups: ['test_group'],
    });

    expect(await findByText('Ei käyttöoikeutta Haitaton-asiointiin')).toBeInTheDocument();
    window._env_ = OLD_ENV;
  });

  it('should redirect user to home page when user has required AD groups', async () => {
    const OLD_ENV = { ...window._env_ };
    window._env_ = {
      ...OLD_ENV,
      REACT_APP_USE_AD_FILTER: '1',
      REACT_APP_ALLOWED_AD_GROUPS: 'test_group;test_group_2;test_group_3',
    };
    const { findByText } = getWrapper({
      state: 'NO_SESSION',
      returnUser: true,
      errorType: undefined,
      userADGroups: ['test_group'],
    });

    expect(await findByText('Home page')).toBeInTheDocument();
    window._env_ = OLD_ENV;
  });

  it('should redirect user to home page when REACT_APP_USE_AD_FILTER is not in use even when user does not have required AD groups', async () => {
    const OLD_ENV = { ...window._env_ };
    window._env_ = {
      ...OLD_ENV,
      REACT_APP_USE_AD_FILTER: '0',
      REACT_APP_ALLOWED_AD_GROUPS: 'test_group_2',
    };
    const { findByText } = getWrapper({
      state: 'NO_SESSION',
      returnUser: true,
      errorType: undefined,
      userADGroups: ['test_group'],
    });

    expect(await findByText('Home page')).toBeInTheDocument();
    window._env_ = OLD_ENV;
  });
});
