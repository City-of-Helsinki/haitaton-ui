import React from 'react';
import { rest } from 'msw';
import { render, cleanup, screen, waitFor, fireEvent } from '../../../testUtils/render';
import { waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import AccessRightsViewContainer from './AccessRightsViewContainer';
import { server } from '../../mocks/test-server';
import usersData from '../../mocks/data/users-data.json';
import { SignedInUser } from '../hankeUsers/hankeUser';
import * as hankeUsersApi from '../../hanke/hankeUsers/hankeUsersApi';

jest.setTimeout(50000);

afterEach(cleanup);

function getSignedInUser(options: Partial<SignedInUser> = {}): SignedInUser {
  const {
    hankeKayttajaId = '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    kayttooikeustaso = 'KAIKKI_OIKEUDET',
    kayttooikeudet = [
      'VIEW',
      'MODIFY_VIEW_PERMISSIONS',
      'EDIT',
      'MODIFY_EDIT_PERMISSIONS',
      'DELETE',
      'MODIFY_DELETE_PERMISSIONS',
      'EDIT_APPLICATIONS',
      'MODIFY_APPLICATION_PERMISSIONS',
    ],
  } = options;

  return { hankeKayttajaId, kayttooikeustaso, kayttooikeudet };
}

const users = [...usersData];

test('Renders correct information', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(
    screen.queryByText('Aidasmäentien vesihuollon rakentaminen (HAI22-2)'),
  ).toBeInTheDocument();
  expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(10);
  expect(screen.getAllByText(users[0].nimi)).toHaveLength(2);
  expect(screen.getAllByText(users[0].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(users[1].nimi)).toHaveLength(2);
  expect(screen.getAllByText(users[1].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(users[2].nimi)).toHaveLength(2);
  expect(screen.getAllByText(users[2].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(users[3].nimi)).toHaveLength(2);
  expect(screen.getAllByText(users[3].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(users[4].nimi)).toHaveLength(2);
  expect(screen.getAllByText(users[4].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(users[5].nimi)).toHaveLength(2);
  expect(screen.getAllByText(users[5].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(users[6].nimi)).toHaveLength(2);
  expect(screen.getAllByText(users[6].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(users[7].nimi)).toHaveLength(2);
  expect(screen.getAllByText(users[7].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(users[8].nimi)).toHaveLength(2);
  expect(screen.getAllByText(users[8].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(users[9].nimi)).toHaveLength(2);
  expect(screen.getAllByText(users[9].sahkoposti)).toHaveLength(2);
});

test('Link back to related hanke should work', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  await user.click(
    screen.getByRole('link', { name: 'Aidasmäentien vesihuollon rakentaminen (HAI22-2)' }),
  );

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
});

test('Pagination works', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  fireEvent.click(screen.getByTestId('hds-pagination-next-button'));

  expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(2);
  expect(screen.getAllByText(users[10].nimi)).toHaveLength(2);
  expect(screen.getAllByText(users[10].sahkoposti)).toHaveLength(2);
});

test('Sorting by users name works', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  fireEvent.click(screen.getByTestId('hds-table-sorting-header-nimi'));

  expect(screen.getByTestId('nimi-0')).toHaveTextContent(users[2].nimi);
  expect(screen.getByTestId('nimi-1')).toHaveTextContent(users[9].nimi);
  expect(screen.getByTestId('nimi-2')).toHaveTextContent(users[8].nimi);
  expect(screen.getByTestId('nimi-3')).toHaveTextContent(users[5].nimi);
  expect(screen.getByTestId('nimi-4')).toHaveTextContent(users[0].nimi);
  expect(screen.getByTestId('nimi-5')).toHaveTextContent(users[11].nimi);
  expect(screen.getByTestId('nimi-6')).toHaveTextContent(users[6].nimi);
  expect(screen.getByTestId('nimi-7')).toHaveTextContent(users[7].nimi);
  expect(screen.getByTestId('nimi-8')).toHaveTextContent(users[10].nimi);
  expect(screen.getByTestId('nimi-9')).toHaveTextContent(users[4].nimi);

  fireEvent.click(screen.getByTestId('hds-table-sorting-header-nimi'));

  expect(screen.getByTestId('nimi-0')).toHaveTextContent(users[3].nimi);
  expect(screen.getByTestId('nimi-1')).toHaveTextContent(users[1].nimi);
  expect(screen.getByTestId('nimi-2')).toHaveTextContent(users[4].nimi);
  expect(screen.getByTestId('nimi-3')).toHaveTextContent(users[10].nimi);
  expect(screen.getByTestId('nimi-4')).toHaveTextContent(users[7].nimi);
  expect(screen.getByTestId('nimi-5')).toHaveTextContent(users[6].nimi);
  expect(screen.getByTestId('nimi-6')).toHaveTextContent(users[0].nimi);
  expect(screen.getByTestId('nimi-7')).toHaveTextContent(users[11].nimi);
  expect(screen.getByTestId('nimi-8')).toHaveTextContent(users[5].nimi);
  expect(screen.getByTestId('nimi-9')).toHaveTextContent(users[8].nimi);
});

test('Sorting by users email works', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  fireEvent.click(screen.getByTestId('hds-table-sorting-header-sahkoposti'));

  expect(screen.getByTestId('sahkoposti-0')).toHaveTextContent(users[2].sahkoposti);
  expect(screen.getByTestId('sahkoposti-1')).toHaveTextContent(users[9].sahkoposti);
  expect(screen.getByTestId('sahkoposti-2')).toHaveTextContent(users[8].sahkoposti);
  expect(screen.getByTestId('sahkoposti-3')).toHaveTextContent(users[5].sahkoposti);
  expect(screen.getByTestId('sahkoposti-4')).toHaveTextContent(users[0].sahkoposti);
  expect(screen.getByTestId('sahkoposti-5')).toHaveTextContent(users[11].sahkoposti);
  expect(screen.getByTestId('sahkoposti-6')).toHaveTextContent(users[6].sahkoposti);
  expect(screen.getByTestId('sahkoposti-7')).toHaveTextContent(users[7].sahkoposti);
  expect(screen.getByTestId('sahkoposti-8')).toHaveTextContent(users[10].sahkoposti);
  expect(screen.getByTestId('sahkoposti-9')).toHaveTextContent(users[4].sahkoposti);

  fireEvent.click(screen.getByTestId('hds-table-sorting-header-sahkoposti'));

  expect(screen.getByTestId('sahkoposti-0')).toHaveTextContent(users[3].sahkoposti);
  expect(screen.getByTestId('sahkoposti-1')).toHaveTextContent(users[1].sahkoposti);
  expect(screen.getByTestId('sahkoposti-2')).toHaveTextContent(users[4].sahkoposti);
  expect(screen.getByTestId('sahkoposti-3')).toHaveTextContent(users[10].sahkoposti);
  expect(screen.getByTestId('sahkoposti-4')).toHaveTextContent(users[7].sahkoposti);
  expect(screen.getByTestId('sahkoposti-5')).toHaveTextContent(users[6].sahkoposti);
  expect(screen.getByTestId('sahkoposti-6')).toHaveTextContent(users[11].sahkoposti);
  expect(screen.getByTestId('sahkoposti-7')).toHaveTextContent(users[0].sahkoposti);
  expect(screen.getByTestId('sahkoposti-8')).toHaveTextContent(users[5].sahkoposti);
  expect(screen.getByTestId('sahkoposti-9')).toHaveTextContent(users[8].sahkoposti);
});

test('Filtering works', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  fireEvent.change(screen.getByRole('combobox', { name: 'Haku' }), {
    target: { value: 'Teppo Työmies' },
  });

  await waitFor(() =>
    expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(1),
  );
  expect(screen.getAllByText(users[1].nimi)).toHaveLength(2);

  // Clear the search
  await user.click(screen.getByRole('button', { name: 'Clear' }));
  fireEvent.change(screen.getByRole('combobox', { name: 'Haku' }), {
    target: { value: 'ak' },
  });

  await waitFor(() =>
    expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(2),
  );
  expect(screen.getAllByText(users[2].nimi)).toHaveLength(2);
  expect(screen.getAllByText(users[7].nimi)).toHaveLength(2);
});

test('Should show error notification if information is not found', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/kayttajat', async (req, res, ctx) => {
      return res(ctx.status(404), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(screen.queryByText('Tietoja ei löytynyt')).toBeInTheDocument();
});

test('Should show error notification if there is technical error', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/kayttajat', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(screen.queryByText('Virhe tietojen lataamisessa.')).toBeInTheDocument();
  expect(screen.queryByText('Yritä hetken päästä uudelleen.')).toBeInTheDocument();
});

test('All rights dropdown should be disabled if only one user has all rights', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json<SignedInUser>(getSignedInUser()));
    }),
  );

  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(screen.getByTestId('kayttooikeustaso-0').querySelector('button')).toBeDisabled();
});

