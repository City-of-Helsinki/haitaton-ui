import React from 'react';
import AppRoutes from '../../common/routes/AppRoutes';
import { render, screen } from '../../testUtils/render';

test('Should show 404 page with nonexistent url', async () => {
  render(<AppRoutes />, undefined, '/fi/foo');

  await screen.findByText('Sivua ei löytynyt');

  expect(screen.queryByText('Sivua ei löytynyt')).toBeInTheDocument();
  expect(
    screen.queryByText(
      'Jos kirjoitit sivun osoitteen osoitepalkkiin, tarkista että se on kirjoitettu oikein.',
    ),
  ).toBeInTheDocument();
});
