import { rest } from 'msw';
import { server } from '../../mocks/test-server';
import { render, screen } from '../../../testUtils/render';
import EditUserContainer from './EditUserContainer';
import { waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import { readAll } from '../../mocks/data/users';
import { USER_EDIT_HANKE } from '../../mocks/signedInUser';

test('Should show correct page title', async () => {
  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa6" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(
    screen.getByRole('heading', { name: 'Käyttäjätietojen muokkaus: Matti Meikäläinen' }),
  ).toBeInTheDocument();
});

test('Should show status text of user identified if user is identified', async () => {
  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa6" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(
    screen.getByText('Käyttäjä on kirjautunut hankkeelle tunnistautuneena'),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Lähetä kutsulinkki uudelleen' }),
  ).not.toBeInTheDocument();
});

test('Should show status text of invitation send to user and Invitation send button if user is not identified', async () => {
  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa7" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(screen.getByText('Kutsulinkki Haitattomaan lähetetty')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Lähetä kutsulinkki uudelleen' })).toBeInTheDocument();
});

test('Permissions dropdown should be disabled if only one user has all rights', async () => {
  const hankeTunnus = 'HAI22-2';
  const users = (await readAll(hankeTunnus)).slice(1, 4);
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/kayttajat', async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ kayttajat: users }));
    }),
  );

  render(<EditUserContainer id={users[2].id} hankeTunnus={hankeTunnus} />);
  await waitForLoadingToFinish();

  expect(screen.getByRole('button', { name: 'Käyttöoikeudet' })).toBeDisabled();
});

test('Permissions dropdown should be disabled if editing own information', async () => {
  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa6" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(screen.getByRole('button', { name: 'Käyttöoikeudet' })).toBeDisabled();
});

test('Permissions dropdown should be disabled if user does not have enough rights', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(USER_EDIT_HANKE));
    }),
  );

  render(<EditUserContainer id="3fa85f64-5717-4562-b3fc-2c963f66afa8" hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(screen.getByRole('button', { name: 'Käyttöoikeudet' })).toBeDisabled();
});
