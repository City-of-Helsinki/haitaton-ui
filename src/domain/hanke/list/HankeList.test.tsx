import React from 'react';
import { Provider } from 'react-redux';
import { cleanup, waitFor } from '@testing-library/react';
import { store } from '../../../common/redux/store';
import HankeList from './HankeList';
import { render } from '../../../testUtils/render';

afterEach(cleanup);

jest.setTimeout(10000);

describe('HankeLista', () => {
  test('happypath', async () => {
    const { getByTestId, queryByText, queryAllByText } = render(
      <Provider store={store}>
        <HankeList />
      </Provider>
    );

    await waitFor(() => queryByText('Hankkeen yhteystiedot'));
    getByTestId('toFormLink').click();
    await waitFor(() => queryAllByText('Hankkeen perustiedot')[1]);
  });
});
