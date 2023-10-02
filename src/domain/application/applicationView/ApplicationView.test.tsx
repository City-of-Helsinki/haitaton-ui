import React from 'react';
import { rest } from 'msw';
import { render, screen, waitFor } from '../../../testUtils/render';
import ApplicationViewContainer from './ApplicationViewContainer';
import { waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import { server } from '../../mocks/test-server';
import { SignedInUser } from '../../hanke/hankeUsers/hankeUser';

test('Correct information about application should be displayed', async () => {
  render(<ApplicationViewContainer id={4} />);

  await waitForLoadingToFinish();

  expect(screen.getAllByText('Mannerheimintien kairaukset').length).toBe(2);
  expect(screen.queryByText('JS2300003')).toBeInTheDocument();
  expect(screen.queryByText('Odottaa käsittelyä')).toBeInTheDocument();
});

test('Link back to related hanke should work', async () => {
  const { user } = render(<ApplicationViewContainer id={4} />);

  await waitForLoadingToFinish();
  await user.click(screen.getByRole('link', { name: 'Mannerheimintien kaukolämpö (HAI22-3)' }));

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-3');
});

test('Should show error notification if application is not found', async () => {
  server.use(
    rest.get('/api/hakemukset/:id', async (req, res, ctx) => {
      return res(ctx.status(404), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  render(<ApplicationViewContainer id={4} />);

  await waitForLoadingToFinish();

  expect(screen.queryByText('Hakemusta ei löytynyt')).toBeInTheDocument();
});

test('Should show error notification if loading application fails', async () => {
  server.use(
    rest.get('/api/hakemukset/:id', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  render(<ApplicationViewContainer id={4} />);

  await waitForLoadingToFinish();

  expect(screen.queryByText('Virhe tietojen lataamisessa.')).toBeInTheDocument();
  expect(screen.queryByText('Yritä hetken päästä uudelleen.')).toBeInTheDocument();
});

test('Should be able to go editing application when editing is possible', async () => {
  const { user } = render(<ApplicationViewContainer id={4} />);

  await waitFor(() => screen.findByRole('button', { name: 'Muokkaa hakemusta' }));
  await user.click(screen.getByRole('button', { name: 'Muokkaa hakemusta' }));

  expect(window.location.pathname).toBe('/fi/johtoselvityshakemus/4/muokkaa');
});

test('Application edit button should not be displayed when editing is not possible', async () => {
  render(<ApplicationViewContainer id={3} />);

  await waitForLoadingToFinish();

  expect(screen.queryByRole('button', { name: 'Muokkaa hakemusta' })).not.toBeInTheDocument();
});

test('Should be able to cancel application if it is possible', async () => {
  const { user } = render(<ApplicationViewContainer id={4} />);

  await waitFor(() => screen.findByRole('button', { name: 'Peru hakemus' }));
  await user.click(screen.getByRole('button', { name: 'Peru hakemus' }));
  await user.click(screen.getByRole('button', { name: 'Vahvista' }));

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-3');
  await screen.findByText('Hakemus peruttiin onnistuneesti');
  expect(screen.queryByText('Hakemus peruttiin onnistuneesti')).toBeInTheDocument();
});

test('Should not be able to cancel application if it has moved to handling in Allu', async () => {
  render(<ApplicationViewContainer id={3} />);

  await waitForLoadingToFinish();

  expect(screen.queryByRole('button', { name: 'Peru hakemus' })).not.toBeInTheDocument();
});

test('Should not show Edit application and Cancel application buttons if user does not have EDIT_APPLICATIONS permission', async () => {
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

  render(<ApplicationViewContainer id={4} />);

  await waitForLoadingToFinish();

  expect(screen.queryByRole('button', { name: 'Muokkaa hakemusta' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Peru hakemus' })).not.toBeInTheDocument();
});
