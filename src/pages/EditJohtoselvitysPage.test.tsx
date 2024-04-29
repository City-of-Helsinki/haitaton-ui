import { Route, Routes } from 'react-router-dom';
import { render, screen } from '../testUtils/render';
import EditJohtoselvitysPage from './EditJohtoselvitysPage';

test('Should show dialog with button to navigate to application view when navigating to johtoselvitys that has been sent', async () => {
  const { user } = render(
    <Routes>
      <Route path="/fi/johtoselvityshakemus/:id/muokkaa" element={<EditJohtoselvitysPage />} />
    </Routes>,
    undefined,
    '/fi/johtoselvityshakemus/2/muokkaa',
  );

  await screen.findByText(/hakemus lähetetty/i);
  await user.click(screen.getByText('Siirry hakemussivulle'));

  expect(window.location.pathname).toBe('/fi/hakemus/2');
});

test('Should not show dialog with button to navigate to application view when editing johtoselvitys that has not been sent', () => {
  render(
    <Routes>
      <Route path="/fi/johtoselvityshakemus/:id/muokkaa" element={<EditJohtoselvitysPage />} />
    </Routes>,
    undefined,
    '/fi/johtoselvityshakemus/1/muokkaa',
  );

  expect(screen.queryByText(/hakemus lähetetty/i)).not.toBeInTheDocument();
});