test('Should be able to edit rights if user has all rights', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json<SignedInUser>(getSignedInUser()));
    }),
  );

  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  // Save button should be disabled when there are no changes
  expect(screen.getByRole('button', { name: 'Tallenna muutokset' })).toBeDisabled();

  fireEvent.click(screen.getAllByRole('button', { name: 'Hankkeen ja hakemusten muokkaus' })[0]);
  fireEvent.click(screen.getAllByText('Kaikki oikeudet')[2]);

  await user.click(screen.getByRole('button', { name: 'Tallenna muutokset' }));

  expect(screen.queryByText('Käyttöoikeudet päivitetty')).toBeInTheDocument();
  expect(screen.getByTestId('kayttooikeustaso-1')).toHaveTextContent('Kaikki oikeudet');
});

test('Should not be able to edit rights if user does not have enough rights', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>(
          getSignedInUser({ kayttooikeustaso: 'HANKEMUOKKAUS', kayttooikeudet: ['EDIT', 'VIEW'] }),
        ),
      );
    }),
  );

  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(screen.getByTestId('kayttooikeustaso-0').querySelector('button')).toBeDisabled();
  expect(screen.getByTestId('kayttooikeustaso-1').querySelector('button')).toBeDisabled();
  expect(screen.getByTestId('kayttooikeustaso-2').querySelector('button')).toBeDisabled();
  expect(screen.getByTestId('kayttooikeustaso-3').querySelector('button')).toBeDisabled();
  expect(screen.getByTestId('kayttooikeustaso-4').querySelector('button')).toBeDisabled();
  expect(screen.getByTestId('kayttooikeustaso-5').querySelector('button')).toBeDisabled();
  expect(screen.getByTestId('kayttooikeustaso-6').querySelector('button')).toBeDisabled();
  expect(screen.getByTestId('kayttooikeustaso-7').querySelector('button')).toBeDisabled();
  expect(screen.getByTestId('kayttooikeustaso-8').querySelector('button')).toBeDisabled();
  expect(screen.getByTestId('kayttooikeustaso-9').querySelector('button')).toBeDisabled();
});

