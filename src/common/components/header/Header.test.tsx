import { cleanup, screen } from '../../../testUtils/render';
import Header from './Header';
import useUser from '../../../domain/auth/useUser';
import i18next from '../../../locales/i18nForTests';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderWithLoginProvider } from '../../../domain/auth/testUtils/renderWithLoginProvider';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { FeatureFlagsProvider } from '../featureFlags/FeatureFlagsContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedUseUser = useUser as jest.Mock<any>;
jest.mock('../../../domain/auth/useUser');

type Language = 'Suomi' | 'English' | 'Svenska';

async function changeLanguage(user: UserEvent, lang: Language, newLang: Language) {
  await user.click(screen.getAllByRole('button', { name: lang })[0]);
  await user.click(screen.getAllByText(newLang)[0]);
}

function getWrapper(loggedIn: boolean, route = '/') {
  const queryClient = new QueryClient();
  window.history.pushState({}, 'Test page', route);

  return renderWithLoginProvider({
    state: 'NO_SESSION',
    returnUser: true,
    placeUserToStorage: loggedIn,
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
}

describe('Header', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('it should render correct links', () => {
    getWrapper(true);

    expect(screen.getByText('Hankkeet yleisillä alueilla')).toBeInTheDocument();
    expect(screen.getByText('Luo uusi hanke')).toBeInTheDocument();
    expect(screen.getByText('Tee johtoselvityshakemus')).toBeInTheDocument();
    expect(screen.getByText('Omat hankkeet')).toBeInTheDocument();
    expect(screen.getByText('Työohjeet')).toBeInTheDocument();
  });

  test('it should display user name', () => {
    mockedUseUser.mockImplementation(() => ({ profile: { name: 'Test User' } }));
    getWrapper(true);

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('it should display user email if name is undefined', () => {
    const email = 'test.user@mail.com';
    mockedUseUser.mockImplementation(() => ({ profile: { email } }));
    getWrapper(true);

    expect(screen.getByText(email)).toBeInTheDocument();
  });

  test('it should render login button when user is not logged in', () => {
    getWrapper(false);

    expect(screen.getByText('Kirjaudu')).toBeInTheDocument();
  });

  test('when user changes language it should change the UI language and the url based on the selected language', async () => {
    const { user } = getWrapper(true, '/fi/julkisethankkeet');

    await changeLanguage(user, 'Suomi', 'English');
    expect(i18next.language).toBe('en');
    expect(window.location.pathname).toBe('/en/publicprojects');

    await changeLanguage(user, 'English', 'Svenska');
    expect(i18next.language).toBe('sv');
    expect(window.location.pathname).toBe('/sv/allmannaprojekt');

    await changeLanguage(user, 'Svenska', 'Suomi');
    expect(i18next.language).toBe('fi');
    expect(window.location.pathname).toBe('/fi/julkisethankkeet');
  });

  test('should navigate to correct url when changing language when url contains hankeTunnus', async () => {
    const { user } = getWrapper(true, '/fi/hankesalkku/HAI23-1');

    await changeLanguage(user, 'Suomi', 'English');
    expect(window.location.pathname).toBe('/en/projectportfolio/HAI23-1');

    await changeLanguage(user, 'English', 'Svenska');
    expect(window.location.pathname).toBe('/sv/projektportfolj/HAI23-1');
  });

  test('should navigate to correct url when changing language when url contains application id', async () => {
    await i18next.changeLanguage('fi');
    const { user } = getWrapper(true, '/fi/hakemus/1');

    await changeLanguage(user, 'Suomi', 'English');
    expect(window.location.pathname).toBe('/en/application/1');

    await changeLanguage(user, 'English', 'Svenska');
    expect(window.location.pathname).toBe('/sv/ansokan/1');
  });

  test('Should render external work instructions link when hanke feature is disabled', async () => {
    const OLD_ENV = { ...window._env_ };
    window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_HANKE: '0' };
    await i18next.changeLanguage('fi');
    getWrapper(true);

    const linkElement = screen.getByRole('link', {
      name: 'Työohjeet. Avautuu uudessa välilehdessä. Siirtyy toiseen sivustoon.',
    });
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener');
    expect(linkElement).toHaveAttribute(
      'href',
      'https://www.hel.fi/fi/kaupunkiymparisto-ja-liikenne/tontit-ja-rakentamisen-luvat/tyomaan-luvat-ja-ohjeet',
    );

    window._env_ = OLD_ENV;
  });

  test('Should render internal work instructions link when hanke feature is enabled', async () => {
    const OLD_ENV = { ...window._env_ };
    window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_HANKE: '1' };
    await i18next.changeLanguage('fi');
    getWrapper(true);

    const linkElement = await screen.findByRole('link', {
      name: 'Työohjeet',
    });
    expect(linkElement).not.toHaveAttribute('target', '_blank');
    expect(linkElement).not.toHaveAttribute('rel', 'noopener');
    expect(linkElement).toHaveAttribute('href', '/fi/tyoohjeet');

    window._env_ = OLD_ENV;
  });
});
