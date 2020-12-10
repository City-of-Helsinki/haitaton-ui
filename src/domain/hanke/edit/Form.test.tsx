import React from 'react';
import { Provider } from 'react-redux';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import { store } from '../../../common/components/app/store';
import { FORMFIELD } from './types';
import Form from './Form';
import { render } from '../../../testUtils/render';

afterEach(cleanup);

jest.setTimeout(10000);

const nimi = 'test kuoppa';
const alkuPvm = '24.03.2032';
const loppuPvm = '24.03.2032';
const omistajaEtunimi = 'Matti';
const katuosoite = 'Pohjoinen Rautatiekatu 11 b 12';
const hankeenKuvaus = 'Tässä on kuvaus';

describe('Form', () => {
  test('Form testing', async () => {
    const { getByTestId, getByLabelText, getByText, queryAllByText, queryByText } = render(
      <Provider store={store}>
        <Form />
      </Provider>
    );

    getByTestId(FORMFIELD.YKT_HANKE).click();
    fireEvent.change(getByTestId(FORMFIELD.NIMI), { target: { value: nimi } });
    fireEvent.change(getByTestId(FORMFIELD.KUVAUS), { target: { value: hankeenKuvaus } });
    fireEvent.change(getByLabelText('Hankkeen alkupäivä'), { target: { value: alkuPvm } });
    fireEvent.change(getByLabelText('Hankkeen loppupäivä'), { target: { value: loppuPvm } });

    getByTestId('forward').click(); // changes view to form1
    await waitFor(() => queryAllByText('Hankkeen yhteystiedot')[1]);

    getByTestId('backward').click(); // changes view to form0
    expect(getByTestId(FORMFIELD.YKT_HANKE)).toBeChecked();
    expect(getByLabelText('Hankkeen alkupäivä')).toHaveValue(alkuPvm);
    expect(getByLabelText('Hankkeen loppupäivä')).toHaveValue(loppuPvm);
    expect(getByTestId(FORMFIELD.NIMI)).toHaveValue(nimi);
    expect(getByTestId(FORMFIELD.KUVAUS)).toHaveValue(hankeenKuvaus);

    getByTestId('forward').click(); // changes view to form1
    getByTestId('forward').click(); // changes view to form2
    await waitFor(() => queryAllByText('Hankkeen yhteystiedot')[1]);
    fireEvent.change(getByTestId('omistajat-etunimi'), {
      target: { value: omistajaEtunimi },
    });

    getByTestId('forward').click(); // changes view to form3
    await waitFor(() => queryAllByText('Työmaan tiedot')[1]);

    getByTestId('backward').click(); // changes view to form2
    expect(getByTestId('omistajat-etunimi')).toHaveValue(omistajaEtunimi);

    getByTestId('forward').click(); // changes view to form3
    await waitFor(() => queryAllByText('Työmaan tiedot')[1]);
    fireEvent.change(getByTestId(FORMFIELD.KATUOSOITE), {
      target: { value: katuosoite },
    });

    getByTestId('forward').click(); // changes view to form4
    await waitFor(() =>
      fireEvent.change(getByLabelText('Haitan alkupäivämäärä'), { target: { value: '24.03.2032' } })
    );
    expect(queryAllByText('Vesi')[0]);

    getByTestId('backward').click(); // changes view to form3
    expect(getByTestId(FORMFIELD.KATUOSOITE)).toHaveValue(katuosoite);

    getByTestId('forward').click(); // changes view to form4
    await waitFor(() => queryAllByText('Hankkeen haitat')[1]);

    getByText('Tallenna ja poistu').click();
    await waitFor(() => queryByText('Lomake on lähetetty onnistuneesti'));
    expect(queryByText('Lomake on lähetetty onnistuneesti'));
  });
});
