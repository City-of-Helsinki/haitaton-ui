import React from 'react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { cleanup, render, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import authService from '../authService';
import OidcCallback from './OidcCallback';
import { LOGIN_CALLBACK_PATH } from '../constants';
import i18n from '../../../locales/i18nForTests';

const getWrapper = () =>
  render(
    <MemoryRouter initialEntries={[LOGIN_CALLBACK_PATH]}>
      <I18nextProvider i18n={i18n}>
        <Routes>
          <Route path={LOGIN_CALLBACK_PATH} element={<OidcCallback />} />
        </Routes>
      </I18nextProvider>
    </MemoryRouter>,
  );

describe('<OidcCallback />', () => {
  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it('as a user I want to see an generic error message about failed authentication', async () => {
    jest.spyOn(authService, 'endLogin').mockRejectedValue(new Error('foobar'));

    const { queryByText, getByRole } = getWrapper();

    await waitFor(() =>
      expect(queryByText('Kirjautumisessa tapahtui virhe. Yritä uudestaan.')).toBeInTheDocument(),
    );
    expect(getByRole('link', { name: 'etusivulle.' })).toHaveAttribute('href', '/fi/');
  });

  it('as a user I want to see an error message about incorrect device time, because only I can fix it', async () => {
    jest.spyOn(authService, 'endLogin').mockRejectedValue(new Error('iat is in the future'));

    const { queryByText } = getWrapper();

    await waitFor(() =>
      expect(
        queryByText(
          'Et voi kirjautua sisään koska laitteesi kello on yli 5 minuuttia väärässä. Säädä kelloa ja kokeile uudestaan.',
        ),
      ).toBeInTheDocument(),
    );
  });

  it('as a user I want to be informed when I deny permissions, because the application is unusable due to my choice', async () => {
    jest
      .spyOn(authService, 'endLogin')
      .mockRejectedValue(
        new Error('The resource owner or authorization server denied the request'),
      );

    const { queryByText } = getWrapper();

    await waitFor(() =>
      expect(
        queryByText(
          'Sinun täytyy hyväksyä pyytämämme oikeudet käyttääksesi tätä palvelua. Ole hyvä ja yritä kirjautua uudelleen.',
        ),
      ).toBeInTheDocument(),
    );
  });

  describe('implementation details', () => {
    it('should call authService.endLogin', async () => {
      const authServiceEndLoginSpy = jest
        .spyOn(authService, 'endLogin')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockResolvedValue({} as any);

      getWrapper();

      await waitFor(() => expect(authServiceEndLoginSpy).toHaveBeenCalled());
    });

    it('should redirect user after successful login', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(authService, 'endLogin').mockResolvedValue({} as any);

      getWrapper();

      await waitFor(() => expect(window.location.pathname).toEqual('/'));
    });
  });
});
