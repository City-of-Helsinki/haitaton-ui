import { rest } from 'msw';
import { render, cleanup, screen, waitFor, fireEvent } from '../../../testUtils/render';
import { waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import AccessRightsViewContainer from './AccessRightsViewContainer';
import { server } from '../../mocks/test-server';
import usersData from '../../mocks/data/users-data.json';
import { SignedInUser } from '../hankeUsers/hankeUser';

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
      'MODIFY_USER',
    ],
  } = options;

  return { hankeKayttajaId, kayttooikeustaso, kayttooikeudet };
}

const users = [...usersData];

test('Renders correct information', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(
    screen.getByRole('link', { name: 'Aidasmäentien vesihuollon rakentaminen (HAI22-2)' }),
  ).toBeInTheDocument();
  expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(10);
  expect(screen.getAllByText(`${users[0].etunimi} ${users[0].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[0].sahkoposti)).toHaveLength(2);
  expect(screen.getByTestId('puhelinnumero-0')).toHaveTextContent('0401234567');
  expect(screen.getAllByText(`${users[1].etunimi} ${users[1].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[1].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[2].etunimi} ${users[2].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[2].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[3].etunimi} ${users[3].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[3].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[4].etunimi} ${users[4].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[4].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[5].etunimi} ${users[5].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[5].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[6].etunimi} ${users[6].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[6].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[7].etunimi} ${users[7].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[7].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[8].etunimi} ${users[8].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[8].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[9].etunimi} ${users[9].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[9].sahkoposti)).toHaveLength(2);
});

test('Pagination works', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  fireEvent.click(screen.getByTestId('hds-pagination-next-button'));

  expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(2);
  expect(screen.getAllByText(`${users[10].etunimi} ${users[10].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[10].sahkoposti)).toHaveLength(2);
});

test('Sorting by users name works', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  fireEvent.click(screen.getByTestId('hds-table-sorting-header-nimi'));

  expect(screen.getByTestId('nimi-0')).toHaveTextContent(users[2].etunimi);
  expect(screen.getByTestId('nimi-1')).toHaveTextContent(users[9].etunimi);
  expect(screen.getByTestId('nimi-2')).toHaveTextContent(users[8].etunimi);
  expect(screen.getByTestId('nimi-3')).toHaveTextContent(users[5].etunimi);
  expect(screen.getByTestId('nimi-4')).toHaveTextContent(users[0].etunimi);
  expect(screen.getByTestId('nimi-5')).toHaveTextContent(users[11].etunimi);
  expect(screen.getByTestId('nimi-6')).toHaveTextContent(users[6].etunimi);
  expect(screen.getByTestId('nimi-7')).toHaveTextContent(users[7].etunimi);
  expect(screen.getByTestId('nimi-8')).toHaveTextContent(users[10].etunimi);
  expect(screen.getByTestId('nimi-9')).toHaveTextContent(users[4].etunimi);

  fireEvent.click(screen.getByTestId('hds-table-sorting-header-nimi'));

  expect(screen.getByTestId('nimi-0')).toHaveTextContent(users[3].etunimi);
  expect(screen.getByTestId('nimi-1')).toHaveTextContent(users[1].etunimi);
  expect(screen.getByTestId('nimi-2')).toHaveTextContent(users[4].etunimi);
  expect(screen.getByTestId('nimi-3')).toHaveTextContent(users[10].etunimi);
  expect(screen.getByTestId('nimi-4')).toHaveTextContent(users[7].etunimi);
  expect(screen.getByTestId('nimi-5')).toHaveTextContent(users[6].etunimi);
  expect(screen.getByTestId('nimi-6')).toHaveTextContent(users[0].etunimi);
  expect(screen.getByTestId('nimi-7')).toHaveTextContent(users[11].etunimi);
  expect(screen.getByTestId('nimi-8')).toHaveTextContent(users[5].etunimi);
  expect(screen.getByTestId('nimi-9')).toHaveTextContent(users[8].etunimi);
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
  expect(screen.getAllByText(`${users[1].etunimi} ${users[1].sukunimi}`)).toHaveLength(2);

  // Clear the search
  await user.click(screen.getByRole('button', { name: 'Clear' }));
  fireEvent.change(screen.getByRole('combobox', { name: 'Haku' }), {
    target: { value: 'ak' },
  });

  await waitFor(() =>
    expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(2),
  );
  expect(screen.getAllByText(`${users[2].etunimi} ${users[2].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(`${users[7].etunimi} ${users[7].sukunimi}`)).toHaveLength(2);
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

test('Should show correct icons for users', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(
    screen.getByRole('cell', {
      name: 'Omat käyttäjätietosi Matti Meikäläinen',
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('cell', {
      name: 'Kirjautunut hankkeelle tunnistautuneena Aku Asiakas',
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('cell', {
      name: 'Kutsulinkki lähetetty Teppo Työmies',
    }),
  ).toBeInTheDocument();
});

test('Should send invitation to user when cliking the Lähetä kutsulinkki uudelleen button', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  const invitationMenu = screen.getAllByRole('button', {
    name: 'Käyttäjävalikko',
  })[0];
  await user.click(invitationMenu);
  const invitationButton = screen.getByRole('menuitem', {
    name: 'Lähetä kutsulinkki uudelleen',
  });
  await user.click(invitationButton);

  await waitFor(() => {
    expect(
      screen.queryByText('Kutsulinkki lähetetty osoitteeseen teppo@test.com.'),
    ).toBeInTheDocument();
  });
  await user.click(invitationMenu);
  expect(invitationButton).toBeDisabled();
});

test('Should show error notification if sending invitation fails', async () => {
  server.use(
    rest.post('/api/kayttajat/:kayttajaId/kutsu', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  const invitationMenu = screen.getAllByRole('button', {
    name: 'Käyttäjävalikko',
  })[0];
  await user.click(invitationMenu);
  await user.click(
    screen.getByRole('menuitem', {
      name: 'Lähetä kutsulinkki uudelleen',
    }),
  );

  expect(screen.queryByText('Virhe linkin lähettämisessä')).toBeInTheDocument();
});

test('Should not show invitation menus if user does not have permission to send invitation', async () => {
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
    screen.queryAllByRole('cell', {
      name: 'Käyttäjävalikko',
    }),
  ).toHaveLength(0);
});

test('Should navigate to edit user view when clicking edit link', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  await user.click(screen.getAllByRole('img', { name: 'Muokkaa tietoja' })[1]);

  expect(window.location.pathname).toBe(
    '/fi/hankesalkku/HAI22-2/kayttajat/3fa85f64-5717-4562-b3fc-2c963f66afa7',
  );
});

test('Should navigate to edit user view when clicking edit button in user card', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  await user.click(screen.getAllByRole('button', { name: 'Muokkaa tietoja' })[1]);

  expect(window.location.pathname).toBe(
    '/fi/hankesalkku/HAI22-2/kayttajat/3fa85f64-5717-4562-b3fc-2c963f66afa7',
  );
});

test('Should show edit links or buttons only for self if user does not have edit permission', async () => {
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

  expect(screen.getAllByRole('img', { name: 'Muokkaa tietoja' })).toHaveLength(1);
  expect(screen.getAllByRole('button', { name: 'Muokkaa tietoja' })).toHaveLength(1);
});
