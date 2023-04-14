import React from 'react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { render, screen } from '../../../testUtils/render';
import ApplicationViewContainer from './ApplicationViewContainer';
import { waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import { server } from '../../mocks/test-server';

test('Correct information about application should be displayed', async () => {
  render(<ApplicationViewContainer id={4} />);

  await waitForLoadingToFinish();

  expect(screen.getAllByText('Mannerheimintien kairaukset').length).toBe(2);
  expect(screen.queryByText('JS2300003')).toBeInTheDocument();
  expect(screen.queryByText('Odottaa käsittelyä')).toBeInTheDocument();
});

test('Link back to related hanke should work', async () => {
  const user = userEvent.setup();

  render(<ApplicationViewContainer id={4} />);

  await waitForLoadingToFinish();
  await user.click(screen.getByRole('link', { name: 'Mannerheimintien kaukolämpö (HAI22-3)' }));

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-3');
});

test('Should show error notification if application is not found', async () => {
  server.use(
    rest.get('/api/hakemukset/:id', async (req, res, ctx) => {
      return res(ctx.status(404), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    })
  );

  render(<ApplicationViewContainer id={4} />);

  await waitForLoadingToFinish();

  expect(screen.queryByText('Hakemusta ei löytynyt')).toBeInTheDocument();
});

test('Should show error notification if loading application fails', async () => {
  server.use(
    rest.get('/api/hakemukset/:id', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    })
  );

  render(<ApplicationViewContainer id={4} />);

  await waitForLoadingToFinish();

  expect(screen.queryByText('Virhe tietojen lataamisessa.')).toBeInTheDocument();
  expect(screen.queryByText('Yritä hetken päästä uudelleen.')).toBeInTheDocument();
});

test('Should be able to go editing application when editing is possible', async () => {
  const user = userEvent.setup();
  render(<ApplicationViewContainer id={4} />);

  await waitForLoadingToFinish();
  await user.click(screen.getByRole('button', { name: 'Muokkaa hakemusta' }));

  expect(window.location.pathname).toBe('/fi/johtoselvityshakemus/4/muokkaa');
});

test('Application edit button should not be displayed when editing is not possible', async () => {
  render(<ApplicationViewContainer id={3} />);

  await waitForLoadingToFinish();

  expect(screen.queryByRole('button', { name: 'Muokkaa hakemusta' })).not.toBeInTheDocument();
});
