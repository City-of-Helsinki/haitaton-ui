import React from 'react';

import { Provider } from 'react-redux';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import { store } from '../../../common/components/app/store';
import { FORMFIELD } from './types';
import Form from './Form';
import { render } from '../../../testUtils/render';

afterEach(cleanup);
jest.setTimeout(25000);
describe('Form', () => {
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
    getByTestId('forward').click(); // changes view to Hankkeen Alue

    await waitFor(() => queryAllByText('Hankkeen yhteystiedot')[1]);
    getByTestId('forward').click(); // changes view to Hankkeen yhteystiedot

    fireEvent.change(getByTestId('omistajat-etunimi'), {
      target: { value: 'Matti' },
    });
    fireEvent.change(getByTestId('omistajat-sukunimi'), {
      target: { value: 'Meikäläinen' },
    });
    fireEvent.change(getByTestId('omistajat-email'), {
      target: { value: 'test@test.fi' },
    });
    fireEvent.change(getByTestId('omistajat-puhelinnumero'), {
      target: { value: '0452271079' },
    });
    fireEvent.change(getByTestId('omistajat-osasto'), {
      target: { value: 'Test' },
    });

    getByTestId('forward').click(); // changes view to Työmaan tiedot
    await waitFor(() => queryAllByText('Hankkeen haitat')[1]);
    fireEvent.change(getByTestId(FORMFIELD.KATUOSOITE), {
      target: { value: 'Pohjoinen Rautatiekatu 11 b 12' },
    });
    getByText('Työmaan tyyppi').click();
    getByText('Vesi').click();

    getByTestId('forward').click(); // changes view to Hankkeen haitat
    await waitFor(() =>
      fireEvent.change(getByLabelText('Haitan alkupäivämäärä'), { target: { value: '24.03.2032' } })
    );
    fireEvent.change(getByLabelText('Haitan loppupäivämäärä'), { target: { value: '25.03.2032' } });

    getByText('Kaistahaitta').click();
    getByText('Vähentää samanaikaisesti kaistan yhdellä ajosuunnalla').click();

    getByText('Kaistan pituushaitta').click();

    getByText('Ei vaikuta').click();

    getByText('Meluhaitta').click();
    getByText('Satunnainen haitta').click();

    getByText('Pölyhaitta').click();
    getByText('Lyhytaikainen toistuva haitta').click();

    getByText('Tärinähaitta').click();
    getByText('Pitkäkestoinen jatkuva haitta').click();

    getByText('Tallenna ja poistu').click();
  });
});
