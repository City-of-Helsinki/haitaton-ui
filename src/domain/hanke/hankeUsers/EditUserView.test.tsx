import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/test-server';
import { fireEvent, render, screen } from '../../../testUtils/render';
import EditUserContainer from './EditUserContainer';
import { waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import { readAll, reset } from '../../mocks/data/users';
import { USER_EDIT_HANKE } from '../../mocks/signedInUser';
import * as hankeUsersApi from './hankeUsersApi';
import { formatToFinnishDate } from '../../../common/utils/date';

function fillUserInformation({
  etunimi,
  sukunimi,
  sahkoposti,
  puhelinnumero,
}: {
  etunimi?: string;
  sukunimi?: string;
  sahkoposti: string;
  puhelinnumero: string;
}) {
  if (etunimi !== undefined) {
    fireEvent.change(screen.getByLabelText(/etunimi/i), {
      target: { value: etunimi },
    });
  }
  if (sukunimi !== undefined) {
    fireEvent.change(screen.getByLabelText(/sukunimi/i), {
      target: { value: sukunimi },
    });
  }
  fireEvent.change(screen.getByLabelText(/sähköposti/i), {
    target: { value: sahkoposti },
  });
  fireEvent.change(screen.getByLabelText(/puhelinnumero/i), {
    target: { value: puhelinnumero },
  });
}

test('Should show correct page title', async () => {
  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa6" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(
    screen.getByRole('heading', { name: 'Käyttäjätietojen muokkaus: Matti Meikäläinen' }),
  ).toBeInTheDocument();
});

test('Should show user role if the user has one in the project', async () => {
  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa6" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(screen.getByText('Rooli hankkeessa:')).toBeInTheDocument();
  expect(screen.getByText('Rakennuttaja, Muu')).toBeInTheDocument();
});

test('Should not show user role if the user has no role in the project', async () => {
  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66af5" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(screen.queryByText('Rooli hankkeessa:')).not.toBeInTheDocument();
  expect(screen.queryByText('Rakennuttaja, Muu')).not.toBeInTheDocument();
});

test('For identified user should show status text of user identified and should not be able to edit name', async () => {
  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa6" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(
    screen.getByText('Käyttäjä on kirjautunut hankkeelle tunnistautuneena'),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Lähetä kutsulinkki uudelleen' }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /etunimi/i })).toHaveAttribute('readonly');
  expect(screen.getByRole('textbox', { name: /sukunimi/i })).toHaveAttribute('readonly');
});

test('Should show status text of invitation send to user and Invitation send button if user is not identified', async () => {
  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa7" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(screen.getByText('Kutsulinkki Haitattomaan lähetetty 15.1.2024')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Lähetä kutsulinkki uudelleen' })).toBeInTheDocument();
});

test('Should update user invitation sent date when resending invitation', async () => {
  const today = new Date().toISOString();
  const { user } = render(
    <EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa7" hankeTunnus="HAI22-2" />,
  );
  await waitForLoadingToFinish();

  await user.click(screen.getByRole('button', { name: 'Lähetä kutsulinkki uudelleen' }));

  expect(
    await screen.findByText(`Kutsulinkki Haitattomaan lähetetty ${formatToFinnishDate(today)}`),
  ).toBeInTheDocument();
});

test('Permissions dropdown should be disabled and delete button should be hidden if only one user is identified and has all rights', async () => {
  const hankeTunnus = 'HAI22-2';
  const users = (await readAll(hankeTunnus)).slice(0, 4);
  server.use(
    http.get('/api/hankkeet/:hankeTunnus/kayttajat', async () => {
      return HttpResponse.json({ kayttajat: users });
    }),
  );

  render(<EditUserContainer id={users[0].id} hankeTunnus={hankeTunnus} />);
  await waitForLoadingToFinish();

  expect(screen.getByRole('button', { name: /käyttöoikeudet/i })).toBeDisabled();
  expect(screen.queryByRole('button', { name: /poista käyttäjä/i })).not.toBeInTheDocument();
});

test('Permissions dropdown should be disabled if editing own information', async () => {
  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa6" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(screen.getByRole('button', { name: /käyttöoikeudet/i })).toBeDisabled();
});

test('Permissions dropdown should be disabled and delete button should be hidden if user does not have enough rights', async () => {
  server.use(
    http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
      return HttpResponse.json(USER_EDIT_HANKE);
    }),
  );

  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa8" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(screen.getByRole('button', { name: /käyttöoikeudet/i })).toBeDisabled();
  expect(screen.queryByRole('button', { name: /poista käyttäjä/i })).not.toBeInTheDocument();
});

