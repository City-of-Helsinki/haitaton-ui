import { rest } from 'msw';
import { render, screen, waitFor } from '../../../testUtils/render';
import ApplicationViewContainer from './ApplicationViewContainer';
import { waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import { server } from '../../mocks/test-server';
import { SignedInUser } from '../../hanke/hankeUsers/hankeUser';
import * as applicationApi from '../utils';
import hakemukset from '../../mocks/data/hakemukset-data';
import { cloneDeep } from 'lodash';

jest.setTimeout(60000);

test('Correct information about application should be displayed', async () => {
  const { getAllByText, queryByText } = render(<ApplicationViewContainer id={4} />);
  await waitForLoadingToFinish(queryByText);

  expect(getAllByText('Mannerheimintien kairaukset').length).toBe(2);
  expect(queryByText('JS2300003')).toBeInTheDocument();
  expect(queryByText('Odottaa käsittelyä')).toBeInTheDocument();
  expect(queryByText('Kaikki oikeudet')).toBeInTheDocument();
});

test('Link back to related hanke should work', async () => {
  const { user, queryByText, getByRole } = render(<ApplicationViewContainer id={4} />);
  await waitForLoadingToFinish(queryByText);

  await user.click(getByRole('link', { name: 'Mannerheimintien kaukolämpö (HAI22-3)' }));

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-3');
});

test('Should show error notification if application is not found', async () => {
  server.use(
    rest.get('/api/hakemukset/:id', async (_, res, ctx) => {
      return res(ctx.status(404), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const { queryByText, findByText } = render(<ApplicationViewContainer id={4} />);
  await waitForLoadingToFinish(queryByText);

  expect(await findByText('Hakemusta ei löytynyt')).toBeInTheDocument();
});

test('Should show error notification if loading application fails', async () => {
  server.use(
    rest.get('/api/hakemukset/:id', async (_, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const { queryByText, findByText } = render(<ApplicationViewContainer id={4} />);
  await waitForLoadingToFinish(queryByText);

  expect(await findByText('Virhe tietojen lataamisessa.')).toBeInTheDocument();
  expect(await findByText('Yritä hetken päästä uudelleen.')).toBeInTheDocument();
});

test('Should be able to go editing application when editing is possible', async () => {
  const { user, findByRole, getByRole } = render(<ApplicationViewContainer id={1} />);

  await waitFor(() => findByRole('button', { name: 'Muokkaa hakemusta' }), {
    timeout: 10000,
  });
  await user.click(getByRole('button', { name: 'Muokkaa hakemusta' }));

  expect(window.location.pathname).toBe('/fi/johtoselvityshakemus/1/muokkaa');
});

test('Application edit button should not be displayed when editing is not possible', async () => {
  const { queryByText, queryByRole } = render(<ApplicationViewContainer id={2} />);
  await waitForLoadingToFinish(queryByText);

  expect(queryByRole('button', { name: 'Muokkaa hakemusta' })).not.toBeInTheDocument();
});

test('Should be able to cancel application if it is possible', async () => {
  const { user, queryByText, findByRole, getByRole, findByText } = render(
    <ApplicationViewContainer id={4} />,
  );
  await waitForLoadingToFinish(queryByText);

  await waitFor(() => findByRole('button', { name: 'Peru hakemus' }), { timeout: 10000 });
  await user.click(getByRole('button', { name: 'Peru hakemus' }));
  await user.click(getByRole('button', { name: 'Vahvista' }));

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-3');
  await findByText('Hakemus peruttiin onnistuneesti');
  expect(queryByText('Hakemus peruttiin onnistuneesti')).toBeInTheDocument();
});

test('Should not be able to cancel application if it has moved to handling in Allu', async () => {
  const { queryByRole, queryByText } = render(<ApplicationViewContainer id={3} />);
  await waitForLoadingToFinish(queryByText);

  expect(queryByRole('button', { name: 'Peru hakemus' })).not.toBeInTheDocument();
});

test('Should be able to send application if it is not already sent', async () => {
  const hakemus = cloneDeep(hakemukset[0]);
  server.use(
    rest.get(`/api/hakemukset/:id`, async (_, res, ctx) => {
      return res(ctx.status(200), ctx.json(hakemus));
    }),
    rest.post(`/api/hakemukset/:id/laheta`, async (_, res, ctx) => {
      hakemus.alluStatus = 'PENDING';
      return res(ctx.status(200), ctx.json(hakemus));
    }),
  );

  const { user, findByRole, queryByText, getByRole, findByText, getByText, queryByRole } = render(
    <ApplicationViewContainer id={1} />,
  );
  await waitForLoadingToFinish(queryByText);

  await findByRole('button', { name: 'Lähetä hakemus' });
  const sendButton = getByRole('button', { name: 'Lähetä hakemus' });
  expect(sendButton).toBeEnabled();
  await user.click(sendButton);

  await findByText('Hakemus lähetetty');
  expect(getByText('Hakemus lähetetty')).toBeInTheDocument();
  expect(queryByRole('button', { name: 'Lähetä hakemus' })).not.toBeInTheDocument();
});

test('Should not be able to send application if it has moved to handling in Allu', async () => {
  const { queryByText, queryByRole } = render(<ApplicationViewContainer id={3} />);
  await waitForLoadingToFinish(queryByText);

  expect(queryByRole('button', { name: 'Lähetä hakemus' })).not.toBeInTheDocument();
});

test('Should disable Send button if user is not a contact person on application', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>({
          hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afb4',
          kayttooikeustaso: 'HAKEMUSASIOINTI',
          kayttooikeudet: ['EDIT_APPLICATIONS'],
        }),
      );
    }),
  );

  render(<ApplicationViewContainer id={1} />);

  const sendButton = await screen.findByRole('button', { name: 'Lähetä hakemus' });
  expect(sendButton).toBeDisabled();
});

test('Should not show Edit, Cancel or Send buttons if user does not have correct permission', async () => {
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

  const { queryByRole, queryByText } = render(<ApplicationViewContainer id={1} />);

  await waitForLoadingToFinish(queryByText);

  expect(queryByRole('button', { name: 'Muokkaa hakemusta' })).not.toBeInTheDocument();
  expect(queryByRole('button', { name: 'Peru hakemus' })).not.toBeInTheDocument();
  expect(queryByRole('button', { name: 'Lähetä hakemus' })).not.toBeInTheDocument();
});

test('Should not send multiple requests if clicking application cancel confirm button many times', async () => {
  server.use(
    rest.delete('/api/hakemukset/:id', async (_, res, ctx) => {
      return res(ctx.delay(200), ctx.status(200));
    }),
  );

  const cancelApplication = jest.spyOn(applicationApi, 'cancelApplication');
  const { user, findByRole, getByRole, findByText, queryByText } = render(
    <ApplicationViewContainer id={1} />,
  );

  await waitForLoadingToFinish(queryByText);
  await findByRole('button', { name: 'Peru hakemus' });

  await user.click(getByRole('button', { name: 'Peru hakemus' }));
  const confirmCancelButton = getByRole('button', { name: 'Vahvista' });
  await user.click(confirmCancelButton);
  await user.click(confirmCancelButton);
  await findByText('Hakemus peruttiin onnistuneesti');

  expect(cancelApplication).toHaveBeenCalledTimes(1);

  cancelApplication.mockRestore();
});

test('Should not send multiple requests if clicking Send button many times', async () => {
  server.use(
    rest.post('/api/hakemukset/:id/laheta', async (_, res, ctx) => {
      return res(ctx.delay(200), ctx.status(200));
    }),
  );
  const sendApplication = jest.spyOn(applicationApi, 'sendApplication');
  const { user, queryByText, findByRole, findByText } = render(<ApplicationViewContainer id={1} />);
  await waitForLoadingToFinish(queryByText);

  const sendButton = await findByRole('button', { name: 'Lähetä hakemus' });
  await user.click(sendButton);
  await user.click(sendButton);
  await findByText('Hakemus on lähetetty käsiteltäväksi.');

  expect(sendApplication).toHaveBeenCalledTimes(1);

  sendApplication.mockRestore();
});
