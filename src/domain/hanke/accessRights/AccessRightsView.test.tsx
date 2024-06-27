import { rest } from 'msw';
import { render, cleanup, screen, waitFor, fireEvent } from '../../../testUtils/render';
import { delay, waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import AccessRightsViewContainer from './AccessRightsViewContainer';
import { server } from '../../mocks/test-server';
import usersData from '../../mocks/data/users-data.json';
import { HankeUser, SignedInUser } from '../hankeUsers/hankeUser';
import AccessRightsView from './AccessRightsView';
import { USER_ALL } from '../../mocks/signedInUser';
import { reset } from '../../mocks/data/users';
import { cloneDeep } from 'lodash';

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
  expect(screen.getByTestId('roolit-0')).toHaveTextContent('Rakennuttaja, Muu');
  expect(screen.getAllByText(`${users[1].etunimi} ${users[1].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[1].sahkoposti)).toHaveLength(2);
  expect(screen.getByTestId('roolit-1')).toHaveTextContent('Rakennuttaja');
  expect(screen.getAllByText(`${users[2].etunimi} ${users[2].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[2].sahkoposti)).toHaveLength(2);
  expect(screen.getByTestId('roolit-2')).toHaveTextContent('Muu');
  expect(screen.getAllByText(`${users[3].etunimi} ${users[3].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[3].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[4].etunimi} ${users[4].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[4].sahkoposti)).toHaveLength(2);
  expect(screen.getByTestId('roolit-4')).toHaveTextContent('Omistaja');
  expect(screen.getAllByText(`${users[5].etunimi} ${users[5].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[5].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[6].etunimi} ${users[6].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[6].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[7].etunimi} ${users[7].sukunimi}`)).toHaveLength(2);
  expect(screen.getByTestId('roolit-7')).toHaveTextContent('Rakennuttaja, Toteuttaja');
  expect(screen.getAllByText(users[7].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[8].etunimi} ${users[8].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[8].sahkoposti)).toHaveLength(2);
  expect(screen.getAllByText(`${users[9].etunimi} ${users[9].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[9].sahkoposti)).toHaveLength(2);
  expect(screen.getByTestId('roolit-9')).toHaveTextContent('Rakennuttaja');
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

test('Sorting by users role works', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  fireEvent.click(screen.getByTestId('hds-table-sorting-header-roolit'));

  expect(screen.getByTestId('roolit-0')).toHaveTextContent('');
  expect(screen.getByTestId('roolit-1')).toHaveTextContent('');
  expect(screen.getByTestId('roolit-2')).toHaveTextContent('Muu');
  expect(screen.getByTestId('roolit-3')).toHaveTextContent('Muu');
  expect(screen.getByTestId('roolit-4')).toHaveTextContent('Muu');
  expect(screen.getByTestId('roolit-5')).toHaveTextContent('Muu');
  expect(screen.getByTestId('roolit-6')).toHaveTextContent('Omistaja');
  expect(screen.getByTestId('roolit-7')).toHaveTextContent('Rakennuttaja');
  expect(screen.getByTestId('roolit-8')).toHaveTextContent('Rakennuttaja');
  expect(screen.getByTestId('roolit-9')).toHaveTextContent('Rakennuttaja');

  fireEvent.click(screen.getByTestId('hds-table-sorting-header-roolit'));

  expect(screen.getByTestId('roolit-0')).toHaveTextContent('Toteuttaja');
  expect(screen.getByTestId('roolit-1')).toHaveTextContent('Rakennuttaja, Toteuttaja');
  expect(screen.getByTestId('roolit-2')).toHaveTextContent('Rakennuttaja, Muu');
  expect(screen.getByTestId('roolit-3')).toHaveTextContent('Rakennuttaja');
  expect(screen.getByTestId('roolit-4')).toHaveTextContent('Rakennuttaja');
  expect(screen.getByTestId('roolit-5')).toHaveTextContent('Omistaja');
  expect(screen.getByTestId('roolit-6')).toHaveTextContent('Muu');
  expect(screen.getByTestId('roolit-7')).toHaveTextContent('Muu');
  expect(screen.getByTestId('roolit-8')).toHaveTextContent('Muu');
  expect(screen.getByTestId('roolit-9')).toHaveTextContent('Muu');
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

test('Search by full name works', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  const searchInput = await screen.findByRole('combobox', { name: 'Haku' });
  fireEvent.change(searchInput, {
    target: { value: 'Teppo Työmies' },
  });
  await delay(500);

  let table = (await screen.findByRole('table')) as HTMLTableElement;
  expect(table.tBodies[0].rows).toHaveLength(1);
  const names = await screen.findAllByText(`${users[1].etunimi} ${users[1].sukunimi}`);
  expect(names).toHaveLength(2);

  // Clear the search
  const clearButton = await screen.findByRole('button', { name: 'Clear' });
  await user.click(clearButton);
  await delay(500);

  table = (await screen.findByRole('table')) as HTMLTableElement;
  expect(table.tBodies[0].rows).toHaveLength(10);
});

test('Search by partial text works', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  const searchInput = await screen.findByRole('combobox', { name: 'Haku' });
  fireEvent.change(searchInput, {
    target: { value: 'ak' },
  });
  await delay(500);

  const table = (await screen.findByRole('table')) as HTMLTableElement;
  expect(table.tBodies[0].rows).toHaveLength(2);
  let names = await screen.findAllByText(`${users[2].etunimi} ${users[2].sukunimi}`);
  expect(names).toHaveLength(2);
  names = await screen.findAllByText(`${users[7].etunimi} ${users[7].sukunimi}`);
  expect(names).toHaveLength(2);
});

test('Should show not found text if filtering has no results', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  fireEvent.change(screen.getByRole('combobox', { name: 'Haku' }), {
    target: { value: 'natti' },
  });
  await delay(500);

  await waitFor(() =>
    expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(0),
  );
  expect(screen.getByText('Haulla ei löytynyt yhtään henkilöä')).toBeInTheDocument();
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

  let cell = await screen.findByRole('cell', { name: 'Omat käyttäjätietosi Matti Meikäläinen' });
  expect(cell).toBeInTheDocument();
  cell = await screen.findByRole('cell', {
    name: 'Kirjautunut hankkeelle tunnistautuneena Aku Asiakas',
  });
  expect(cell).toBeInTheDocument();
  cell = await screen.findByRole('cell', { name: 'Kutsulinkki lähetetty 15.1.2024 Teppo Työmies' });
  expect(cell).toBeInTheDocument();
});

test('Should send invitation to user when cliking the Lähetä kutsulinkki uudelleen button', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  const invitationMenus = await screen.findAllByRole('button', {
    name: 'Käyttäjävalikko',
  });
  const invitationMenu = invitationMenus[0];
  await user.click(invitationMenu);
  const invitationButton = await screen.findByRole('menuitem', {
    name: 'Lähetä kutsulinkki uudelleen',
  });
  await user.click(invitationButton);

  const message = await screen.findByText('Kutsulinkki lähetetty osoitteeseen teppo@test.com.');
  expect(message).toBeInTheDocument();

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

  const invitationMenus = await screen.findAllByRole('button', {
    name: 'Käyttäjävalikko',
  });
  const invitationMenu = invitationMenus[0];
  await user.click(invitationMenu);
  const invitationButton = await screen.findByRole('menuitem', {
    name: 'Lähetä kutsulinkki uudelleen',
  });
  await user.click(invitationButton);

  const message = await screen.findByText('Virhe linkin lähettämisessä');
  expect(message).toBeInTheDocument();
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

test('Should not show delete user buttons if user does not have permissions', async () => {
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

  expect(screen.queryAllByRole('img', { name: 'Poista käyttäjä' })).toHaveLength(0);
  expect(screen.queryAllByRole('button', { name: 'Poista käyttäjä' })).toHaveLength(0);
});

test('Should not show delete user button for user who is the only with all permissions', async () => {
  render(
    <AccessRightsView
      hankeTunnus="HAI22-2"
      hankeName="Aidasmäentien vesihuollon rakentaminen"
      hankeUsers={users.slice(0, 2) as HankeUser[]}
      signedInUser={USER_ALL}
    />,
  );

  expect(screen.queryAllByRole('button', { name: 'Poista käyttäjä' })).toHaveLength(2);
});

test('Should not be able to delete user who is the only yhteyshenkilö of the omistaja', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  await user.click(screen.getAllByRole('button', { name: 'Poista käyttäjä' })[3]);

  await screen.findByText('Käyttäjää ei voi poistaa');
  expect(
    screen.getByText(
      'Käyttäjä on hankkeen omistajan ainut yhteyshenkilö eikä käyttäjää voida siksi poistaa',
      { exact: false },
    ),
  ).toBeInTheDocument();
});

test('Should not be able to delete user who has sent hakemuksia', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  await user.click(screen.getAllByRole('button', { name: 'Poista käyttäjä' })[0]);

  await screen.findByText('Käyttäjää ei voi poistaa');
  expect(
    screen.getByText(
      'Käyttäjää ei voida poistaa, sillä hänet on lisätty seuraaville hakemuksille: JS2300001 Odottaa käsittelyä, JS2300002 Käsittelyssä.',
      { exact: false },
    ),
  ).toBeInTheDocument();
});

