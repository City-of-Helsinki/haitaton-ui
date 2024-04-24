import { rest } from 'msw';
import { User } from 'oidc-client';
import { fireEvent, render, screen } from '../../testUtils/render';
import authService from '../auth/authService';
import { server } from '../mocks/test-server';
import Homepage from './HomepageComponent';

const userName = 'Test User';
const userEmail = 'test.user@mail.com';
const mockUser: Partial<User> = {
  id_token: 'fffff-aaaaaa-11111',
  access_token: '.GbutWVN1x7RSAP5bU2a-tXdVPuof_9pBNd_Ozw',
  profile: {
    iss: '',
    sub: '',
    aud: '',
    exp: 0,
    iat: 0,
    name: userName,
    email: userEmail,
  },
};

describe('Create new hanke from dialog', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  async function openHankeCreateDialog() {
    jest.spyOn(authService.userManager, 'getUser').mockResolvedValue(mockUser as User);
    const { user } = render(<Homepage />);
    await screen.findByRole('heading', {
      name: 'Auta meitä tekemään Haitattomasta vielä parempi!',
    });
    await user.click(screen.getByText('Luo uusi hanke'));
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

    expect(window.location.pathname).toBe('/fi/hanke/HAI22-12/muokkaa');
  });

  test('Should show validation errors and not create hanke if information is missing', async () => {
    const user = await openHankeCreateDialog();
    await user.clear(screen.getByLabelText(/sähköposti/i));
    await user.click(screen.getByRole('button', { name: /luo hanke/i }));

    expect(screen.getByText(/kentän pituus oltava vähintään 3 merkkiä/i)).toBeInTheDocument();
    expect(screen.getAllByText(/kenttä on pakollinen/i)).toHaveLength(2);
    expect(window.location.pathname).toBe('/');
  });

  test('Should show error notification if creating hanke fails', async () => {
    server.use(
      rest.post('/api/hankkeet', async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
      }),
    );
    const user = await openHankeCreateDialog();
    fillInformation();
    await user.click(screen.getByRole('button', { name: /luo hanke/i }));

    expect(screen.getByText('Tapahtui virhe. Yritä uudestaan.')).toBeInTheDocument();
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
    jest.spyOn(authService.userManager, 'getUser').mockResolvedValue(mockUser as User);
    const { user } = render(<Homepage />);
    await screen.findByRole('heading', {
      name: 'Auta meitä tekemään Haitattomasta vielä parempi!',
    });
    await user.click(screen.getByText('Tee johtoselvityshakemus'));
    return user;
  }

  function fillInformation() {
    const email = 'test@mail.com';
    const phone = '0401234567';
    const hankeName = 'Johtoselvitys';
    fireEvent.change(screen.getByLabelText(/sähköposti/i), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/puhelin/i), { target: { value: phone } });
    fireEvent.change(screen.getByLabelText(/työn nimi/i), { target: { value: hankeName } });
  }

  test('Should be able to create new johtoselvitys from dialog', async () => {
    const user = await openJohtoselvitysCreateDialog();
    fillInformation();
    await user.click(screen.getByRole('button', { name: /luo hakemus/i }));

    expect(window.location.pathname).toBe('/fi/johtoselvityshakemus/6/muokkaa');
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
      rest.post('/api/johtoselvityshakemus', async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
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
});
