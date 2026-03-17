import { http, HttpResponse } from 'msw';
import { render, cleanup, screen, waitFor, fireEvent } from '../../../testUtils/render';
import { waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import AccessRightsViewContainer from './AccessRightsViewContainer';
import { server } from '../../mocks/test-server';
import usersData from '../../mocks/data/users-data.json';
import { HankeUser, SignedInUser } from '../hankeUsers/hankeUser';
import AccessRightsView from './AccessRightsView';
import { USER_ALL } from '../../mocks/signedInUser';
import { reset } from '../../mocks/data/users';
import { cloneDeep } from 'lodash';

afterEach(cleanup);
beforeEach(reset);

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

  // Wait for page 1 to be stable before navigating
  await waitFor(() => {
    expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(10);
  });

  // The "Seuraava" (Next) button is always rendered in the pagination nav
  // regardless of container width. Page number links are width-dependent in HDS.
  fireEvent.click(screen.getByRole('button', { name: /seuraava/i }));

  // autoResetPage: false in the table config ensures the 200ms mount-time
  // debounce does not reset the page back to 1 after we navigate to page 2.
  await waitFor(() => {
    expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(2);
  });
  expect(screen.getAllByText(`${users[10].etunimi} ${users[10].sukunimi}`)).toHaveLength(2);
  expect(screen.getAllByText(users[10].sahkoposti)).toHaveLength(2);
});

test('Sorting by users name works', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  fireEvent.click(screen.getByTestId('hds-table-sorting-header-nimi'));

  const ascendingNames = Array.from(
    { length: 10 },
    (_v, index) => screen.getByTestId(`nimi-${index}`).textContent?.trim() ?? '',
  );
  const ascendingSortedNames = [...ascendingNames].sort((a, b) =>
    a.localeCompare(b, 'fi', { sensitivity: 'base' }),
  );
  expect(ascendingNames).toEqual(ascendingSortedNames);

  fireEvent.click(screen.getByTestId('hds-table-sorting-header-nimi'));

  const descendingNames = Array.from(
    { length: 10 },
    (_v, index) => screen.getByTestId(`nimi-${index}`).textContent?.trim() ?? '',
  );
  const descendingSortedNames = [...descendingNames].sort((a, b) =>
    b.localeCompare(a, 'fi', { sensitivity: 'base' }),
  );
  expect(descendingNames).toEqual(descendingSortedNames);
});

test('Sorting by users role works', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  fireEvent.click(screen.getByTestId('hds-table-sorting-header-roolit'));

  const ascendingRoles = Array.from(
    { length: 10 },
    (_v, index) => screen.getByTestId(`roolit-${index}`).textContent?.trim() ?? '',
  );
  const ascendingSortedRoles = [...ascendingRoles].sort((a, b) =>
    a.localeCompare(b, 'fi', { sensitivity: 'base' }),
  );
  expect(ascendingRoles).toEqual(ascendingSortedRoles);

  fireEvent.click(screen.getByTestId('hds-table-sorting-header-roolit'));

  const descendingRoles = Array.from(
    { length: 10 },
    (_v, index) => screen.getByTestId(`roolit-${index}`).textContent?.trim() ?? '',
  );
  const descendingSortedRoles = [...descendingRoles].sort((a, b) =>
    b.localeCompare(a, 'fi', { sensitivity: 'base' }),
  );
  expect(descendingRoles).toEqual(descendingSortedRoles);
});

test('Sorting by users email works', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  fireEvent.click(screen.getByTestId('hds-table-sorting-header-sahkoposti'));

  const ascendingEmails = Array.from(
    { length: 10 },
    (_v, index) => screen.getByTestId(`sahkoposti-${index}`).textContent?.trim() ?? '',
  );
  const ascendingSortedEmails = [...ascendingEmails].sort((a, b) =>
    a.localeCompare(b, 'fi', { sensitivity: 'base' }),
  );
  expect(ascendingEmails).toEqual(ascendingSortedEmails);

  fireEvent.click(screen.getByTestId('hds-table-sorting-header-sahkoposti'));

  const descendingEmails = Array.from(
    { length: 10 },
    (_v, index) => screen.getByTestId(`sahkoposti-${index}`).textContent?.trim() ?? '',
  );
  const descendingSortedEmails = [...descendingEmails].sort((a, b) =>
    b.localeCompare(a, 'fi', { sensitivity: 'base' }),
  );
  expect(descendingEmails).toEqual(descendingSortedEmails);
});

