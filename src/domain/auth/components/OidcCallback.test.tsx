import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { cleanup, waitFor } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '../../../testUtils/render';
import authService from '../authService';
import OidcCallback from './OidcCallback';
import { LOGIN_CALLBACK_PATH } from '../constants';

const getWrapper = () =>
  render(
    <Routes>
      <Route path={LOGIN_CALLBACK_PATH} element={<OidcCallback />} />
    </Routes>,
    {},
    LOGIN_CALLBACK_PATH
  );

describe('<OidcCallback />', () => {
  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it('as a user I want to see an error message about incorrect device time, because only I can fix it', async () => {
    jest.spyOn(authService, 'endLogin').mockRejectedValue(new Error('iat is in the future'));

    const { queryByText } = getWrapper();

    await waitFor(() => expect(queryByText('authentication.deviceTimeError')).toBeInTheDocument());
  });

  it('as a user I want to be informed when I deny permissions, because the application is unusable due to my choice', async () => {
    jest
      .spyOn(authService, 'endLogin')
      .mockRejectedValue(
        new Error('The resource owner or authorization server denied the request')
      );

    const { queryByText } = getWrapper();

    await waitFor(() =>
      expect(queryByText('authentication.permissionRequestDenied')).toBeInTheDocument()
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
