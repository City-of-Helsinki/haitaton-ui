import React from 'react';
import { Provider } from 'react-redux';
import { cleanup, waitFor, getByTestId } from '@testing-library/react';
import { store } from '../../../common/redux/store';
import HankeList from './HankeListComponent';
import { render } from '../../../testUtils/render';
import { initialData } from './testInitialData';

afterEach(cleanup);

jest.setTimeout(10000);

describe('HankeLista', () => {
  test('Sorting test', async () => {
    const { container, queryByText } = render(
      <Provider store={store}>
        <HankeList initialData={initialData} />
      </Provider>
    );

    await waitFor(() => queryByText('Hankelista'));
    getByTestId(container, 'tableHeader0').click();
    expect(getByTestId(container, 'row0_cell_id')).toHaveTextContent('SMTGEN2_1');
    getByTestId(container, 'tableHeader1').click();
    expect(getByTestId(container, 'row0_cell_name')).toHaveTextContent('cc');
    getByTestId(container, 'tableHeader2').click();
    expect(getByTestId(container, 'row0_cell_step')).toHaveTextContent('OHJELMOINTI');
    getByTestId(container, 'tableHeader3').click();
    expect(getByTestId(container, 'row0_cell_startDate')).toHaveTextContent('10.11.2020');
    getByTestId(container, 'tableHeader4').click();
    getByTestId(container, 'tableHeader4').click();
    expect(getByTestId(container, 'row0_cell_endDate')).toHaveTextContent('11.01.2032');
  });
  test('pagination test', async () => {
    const { container, queryAllByText } = render(
      <Provider store={store}>
        <HankeList initialData={initialData} />
      </Provider>
    );

    expect(getByTestId(container, 'amountOfpages')).toHaveTextContent('9');
    getByTestId(container, 'toEnd').click();
    expect(getByTestId(container, 'currentPage')).toHaveTextContent('9');
    getByTestId(container, 'backward').click();
    expect(getByTestId(container, 'currentPage')).toHaveTextContent('8');
    getByTestId(container, 'forward').click();
    expect(getByTestId(container, 'currentPage')).toHaveTextContent('9');
    getByTestId(container, 'toBeginning').click();
    expect(getByTestId(container, 'currentPage')).toHaveTextContent('1');
    getByTestId(container, 'toFormLink').click();
    await waitFor(() => queryAllByText('Hankkeen perustiedot')[1]);
  });
});
