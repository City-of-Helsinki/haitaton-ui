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
  test('pagination test', async () => {
    const { container, queryByText, queryAllByText } = render(
      <Provider store={store}>
        <HankeList initialData={initialData} />
      </Provider>
    );

    await waitFor(() => queryByText('Hankelista'));

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
