import { render, screen } from '../../../testUtils/render';
import ApplicationAddDialog from './ApplicationAddDialog';
import hankkeetData from '../../mocks/data/hankkeet-data';
import { HankeData } from '../../types/hanke';
import { waitFor } from '@testing-library/react';

jest.setTimeout(10000);

test('Continue to application button should be disabled if application type is not selected', async () => {
  const hanke = hankkeetData[0] as HankeData;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function handleClose() {}
  const { user } = render(<ApplicationAddDialog hanke={hanke} isOpen onClose={handleClose} />);

  await waitFor(() => expect(screen.getByRole('button', { name: /luo hakemus/i })).toBeDisabled());

  await user.click(screen.getByRole('button', { name: /hakemustyyppi/i }));
  await user.click(screen.getByText(/johtoselvitys/i));

  await waitFor(() =>
    expect(screen.getByRole('button', { name: /luo hakemus/i })).not.toBeDisabled(),
  );
});

test('Navigates to cable application correctly', async () => {
  const hanke = hankkeetData[0] as HankeData;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function handleClose() {}
  const { user } = render(<ApplicationAddDialog hanke={hanke} isOpen onClose={handleClose} />);

  await user.click(screen.getByRole('button', { name: /hakemustyyppi/i }));
  await user.click(screen.getByText(/johtoselvitys/i));
  await user.click(screen.getByRole('button', { name: /luo hakemus/i }));

  await waitFor(() => expect(window.location.pathname).toBe('/fi/johtoselvityshakemus'));
  await waitFor(() => expect(window.location.search).toBe('?hanke=HAI22-1'));
});
