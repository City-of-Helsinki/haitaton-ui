import React from 'react';
import { render, cleanup, screen } from '../../../testUtils/render';
import Header from './Header';
import useUser from '../../../domain/auth/useUser';
import i18next from '../../../locales/i18nForTests';

jest.setTimeout(10000);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedUseUser = useUser as jest.Mock<any>;
jest.mock('../../../domain/auth/useUser');

describe('Header', () => {
  beforeEach(() => {
    const mockedUser = {
      profile: {
        name: 'Test User',
      },
    };
    mockedUseUser.mockImplementation(() => ({ data: mockedUser }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('it should render correct links', () => {
    render(<Header />);

    expect(screen.getByText('Hankkeet yleisillä alueilla')).toBeInTheDocument();
    expect(screen.getByText('Luo uusi hanke')).toBeInTheDocument();
    expect(screen.getByText('Tee johtoselvityshakemus')).toBeInTheDocument();
    expect(screen.getByText('Omat hankkeet')).toBeInTheDocument();
    expect(screen.getByText('Työohjeet')).toBeInTheDocument();
  });

  test('it should display user name', () => {
    render(<Header />);

    expect(screen.getAllByText('Test User')).toHaveLength(2);
  });

  test('when user changes language it should change the UI language and the url based on the selected language', async () => {
    const { user } = render(<Header />, undefined, '/fi/julkisethankkeet/kartta');

    await user.click(screen.getAllByRole('button', { name: /suomi/i })[0]);
    await user.click(screen.getAllByText(/english/i)[0]);
    expect(i18next.language).toBe('en');
    expect(window.location.pathname).toBe('/en/publicprojects/map');

    await user.click(screen.getAllByRole('button', { name: /english/i })[0]);
    await user.click(screen.getAllByText(/svenska/i)[0]);
    expect(i18next.language).toBe('sv');
    expect(window.location.pathname).toBe('/sv/allmannaprojekt/karta');

    await user.click(screen.getAllByRole('button', { name: /svenska/i })[0]);
    await user.click(screen.getAllByText(/suomi/i)[0]);
    expect(i18next.language).toBe('fi');
    expect(window.location.pathname).toBe('/fi/julkisethankkeet/kartta');
  });
});