test('Should be able to edit own information', async () => {
  const updateSelf = jest.spyOn(hankeUsersApi, 'updateSelf');
  const hankeTunnus = 'HAI22-2';
  const { user } = render(
    <EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa6" hankeTunnus={hankeTunnus} />,
  );
  await waitForLoadingToFinish();
  const sahkoposti = 'matti.meikalainen@test.com';
  const puhelinnumero = '0000000000';
  fillUserInformation({ sahkoposti, puhelinnumero });
  await user.click(screen.getByRole('button', { name: /tallenna muutokset/i }));

  expect(updateSelf).toHaveBeenCalledWith({
    hankeTunnus,
    user: { sahkoposti, puhelinnumero },
  });
  expect(screen.getByText('Käyttäjätiedot päivitetty')).toBeInTheDocument();
  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2/kayttajat');

  updateSelf.mockRestore();
});

test('Should not be able to save changes if form is not valid', async () => {
  const updateSelf = jest.spyOn(hankeUsersApi, 'updateSelf');
  const { user } = render(
    <EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa6" hankeTunnus="HAI22-2" />,
  );
  await waitForLoadingToFinish();
  fillUserInformation({ sahkoposti: 'matti.com', puhelinnumero: '' });
  await user.click(screen.getByRole('button', { name: /tallenna muutokset/i }));

  expect(screen.getByText('Sähköposti on virheellinen')).toBeInTheDocument();
  expect(screen.getByText('Kenttä on pakollinen')).toBeInTheDocument();
  expect(updateSelf).not.toHaveBeenCalled();

  updateSelf.mockRestore();
});

test('Should not be able to save changes if email address is already in use', async () => {
  const updateSelf = jest.spyOn(hankeUsersApi, 'updateSelf');
  const { user } = render(
    <EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa6" hankeTunnus="HAI22-2" />,
  );
  await waitForLoadingToFinish();
  fillUserInformation({ sahkoposti: 'teppo@test.com', puhelinnumero: '123456' });
  await user.click(screen.getByRole('button', { name: /tallenna muutokset/i }));

  expect(
    screen.getByText('Valitsemasi sähköpostiosoite löytyy jo toiselta käyttäjältä.'),
  ).toBeInTheDocument();
  expect(updateSelf).not.toHaveBeenCalled();

  updateSelf.mockRestore();
});

test('Should be able to cancel and return to user management view', async () => {
  const { user } = render(
    <EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa6" hankeTunnus="HAI22-2" />,
  );
  await waitForLoadingToFinish();
  await user.click(screen.getByRole('button', { name: /peruuta/i }));

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2/kayttajat');
});

test('Should show error notification if editing own information fails', async () => {
  server.use(
    http.put('/api/hankkeet/:hankeTunnus/kayttajat/self', async () => {
      return new HttpResponse(null, { status: 500 });
    }),
  );
  const { user } = render(
    <EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa6" hankeTunnus="HAI22-2" />,
  );
  await waitForLoadingToFinish();
  await user.click(screen.getByRole('button', { name: /tallenna muutokset/i }));

  expect(screen.getByText('Virhe päivityksessä')).toBeInTheDocument();
});

test('Should be able to edit users information', async () => {
  const updateUser = jest.spyOn(hankeUsersApi, 'updateHankeUser');
  const updatePermission = jest.spyOn(hankeUsersApi, 'updateHankeUsersPermissions');
  const hankeTunnus = 'HAI22-2';
  const userId = '3fa85f64-5717-4562-b3fc-2c963f66afa7';
  const { user } = render(<EditUserContainer id={userId} hankeTunnus={hankeTunnus} />);
  await waitForLoadingToFinish();
  const etunimi = 'Teppo Tauno';
  const sukunimi = 'Testaaja';
  const sahkoposti = 'teppo.testaaja@test.com';
  const puhelinnumero = '1234567';
  fillUserInformation({ etunimi, sukunimi, sahkoposti, puhelinnumero });
  fireEvent.click(screen.getByRole('button', { name: /käyttöoikeudet/i }));
  fireEvent.click(screen.getAllByText('Kaikki oikeudet')[1]);
  await user.click(screen.getByRole('button', { name: /tallenna muutokset/i }));

  expect(updateUser).toHaveBeenCalledWith({
    hankeTunnus,
    userId,
    user: { etunimi, sukunimi, sahkoposti, puhelinnumero },
  });
  expect(updatePermission).toHaveBeenCalledWith({
    hankeTunnus,
    users: [
      {
        id: userId,
        kayttooikeustaso: 'KAIKKI_OIKEUDET',
      },
    ],
  });
  expect(screen.getByText('Käyttäjätiedot päivitetty')).toBeInTheDocument();
  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2/kayttajat');

  updateUser.mockRestore();
  updatePermission.mockRestore();
});