test('Should not be able to assign all rights if user does not have all rights', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>(getSignedInUser({ kayttooikeustaso: 'KAIKKIEN_MUOKKAUS' })),
      );
    }),
  );

  const { container } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  fireEvent.click(screen.getAllByRole('button', { name: 'Hankemuokkaus' })[0]);

  expect(container.querySelectorAll('li')[5]).toHaveAttribute('disabled');
});

test('Should not be able to remove all rights if user does not have all rights', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>(getSignedInUser({ kayttooikeustaso: 'KAIKKIEN_MUOKKAUS' })),
      );
    }),
  );

  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(screen.getByTestId('kayttooikeustaso-3').querySelector('button')).toBeDisabled();
});

test('Should show Käyttäjä tunnistautunut text for correct users', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(screen.getByTestId('tunnistautunut-0')).toHaveTextContent('Käyttäjä tunnistautunut');
  expect(screen.getByTestId('tunnistautunut-1')).not.toHaveTextContent('Käyttäjä tunnistautunut');
  expect(screen.getByTestId('tunnistautunut-2')).toHaveTextContent('Käyttäjä tunnistautunut');
  expect(screen.getByTestId('tunnistautunut-6')).toHaveTextContent('Käyttäjä tunnistautunut');
  expect(screen.getByTestId('tunnistautunut-7')).toHaveTextContent('Käyttäjä tunnistautunut');
  expect(screen.getByTestId('tunnistautunut-8')).toHaveTextContent('Käyttäjä tunnistautunut');
});

test('Should send invitation to user when cliking the Lähetä kutsulinkki uudelleen button', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  const invitationButton = screen.getAllByRole('button', {
    name: 'Lähetä kutsulinkki uudelleen',
  })[0];
  await user.click(invitationButton);

  await waitFor(() => {
    expect(
      screen.queryByText('Kutsulinkki lähetetty osoitteeseen teppo@test.com.'),
    ).toBeInTheDocument();
  });
  expect(invitationButton).toHaveTextContent('Kutsulinkki lähetetty');
  expect(invitationButton).toBeDisabled();
});

test('Should not send multiple requests when clicking the Lähetä kutsulinkki uudelleen button many times', async () => {
  const sendInvitation = jest.spyOn(hankeUsersApi, 'resendInvitation');
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  const invitationButton = screen.getAllByRole('button', {
    name: 'Lähetä kutsulinkki uudelleen',
  })[0];
  await user.click(invitationButton);
  await user.click(invitationButton);
  await user.click(invitationButton);

  expect(sendInvitation).toHaveBeenCalledTimes(1);

  sendInvitation.mockRestore();
});

test('Should show error notification if sending invitation fails', async () => {
  server.use(
    rest.post('/api/kayttajat/:kayttajaId/kutsu', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  const invitationButton = screen.getAllByRole('button', {
    name: 'Lähetä kutsulinkki uudelleen',
  })[1];
  await user.click(invitationButton);

  expect(screen.queryByText('Virhe linkin lähettämisessä')).toBeInTheDocument();
});

test('Should not show invitation buttons if user does not have permission to send invitation', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>(
          getSignedInUser({ kayttooikeustaso: 'KATSELUOIKEUS', kayttooikeudet: ['VIEW'] }),
        ),
      );
    }),
  );

  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(
    screen.queryAllByRole('button', {
      name: 'Lähetä kutsulinkki uudelleen',
    }),
  ).toHaveLength(0);
});
