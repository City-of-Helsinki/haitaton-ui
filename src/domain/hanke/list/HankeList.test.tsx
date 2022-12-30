import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, cleanup, screen } from '../../../testUtils/render';
import HankeList from './HankeListComponent';
import hankeDraftList from '../../mocks/hankeDraftList';

afterEach(cleanup);

jest.setTimeout(10000);

describe('HankeLista', () => {
  test('Sorting test', async () => {
    render(<HankeList projectsData={hankeDraftList} />);

    const user = userEvent.setup();

    await user.click(screen.getByTestId('hds-table-sorting-header-nimi'));
    expect(screen.getByTestId('nimi-0')).toHaveTextContent('Hanke 1');
    await user.click(screen.getByTestId('hds-table-sorting-header-vaihe'));
    expect(screen.getByTestId('vaihe-0')).toHaveTextContent(/ohjelmointi/i);
    await user.click(screen.getByTestId('hds-table-sorting-header-vaihe'));
    expect(screen.getByTestId('vaihe-0')).toHaveTextContent(/suunnittelu/i);
    expect(screen.getByTestId('vaihe-2')).toHaveTextContent(/rakentaminen/i);
    await user.click(screen.getByTestId('hds-table-sorting-header-alkuPvm'));
    expect(screen.getByTestId('alkuPvm-0')).toHaveTextContent('23.11.2020');
    await user.click(screen.getByTestId('hds-table-sorting-header-loppuPvm'));
    await user.click(screen.getByTestId('hds-table-sorting-header-loppuPvm'));
    expect(screen.getByTestId('loppuPvm-0')).toHaveTextContent('05.12.2020');
  });

  test('pagination test', async () => {
    render(<HankeList projectsData={hankeDraftList} />);

    const user = userEvent.setup();

    expect(screen.getByTestId('hds-pagination-page-1')).toHaveTextContent('1');
    expect(screen.getByTestId('hds-pagination-page-2')).toHaveTextContent('2');

    expect(screen.getByTestId('hds-pagination-previous-button')).toBeDisabled();
    expect(screen.getByText('Hanke 1')).toBeInTheDocument();
    expect(screen.getByText('Hanke 2')).toBeInTheDocument();
    expect(screen.getByText('Hanke 3')).toBeInTheDocument();
    expect(screen.getByText('Hanke 4')).toBeInTheDocument();
    expect(screen.getByText('Hanke 5')).toBeInTheDocument();
    expect(screen.getByText('Hanke 6')).toBeInTheDocument();
    expect(screen.getByText('Hanke 7')).toBeInTheDocument();
    expect(screen.getByText('Hanke 8')).toBeInTheDocument();

    await user.click(screen.getByTestId('hds-pagination-next-button'));

    expect(screen.getByText('Hanke 9')).toBeInTheDocument();
    expect(screen.getByText('Hanke 10')).toBeInTheDocument();
    expect(screen.getByText('Hanke 11')).toBeInTheDocument();
    expect(screen.getByTestId('hds-pagination-next-button')).toBeDisabled();
  });

  test('renders link to hanke in map when there is geometry data', () => {
    render(<HankeList projectsData={hankeDraftList} />);

    expect(screen.getByRole('link', { name: 'HANKE_2' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'HANKE_1' })).not.toBeInTheDocument();
  });
});
