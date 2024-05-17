import React from 'react';
import { rest } from 'msw';
import { render, screen, waitFor } from '../../../testUtils/render';
import { server } from '../../mocks/test-server';
import { AccessRightLevel, SignedInUser } from './hankeUser';
import { CheckRightsByHanke, CheckRightsByUser } from './UserRightsCheck';
import { userData } from '../../mocks/signedInUser';

describe('CheckRightsByHanke', () => {
  test('Should render children if user has required right', async () => {
    render(
      <CheckRightsByHanke requiredRight="EDIT" hankeTunnus="HAI22-2">
        <p>Children</p>
      </CheckRightsByHanke>,
    );

    await waitFor(() => {
      expect(screen.getByText('Children')).toBeInTheDocument();
    });
  });

  test('Should not render children if user does not have required right', async () => {
    server.use(
      rest.get('/api/hankkeet/:hankeTunnus/whoami', async (_, res, ctx) => {
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
      <CheckRightsByHanke requiredRight="EDIT" hankeTunnus="HAI22-2">
        <p>Children</p>
      </CheckRightsByHanke>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Children')).not.toBeInTheDocument();
    });
  });
});

describe('CheckRightsByUser', () => {
  const ALL_RIGHTS_USER = userData(AccessRightLevel.KAIKKI_OIKEUDET);
  const VIEW_RIGHT_USER = userData(AccessRightLevel.KATSELUOIKEUS);

  test('Should render children on required right', async () => {
    render(
      <CheckRightsByUser requiredRight="EDIT" signedInUser={ALL_RIGHTS_USER}>
        <p>Children</p>
      </CheckRightsByUser>,
    );

    await waitFor(() => {
      expect(screen.getByText('Children')).toBeInTheDocument();
    });
  });

  test('Should not render children if not enough rights', async () => {
    render(
      <CheckRightsByUser requiredRight="EDIT" signedInUser={VIEW_RIGHT_USER}>
        <p>Children</p>
      </CheckRightsByUser>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Children')).not.toBeInTheDocument();
    });
  });
});
