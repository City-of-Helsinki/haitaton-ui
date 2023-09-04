import React from 'react';
import { rest } from 'msw';
import { render, cleanup, screen, waitFor, fireEvent } from '../../../testUtils/render';
import { waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import AccessRightsViewContainer from './AccessRightsViewContainer';
import { server } from '../../mocks/test-server';
import usersData from '../../mocks/data/users-data.json';

afterEach(cleanup);

const users = [...usersData];

test('Renders correct information', async () => {
  render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(
    screen.queryByText('Aidasmäentien vesihuollon rakentaminen (HAI22-2)'),
  ).toBeInTheDocument();
  expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(10);
  expect(screen.getByText(users[0].nimi)).toBeInTheDocument();
  expect(screen.getByText(users[0].sahkoposti)).toBeInTheDocument();
  expect(screen.getByText(users[1].nimi)).toBeInTheDocument();
  expect(screen.getByText(users[1].sahkoposti)).toBeInTheDocument();
  expect(screen.getByText(users[2].nimi)).toBeInTheDocument();
  expect(screen.getByText(users[2].sahkoposti)).toBeInTheDocument();
  expect(screen.getByText(users[3].nimi)).toBeInTheDocument();
  expect(screen.getByText(users[3].sahkoposti)).toBeInTheDocument();
  expect(screen.getByText(users[4].nimi)).toBeInTheDocument();
  expect(screen.getByText(users[4].sahkoposti)).toBeInTheDocument();
  expect(screen.getByText(users[5].nimi)).toBeInTheDocument();
  expect(screen.getByText(users[5].sahkoposti)).toBeInTheDocument();
  expect(screen.getByText(users[6].nimi)).toBeInTheDocument();
  expect(screen.getByText(users[6].sahkoposti)).toBeInTheDocument();
  expect(screen.getByText(users[7].nimi)).toBeInTheDocument();
  expect(screen.getByText(users[7].sahkoposti)).toBeInTheDocument();
  expect(screen.getByText(users[8].nimi)).toBeInTheDocument();
  expect(screen.getByText(users[8].sahkoposti)).toBeInTheDocument();
  expect(screen.getByText(users[9].nimi)).toBeInTheDocument();
  expect(screen.getByText(users[9].sahkoposti)).toBeInTheDocument();
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

  expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(1);
  expect(screen.getByText(users[10].nimi)).toBeInTheDocument();
  expect(screen.getByText(users[10].sahkoposti)).toBeInTheDocument();
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
  expect(screen.getByTestId('nimi-5')).toHaveTextContent(users[6].nimi);
  expect(screen.getByTestId('nimi-6')).toHaveTextContent(users[7].nimi);
  expect(screen.getByTestId('nimi-7')).toHaveTextContent(users[10].nimi);
  expect(screen.getByTestId('nimi-8')).toHaveTextContent(users[4].nimi);
  expect(screen.getByTestId('nimi-9')).toHaveTextContent(users[1].nimi);

  fireEvent.click(screen.getByTestId('hds-table-sorting-header-nimi'));

  expect(screen.getByTestId('nimi-0')).toHaveTextContent(users[3].nimi);
  expect(screen.getByTestId('nimi-1')).toHaveTextContent(users[1].nimi);
  expect(screen.getByTestId('nimi-2')).toHaveTextContent(users[4].nimi);
  expect(screen.getByTestId('nimi-3')).toHaveTextContent(users[10].nimi);
  expect(screen.getByTestId('nimi-4')).toHaveTextContent(users[7].nimi);
  expect(screen.getByTestId('nimi-5')).toHaveTextContent(users[6].nimi);
  expect(screen.getByTestId('nimi-6')).toHaveTextContent(users[0].nimi);
  expect(screen.getByTestId('nimi-7')).toHaveTextContent(users[5].nimi);
  expect(screen.getByTestId('nimi-8')).toHaveTextContent(users[8].nimi);
  expect(screen.getByTestId('nimi-9')).toHaveTextContent(users[9].nimi);
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
  expect(screen.getByTestId('sahkoposti-5')).toHaveTextContent(users[6].sahkoposti);
  expect(screen.getByTestId('sahkoposti-6')).toHaveTextContent(users[7].sahkoposti);
  expect(screen.getByTestId('sahkoposti-7')).toHaveTextContent(users[10].sahkoposti);
  expect(screen.getByTestId('sahkoposti-8')).toHaveTextContent(users[4].sahkoposti);
  expect(screen.getByTestId('sahkoposti-9')).toHaveTextContent(users[1].sahkoposti);

  fireEvent.click(screen.getByTestId('hds-table-sorting-header-sahkoposti'));

  expect(screen.getByTestId('sahkoposti-0')).toHaveTextContent(users[3].sahkoposti);
  expect(screen.getByTestId('sahkoposti-1')).toHaveTextContent(users[1].sahkoposti);
  expect(screen.getByTestId('sahkoposti-2')).toHaveTextContent(users[4].sahkoposti);
  expect(screen.getByTestId('sahkoposti-3')).toHaveTextContent(users[10].sahkoposti);
  expect(screen.getByTestId('sahkoposti-4')).toHaveTextContent(users[7].sahkoposti);
  expect(screen.getByTestId('sahkoposti-5')).toHaveTextContent(users[6].sahkoposti);
  expect(screen.getByTestId('sahkoposti-6')).toHaveTextContent(users[0].sahkoposti);
  expect(screen.getByTestId('sahkoposti-7')).toHaveTextContent(users[5].sahkoposti);
  expect(screen.getByTestId('sahkoposti-8')).toHaveTextContent(users[8].sahkoposti);
  expect(screen.getByTestId('sahkoposti-9')).toHaveTextContent(users[9].sahkoposti);
});

test('Filtering works', async () => {
  const { user } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  await user.type(screen.getByRole('combobox', { name: 'Haku' }), 'Matti Meikäläinen');

  await waitFor(() =>
    expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(1),
  );
  expect(screen.getByText(users[0].nimi)).toBeInTheDocument();

  // Clear the search
  await user.click(screen.getByRole('button', { name: 'Clear' }));
  await user.type(screen.getByRole('combobox', { name: 'Haku' }), 'ak');

  await waitFor(() =>
    expect((screen.getByRole('table') as HTMLTableElement).tBodies[0].rows).toHaveLength(2),
  );
  expect(screen.getByText(users[2].nimi)).toBeInTheDocument();
  expect(screen.getByText(users[7].nimi)).toBeInTheDocument();
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
