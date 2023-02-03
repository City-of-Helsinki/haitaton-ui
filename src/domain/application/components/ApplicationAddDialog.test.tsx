import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../testUtils/render';
import ApplicationAddDialog from './ApplicationAddDialog';
import hankkeetData from '../../mocks/data/hankkeet-data';
import { HankeData } from '../../types/hanke';

test('Continue to application button should be disabled if application type is not selected', async () => {
  const user = userEvent.setup();
  const hanke = hankkeetData[0] as HankeData;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function handleClose() {}
  render(<ApplicationAddDialog hanke={hanke} isOpen onClose={handleClose} />);

  expect(screen.getByRole('button', { name: /jatka hakemukseen/i })).toBeDisabled();

  await user.click(screen.getByRole('button', { name: /hakemustyyppi/i }));
  await user.click(screen.getByText(/johtoselvitys/i));

  expect(screen.getByRole('button', { name: /jatka hakemukseen/i })).not.toBeDisabled();
});

test('Navigates to cable application correctly', async () => {
  const user = userEvent.setup();
  const hanke = hankkeetData[0] as HankeData;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function handleClose() {}
  render(<ApplicationAddDialog hanke={hanke} isOpen onClose={handleClose} />);

  await user.click(screen.getByRole('button', { name: /hakemustyyppi/i }));
  await user.click(screen.getByText(/johtoselvitys/i));
  await user.click(screen.getByRole('button', { name: /jatka hakemukseen/i }));

  expect(window.location.pathname).toBe('/fi/johtoselvityshakemus');
  expect(window.location.search).toBe('?hanke=HAI22-1');
});
