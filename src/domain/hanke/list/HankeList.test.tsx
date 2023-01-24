import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, cleanup, screen, waitFor } from '../../../testUtils/render';
import HankeListContainer from './HankeListContainer';

afterEach(cleanup);

jest.setTimeout(10000);

function waitForData() {
  return waitFor(() => screen.getByTestId('hds-table-sorting-header-nimi'));
}

describe('HankeLista', () => {
  test('Sorting test', async () => {
    render(<HankeListContainer />);

    const user = userEvent.setup();

    await waitForData();

    await user.click(screen.getByTestId('hds-table-sorting-header-nimi'));
    expect(screen.getByTestId('nimi-0')).toHaveTextContent(
      'Aidasmäentien vesihuollon rakentaminen'
    );
    await user.click(screen.getByTestId('hds-table-sorting-header-vaihe'));
    expect(screen.getByTestId('vaihe-0')).toHaveTextContent(/ohjelmointi/i);
    await user.click(screen.getByTestId('hds-table-sorting-header-vaihe'));
    expect(screen.getByTestId('vaihe-0')).toHaveTextContent(/suunnittelu/i);
    expect(screen.getByTestId('vaihe-2')).toHaveTextContent(/rakentaminen/i);
    await user.click(screen.getByTestId('hds-table-sorting-header-alkuPvm'));
    expect(screen.getByTestId('alkuPvm-0')).toHaveTextContent('23.11.2022');
    await user.click(screen.getByTestId('hds-table-sorting-header-loppuPvm'));
    await user.click(screen.getByTestId('hds-table-sorting-header-loppuPvm'));
    expect(screen.getByTestId('loppuPvm-0')).toHaveTextContent('27.11.2024');
  });

  test('pagination test', async () => {
    render(<HankeListContainer />);

    const user = userEvent.setup();

    await waitForData();

    expect(screen.getByTestId('hds-pagination-page-1')).toHaveTextContent('1');
    expect(screen.getByTestId('hds-pagination-page-2')).toHaveTextContent('2');

    expect(screen.getByTestId('hds-pagination-previous-button')).toBeDisabled();
    expect(screen.getByText('Mannerheimintien katutyöt')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien vesihuollon rakentaminen')).toBeInTheDocument();
    expect(screen.getByText('Mannerheimintien kaukolämpö')).toBeInTheDocument();
    expect(screen.getByText('Pohjoisesplanadin valojen uusiminen')).toBeInTheDocument();
    expect(screen.getByText('Erottajan tietyöt')).toBeInTheDocument();
    expect(screen.getByText('Tähtitorninkadun tietoliikenneyhteydet')).toBeInTheDocument();
    expect(screen.getByText('Puistokadun korjaukset')).toBeInTheDocument();
    expect(screen.getByText('Eiranrannan asfaltointi')).toBeInTheDocument();

    await user.click(screen.getByTestId('hds-pagination-next-button'));

    expect(screen.getByText('Sillilaiturin korjaus')).toBeInTheDocument();
    expect(screen.getByText('Santakadun ehostaminen')).toBeInTheDocument();
    expect(screen.getByText('Kuvitteellinen hanke')).toBeInTheDocument();
    expect(screen.getByTestId('hds-pagination-next-button')).toBeDisabled();
  });

  test('renders link to hanke in map when there is geometry data', async () => {
    render(<HankeListContainer />);

    await waitForData();

    expect(screen.getByRole('link', { name: 'HAI22-2' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'HAI22-1' })).not.toBeInTheDocument();
  });
});