test('Should show error notification if editing users information fails', async () => {
  server.use(
    http.put('/api/hankkeet/:hankeTunnus/kayttajat/:userId', async () => {
      return new HttpResponse(null, { status: 500 });
    }),
  );
  const { user } = render(
    <EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa7" hankeTunnus="HAI22-2" />,
  );
  await waitForLoadingToFinish();
  await user.click(screen.getByRole('button', { name: /tallenna muutokset/i }));

  expect(screen.getByText('Virhe päivityksessä')).toBeInTheDocument();
});

test('Should show error notification if editing users permission fails', async () => {
  server.use(
    http.put('/api/hankkeet/:hankeTunnus/kayttajat', async () => {
      return new HttpResponse(null, { status: 500 });
    }),
  );
  const { user } = render(
    <EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa7" hankeTunnus="HAI22-2" />,
  );
  await waitForLoadingToFinish();
  fireEvent.click(screen.getByRole('button', { name: /käyttöoikeudet/i }));
  fireEvent.click(screen.getByText('Katseluoikeus'));
  await user.click(screen.getByRole('button', { name: /tallenna muutokset/i }));

  expect(screen.getByText('Virhe päivityksessä')).toBeInTheDocument();
});

test('Should be able to delete user and return to user management page', async () => {
  const { user } = render(
    <EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afb4" hankeTunnus="HAI22-2" />,
  );
  await waitForLoadingToFinish();
  await user.click(screen.getByRole('button', { name: /poista käyttäjä/i }));
  await screen.findByText('Poista käyttäjä hankkeelta');
  await screen.findByRole('button', { name: 'Poista' });
  await user.click(screen.getByRole('button', { name: 'Poista' }));

  expect(location.pathname).toBe('/fi/hankesalkku/HAI22-2/kayttajat');
  expect(screen.getByText('Käyttäjä poistettu')).toBeInTheDocument();

  await reset();
});

test('Should show error notification if user delete info request fails', async () => {
  server.use(
    http.get('/api/kayttajat/:id/deleteInfo', async () => {
      return new HttpResponse(null, { status: 500 });
    }),
  );
  const { user } = render(
    <EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa7" hankeTunnus="HAI22-2" />,
  );
  await waitForLoadingToFinish();
  await user.click(screen.getByRole('button', { name: /poista käyttäjä/i }));

  const errors = await screen.findAllByText(/tapahtui virhe/i);
  expect(errors[0]).toBeInTheDocument();
});

test('Should show error notification if deleting user fails', async () => {
  server.use(
    http.delete('/api/kayttajat/:id', async () => {
      return new HttpResponse(null, { status: 500 });
    }),
  );
  const { user } = render(
    <EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afb6" hankeTunnus="HAI22-2" />,
  );
  await waitForLoadingToFinish();
  await user.click(screen.getByRole('button', { name: /poista käyttäjä/i }));
  await screen.findByText('Poista käyttäjä hankkeelta');
  await screen.findByRole('button', { name: 'Poista' });
  await user.click(screen.getByRole('button', { name: 'Poista' }));

  expect(screen.getByText(/tapahtui virhe/i)).toBeInTheDocument();
});

test('Should not be able to select hanke editing access rights if the feature is not enabled', async () => {
  const OLD_ENV = { ...window._env_ };
  window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_HANKE: '0' };

  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afb4" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  fireEvent.click(screen.getByRole('button', { name: /käyttöoikeudet/i }));

  expect(screen.queryByText('Hankkeen ja hakemusten muokkaus')).not.toBeInTheDocument();
  expect(screen.queryByText('Hankemuokkaus')).not.toBeInTheDocument();

  jest.resetModules();
  window._env_ = OLD_ENV;
});

test('Should be able to select hanke editing access rights if the feature is enabled', async () => {
  const OLD_ENV = { ...window._env_ };
  window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_HANKE: '1' };

  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afb4" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  fireEvent.click(screen.getByRole('button', { name: /käyttöoikeudet/i }));

  expect(screen.queryByText('Hankkeen ja hakemusten muokkaus')).toBeInTheDocument();
  expect(screen.queryByText('Hankemuokkaus')).toBeInTheDocument();

  jest.resetModules();
  window._env_ = OLD_ENV;
});
