import React from 'react';
import { rest } from 'msw';
import { render, screen, waitFor } from '../../../testUtils/render';
import { server } from '../../mocks/test-server';
import { SignedInUser } from './hankeUser';
import UserRightsCheck from './UserRightsCheck';

test('Should render children if user has required right', async () => {
  render(
    <UserRightsCheck requiredRight="EDIT" hankeTunnus="HAI22-2">
      <p>Children</p>
    </UserRightsCheck>,
  );

  await waitFor(() => {
    expect(screen.getByText('Children')).toBeInTheDocument();
  });
});

test('Should not render children if user does not have required right', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>({
          hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          kayttooikeustaso: 'KATSELUOIKEUS',
          kayttooikeudet: ['VIEW'],
        }),
      );
    }),
  );

  render(
    <UserRightsCheck requiredRight="EDIT" hankeTunnus="HAI22-2">
      <p>Children</p>
    </UserRightsCheck>,
  );

  await waitFor(() => {
    expect(screen.queryByText('Children')).not.toBeInTheDocument();
  });
});

test('Should render children when access right feature is not enabled', async () => {
  const OLD_ENV = window._env_;
  window._env_.REACT_APP_FEATURE_ACCESS_RIGHTS = 0;

  render(
    <UserRightsCheck requiredRight="EDIT" hankeTunnus="HAI22-2">
      <p>Children</p>
    </UserRightsCheck>,
  );

  await waitFor(() => {
    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  jest.resetModules();
  window._env_ = OLD_ENV;
});