test('Search by full name works', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  const searchInput = await screen.findByRole('combobox', { name: 'Haku' });
  fireEvent.change(searchInput, {
    target: { value: 'Teppo Työmies' },
  });

  let table = (await screen.findByRole('table')) as HTMLTableElement;
  await waitFor(() => {
    expect(table.querySelectorAll('tbody tr')).toHaveLength(1);
  });
  const names = await screen.findAllByText(`${users[1].etunimi} ${users[1].sukunimi}`);
  expect(names).toHaveLength(2);

  // Clear the search
  const clearButton = await screen.findByRole('button', { name: 'Clear' });
  await user.click(clearButton);

  table = (await screen.findByRole('table')) as HTMLTableElement;
  await waitFor(() => {
    expect(table.querySelectorAll('tbody tr')).toHaveLength(10);
  });
});

test('Search by partial text works', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  const searchInput = await screen.findByRole('combobox', { name: 'Haku' });
  fireEvent.change(searchInput, {
    target: { value: 'ak' },
  });

  const table = (await screen.findByRole('table')) as HTMLTableElement;
  await waitFor(() => {
    expect(table.querySelectorAll('tbody tr')).toHaveLength(2);
  });
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

  const table = (await screen.findByRole('table')) as HTMLTableElement;
  await waitFor(() => {
    expect(table.querySelectorAll('tbody tr')).toHaveLength(0);
  });
  expect(screen.getByText('Haulla ei löytynyt yhtään henkilöä')).toBeInTheDocument();
});

test('Should show error notification if information is not found', async () => {
  server.use(
    http.get('/api/hankkeet/:hankeTunnus/kayttajat', async () => {
      return HttpResponse.json({ errorMessage: 'Failed for testing purposes' }, { status: 404 });
    }),
  );

  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(screen.queryByText('Tietoja ei löytynyt')).toBeInTheDocument();
});

test('Should show error notification if there is technical error', async () => {
  server.use(
    http.get('/api/hankkeet/:hankeTunnus/kayttajat', async () => {
      return HttpResponse.json({ errorMessage: 'Failed for testing purposes' }, { status: 500 });
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
      name: 'Kutsulinkki lähetetty 15.1.2024 Teppo Työmies',
    }),
  ).toBeInTheDocument();
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
    http.post('/api/kayttajat/:kayttajaId/kutsu', async () => {
      return HttpResponse.json({ errorMessage: 'Failed for testing purposes' }, { status: 500 });
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
    http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
      return HttpResponse.json<SignedInUser>(
        getSignedInUser({ kayttooikeustaso: 'KATSELUOIKEUS', kayttooikeudet: ['VIEW'] }),
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
    http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
      return HttpResponse.json<SignedInUser>(
        getSignedInUser({ kayttooikeustaso: 'KATSELUOIKEUS', kayttooikeudet: ['VIEW'] }),
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
    http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
      return HttpResponse.json<SignedInUser>(
        getSignedInUser({ kayttooikeustaso: 'KATSELUOIKEUS', kayttooikeudet: ['VIEW'] }),
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

  await screen.findByRole('button', { name: 'Poista' }, { timeout: 5000 });
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

describe('Completed hanke', () => {
  test('Does not show edit buttons', async () => {
    render(<AccessRightsViewContainer hankeTunnus="HAI22-12" />);
    await waitForLoadingToFinish();

    expect(screen.queryByRole('img', { name: 'Muokkaa tietoja' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Muokkaa tietoja' })).not.toBeInTheDocument();
  });

  test('Does not show delete buttons', async () => {
    render(<AccessRightsViewContainer hankeTunnus="HAI22-12" />);
    await waitForLoadingToFinish();

    expect(screen.queryByRole('img', { name: 'Poista käyttäjä' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Poista käyttäjä' })).not.toBeInTheDocument();
  });

  test('Should show resending invitation button', async () => {
    const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-12" />);
    await waitForLoadingToFinish();

    const invitationMenus = await screen.findAllByRole('button', {
      name: 'Käyttäjävalikko',
    });
    const invitationMenu = invitationMenus[0];
    await user.click(invitationMenu);
    expect(
      await screen.findByRole('menuitem', {
        name: 'Lähetä kutsulinkki uudelleen',
      }),
    ).toBeInTheDocument();
  });
});
