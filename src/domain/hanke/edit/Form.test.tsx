import React from 'react';

import { Provider } from 'react-redux';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import { store } from '../../../common/components/app/store';
import { combineObj } from './utils';
import { HANKE_VAIHE, FORMFIELD } from './types';
import Form from './Form';
import { render } from '../../../testUtils/render';

afterEach(cleanup);

describe('Form', () => {
  const obj1 = { [FORMFIELD.YKT_HANKE]: true };
  const obj2 = { [FORMFIELD.VAIHE]: HANKE_VAIHE.OHJELMOINTI };
  const result = {
    [FORMFIELD.YKT_HANKE]: true,
    [FORMFIELD.TUNNUS]: '',
    [FORMFIELD.VAIHE]: HANKE_VAIHE.OHJELMOINTI,
    [FORMFIELD.NIMI]: '',
  };
  test('Combain Objects', () => {
    expect(combineObj(obj1, obj2)).toEqual(result);
  });
  test('Form testing', async () => {
    const { getByTestId, getByLabelText, getByText, queryAllByText } = render(
      <Provider store={store}>
        <Form />
      </Provider>
    );
    getByTestId(FORMFIELD.YKT_HANKE).click();
    fireEvent.change(getByTestId(FORMFIELD.NIMI), { target: { value: '23' } });
    fireEvent.change(getByLabelText('Hankkeen alkupäivä'), { target: { value: '24.03.2032' } });
    fireEvent.change(getByLabelText('Hankkeen loppupäivä'), { target: { value: '25.03.2032' } });

    getByText('Hankeen Vaihe').click();
    getByText('Ohjelmointi').click();
    // queryAllByText('Hankkeen alue')[1].click(); // changes view to Hankkeen Alue
    getByTestId('forward').click();

    await waitFor(() => queryAllByText('Hankkeen yhteystiedot')[1]);
    getByTestId('forward').click();

    //  => getByText('Hankeen alue').click());

    // await waitFor(() => expect(document.title).toEqual(''));
    /*
    await waitFor(() =>
      fireEvent.change(getByLabelText('Sukunimi'), { target: { value: 'Meikäläinen' } })
    ); */
    // fireEvent.change(getByLabelText('Etunimi'), { target: { value: 'Matti' } });
  });
});
