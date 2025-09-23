import { http, HttpResponse } from 'msw';
import { I18nextProvider } from 'react-i18next';
import { fireEvent, screen } from '../../testUtils/render';
import { server } from '../mocks/test-server';
import Homepage from './HomepageComponent';
import { renderWithLoginProvider } from '../auth/testUtils/renderWithLoginProvider';
import i18n from '../../locales/i18nForTests';
import { BrowserRouter } from 'react-router-dom';
import { FeatureFlagsProvider } from '../../common/components/featureFlags/FeatureFlagsContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import * as hakemuksetDB from '../mocks/data/hakemukset';

const userEmail = 'test.user@mail.com';

const queryClient = new QueryClient();

describe('Create new hanke from dialog', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  async function openHankeCreateDialog() {
    const { user } = renderWithLoginProvider({
      state: 'VALID_SESSION',
      returnUser: true,
      placeUserToStorage: true,
      children: (
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <FeatureFlagsProvider>
                <Homepage />
              </FeatureFlagsProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </I18nextProvider>
      ),
    });
    const createElement = await screen.findByText('Asiointi yleisellä alueella');
    await user.click(createElement);
    return user;
  }

  function fillInformation() {
    const hankeName = 'Testihanke';
    const email = 'test@mail.com';
    const phone = '0401234567';
    fireEvent.change(screen.getByLabelText(/hankkeen nimi/i), { target: { value: hankeName } });
    fireEvent.change(screen.getByLabelText(/sähköposti/i), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/puhelin/i), { target: { value: phone } });
  }

  test('Should be able to create new hanke from dialog', async () => {
    const user = await openHankeCreateDialog();
    fillInformation();
    await user.click(screen.getByRole('button', { name: /luo hanke/i }));

    expect(window.location.pathname).toBe('/fi/hanke/HAI22-14/muokkaa');
  });

  test('Should show validation errors and not create hanke if information is missing', async () => {
    const user = await openHankeCreateDialog();
    await user.clear(screen.getByLabelText(/sähköposti/i));
    await user.click(screen.getByRole('button', { name: /luo hanke/i }));

    expect(
      await screen.findByText(/kentän pituus oltava vähintään 3 merkkiä/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/kenttä on pakollinen/i)).toHaveLength(2);
    expect(window.location.pathname).toBe('/');
  });

  test('Should show error notification if creating hanke fails', async () => {
    server.use(
      http.post('/api/hankkeet', async () => {
        return HttpResponse.json({ errorMessage: 'Failed for testing purposes' }, { status: 500 });
      }),
    );
    const user = await openHankeCreateDialog();
    fillInformation();
    await user.click(screen.getByRole('button', { name: /luo hanke/i }));

    expect(await screen.findByText('Tapahtui virhe. Yritä uudestaan.')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
  });

  test('Email should be pre-filled', async () => {
    await openHankeCreateDialog();

    expect(screen.getByLabelText(/sähköposti/i)).toHaveValue(userEmail);
  });
});

describe('Create johtoselvitys from dialog', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  async function openJohtoselvitysCreateDialog() {
    const { user } = renderWithLoginProvider({
      state: 'VALID_SESSION',
      returnUser: true,
      placeUserToStorage: true,
      children: (
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <FeatureFlagsProvider>
                <Homepage />
              </FeatureFlagsProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </I18nextProvider>
      ),
    });
    await screen.findByRole('heading', {
      name: 'Auta meitä tekemään Haitattomasta vielä parempi!',
    });
    await user.click(screen.getByText('Asiointi yksityisellä alueella'));
    return user;
  }

  function fillInformation(options: { email?: string; phone?: string; hankeName?: string } = {}) {
    const { email = 'test@mail.com', phone = '0401234567', hankeName = 'Johtoselvitys' } = options;
    fireEvent.change(screen.getByLabelText(/sähköposti/i), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/puhelin/i), { target: { value: phone } });
    fireEvent.change(screen.getByLabelText(/työn nimi/i), { target: { value: hankeName } });
  }

  test('Should be able to create new johtoselvitys from dialog', async () => {
    const user = await openJohtoselvitysCreateDialog();
    fillInformation();
    await user.click(screen.getByRole('button', { name: /luo hakemus/i }));

    expect(window.location.pathname).toBe(
      `/fi/johtoselvityshakemus/${(await hakemuksetDB.readAll()).length}/muokkaa`,
    );
  });

  test('Should show validation errors and not create johtoselvitys if information is missing', async () => {
    const user = await openJohtoselvitysCreateDialog();
    await user.clear(screen.getByLabelText(/sähköposti/i));
    await user.click(screen.getByRole('button', { name: /luo hakemus/i }));

    expect(screen.getAllByText(/kenttä on pakollinen/i)).toHaveLength(3);
    expect(window.location.pathname).toBe('/');
  });

  test('Should show error notification if creating johtoselvitys fails', async () => {
    server.use(
      http.post('/api/johtoselvityshakemus', async () => {
        return HttpResponse.json({ errorMessage: 'Failed for testing purposes' }, { status: 500 });
      }),
    );
    const user = await openJohtoselvitysCreateDialog();
    fillInformation();
    await user.click(screen.getByRole('button', { name: /luo hakemus/i }));

    expect(screen.getByText('Tapahtui virhe. Yritä uudestaan.')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
  });

  test('Email should be pre-filled', async () => {
    await openJohtoselvitysCreateDialog();

    expect(screen.getByLabelText(/sähköposti/i)).toHaveValue(userEmail);
  });

  test('Should show error notification if phone number is not valid', async () => {
    const user = await openJohtoselvitysCreateDialog();
    fillInformation({ phone: '123kj456' });
    await user.click(screen.getByRole('button', { name: /luo hakemus/i }));

    expect(screen.getByText('Puhelinnumero on virheellinen')).toBeInTheDocument();
  });
});

describe('Work instructions link', () => {
  function setup() {
    return renderWithLoginProvider({
      state: 'VALID_SESSION',
      returnUser: true,
      placeUserToStorage: true,
      children: (
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <FeatureFlagsProvider>
                <Homepage />
              </FeatureFlagsProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </I18nextProvider>
      ),
    });
  }

  test('Should render external work instructions link when hanke feature is disabled', () => {
    const OLD_ENV = { ...window._env_ };
    window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_HANKE: '0' };
    setup();

    const linkElement = screen.getByRole('link', {
      name: 'Tutustu ohjeisiin. Avautuu uudessa välilehdessä. Siirtyy toiseen sivustoon.',
    });
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener');
    expect(linkElement).toHaveAttribute(
      'href',
      'https://www.hel.fi/fi/kaupunkiymparisto-ja-liikenne/tontit-ja-rakentamisen-luvat/tyomaan-luvat-ja-ohjeet',
    );

    window._env_ = OLD_ENV;
  });

  test('Should render internal work instructions link when hanke feature is enabled', () => {
    const OLD_ENV = { ...window._env_ };
    window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_HANKE: '1' };
    setup();

    const linkElement = screen.getByRole('link', {
      name: 'Tutustu ohjeisiin.',
    });
    expect(linkElement).not.toHaveAttribute('target', '_blank');
    expect(linkElement).not.toHaveAttribute('rel', 'noopener');
    expect(linkElement).toHaveAttribute('href', '/fi/tyoohjeet');

    window._env_ = OLD_ENV;
  });
});
