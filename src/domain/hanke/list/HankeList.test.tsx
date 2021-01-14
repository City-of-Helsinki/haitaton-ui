import React from 'react';
import { Provider } from 'react-redux';
import { cleanup, waitFor, getByTestId } from '@testing-library/react';
import { store } from '../../../common/redux/store';
import HankeList from './HankeList';
import { render } from '../../../testUtils/render';
import dummyJson from './testDummyJson';

afterEach(cleanup);

jest.setTimeout(10000);

describe('HankeLista', () => {
  test('pagination test', async () => {
    const { container, queryByText, queryAllByText } = render(
      <Provider store={store}>
        <HankeList fakeData={dummyJson} />
      </Provider>
    );

    await waitFor(() => queryByText('Hankkelista'));

    expect(getByTestId(container, 'amountOfpages')).toHaveTextContent('9');
    getByTestId(container, 'toEnd').click();
    expect(getByTestId(container, 'currentPage')).toHaveTextContent('9');
    getByTestId(container, 'backward').click();
    expect(getByTestId(container, 'currentPage')).toHaveTextContent('8');
    getByTestId(container, 'forward').click();
    expect(getByTestId(container, 'currentPage')).toHaveTextContent('9');
    getByTestId(container, 'toBegining').click();
    expect(getByTestId(container, 'currentPage')).toHaveTextContent('1');
    getByTestId(container, 'toFormLink').click();
    await waitFor(() => queryAllByText('Hankkeen perustiedot')[1]);
  });
});