test('Should not be able to delete user who has sent hakemuksia, which are pending', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  await user.click(screen.getAllByRole('button', { name: 'Poista käyttäjä' })[1]);

  await screen.findByText('Käyttäjää ei voi poistaa');
  expect(
    screen.getByText(
      'Käyttäjää ei voida poistaa, sillä hänet on lisätty seuraaville hakemuksille: JS2300001 Odottaa käsittelyä, JS2300003 Odottaa käsittelyä. Voit perua hakemuksen ja tehdä uuden.',
    ),
  ).toBeInTheDocument();
});

test('Should be able to delete user who has draft hakemuksia, but should notify about it', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  await user.click(screen.getAllByRole('button', { name: 'Poista käyttäjä' })[2]);

  await screen.findByText('Poista käyttäjä hankkeelta');
  expect(
    screen.getByText(
      'Käyttäjä on lisätty luonnos-tilassa oleville hakemuksille: Hakemus 4, Hakemus 5. Käyttäjän poistaminen poistaa hänen tietonsa myös hakemukselta. Tarkista tarvittaessa, että hakemuksen kaikki pakolliset yhteystiedot on täytetty. Haluatko varmasti poistaa käyttäjän?',
    ),
  ).toBeInTheDocument();

  await screen.findByRole('button', { name: 'Poista' });
  await user.click(screen.getByRole('button', { name: 'Poista' }));

  expect(screen.getByText('Käyttäjä poistettu')).toBeInTheDocument();

  await reset();
});

test('User should be able to delete themselves', async () => {
  const hankeUsers = cloneDeep(users).slice(0, 5) as HankeUser[];
  hankeUsers[3].tunnistautunut = true;
  const { user } = render(
    <AccessRightsView
      hankeTunnus="HAI22-2"
      hankeName="Aidasmäentien vesihuollon rakentaminen"
      hankeUsers={hankeUsers}
      signedInUser={{ ...USER_ALL, hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }}
    />,
  );

  await user.click(screen.getAllByRole('button', { name: 'Poista käyttäjä' })[0]);

  await screen.findByText('Poista käyttäjä hankkeelta');
  expect(
    screen.getByText(
      'Käyttäjän yhteystiedot poistetaan kaikista hankkeen rooleista. Haluatko varmasti poistaa käyttäjän?',
    ),
  ).toBeInTheDocument();

  await screen.findByRole('button', { name: 'Poista' });
  await user.click(screen.getByRole('button', { name: 'Poista' }));

  expect(location.pathname).toBe('/fi/hankesalkku');

  await reset();
});
