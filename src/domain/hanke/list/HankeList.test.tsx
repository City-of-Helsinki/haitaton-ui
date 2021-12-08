import React from 'react';
import { cleanup, waitFor, getByTestId } from '@testing-library/react';
import HankeList from './HankeListComponent';
import { render } from '../../../testUtils/render';
import hankeDraftList from '../../mocks/hankeDraftList';

afterEach(cleanup);

jest.setTimeout(10000);

describe('HankeLista', () => {
  test('Sorting test', async () => {
    const { container, queryByText } = render(<HankeList projectsData={hankeDraftList} />);

    await waitFor(() => queryByText('Hankelista'));
    getByTestId(container, 'tableHeaderButton1').click();
    expect(getByTestId(container, 'row0_cell_name')).toHaveTextContent('Hanke 1');
    getByTestId(container, 'tableHeaderButton2').click();
    expect(getByTestId(container, 'row0_cell_step')).toHaveTextContent('OHJELMOINTI');
    getByTestId(container, 'tableHeaderButton3').click();
    expect(getByTestId(container, 'row0_cell_startDate')).toHaveTextContent('23.11.2020');
    getByTestId(container, 'tableHeaderButton4').click();
    getByTestId(container, 'tableHeaderButton4').click();
    expect(getByTestId(container, 'row0_cell_endDate')).toHaveTextContent('05.12.2020');
  });
  test('pagination test', async () => {
    const { container, queryAllByText } = render(<HankeList projectsData={hankeDraftList} />);

    expect(getByTestId(container, 'amountOfPages')).toHaveTextContent('2');
    getByTestId(container, 'toEnd').click();
    expect(getByTestId(container, 'currentPage')).toHaveTextContent('2');
    getByTestId(container, 'backward').click();
    expect(getByTestId(container, 'currentPage')).toHaveTextContent('1');
    getByTestId(container, 'forward').click();
    expect(getByTestId(container, 'currentPage')).toHaveTextContent('2');
    getByTestId(container, 'toBeginning').click();
    expect(getByTestId(container, 'currentPage')).toHaveTextContent('1');
    getByTestId(container, 'toFormLink').click();
    await waitFor(() => queryAllByText('Hankkeen perustiedot')[1]);
  });
});
