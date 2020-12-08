import React from 'react';

import { Provider } from 'react-redux';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import { store } from '../../../common/components/app/store';
import { FORMFIELD } from './types';
import Form from './Form';
import { render } from '../../../testUtils/render';

afterEach(cleanup);
jest.setTimeout(25000);
const nimi = 'test kuoppa';
const alkuPvm = '24.03.2032';
const loppuPvm = '24.03.2032';
const omistajaEtunimi = 'Matti';
const omistajaSukunimi = 'Meikäläinen';
const omistajatEmail = 'test@test.fi';
const omistajatPuhelinnumero = '0452271079';
const omistajatOsasto = 'Test';
const katuosoite = 'Pohjoinen Rautatiekatu 11 b 12';
const hankeenKuvaus = 'Tässä on kuvaus';
describe('Form', () => {
  test('Form testing', async () => {
    const { getByTestId, getByLabelText, getByText, queryAllByText } = render(
      <Provider store={store}>
        <Form />
      </Provider>
    );

    getByTestId(FORMFIELD.YKT_HANKE).click();
    fireEvent.change(getByTestId(FORMFIELD.NIMI), { target: { value: nimi } });
    fireEvent.change(getByTestId(FORMFIELD.KUVAUS), { target: { value: hankeenKuvaus } });

    fireEvent.change(getByLabelText('Hankkeen alkupäivä'), { target: { value: alkuPvm } });
    fireEvent.change(getByLabelText('Hankkeen loppupäivä'), { target: { value: loppuPvm } });

    getByText('Hankeen Vaihe').click();
    getByText('Ohjelmointi').click();
    getByTestId('forward').click(); // changes view to form1
    await waitFor(() => queryAllByText('Hankkeen yhteystiedot')[1]);
    getByTestId('backward').click(); // changes view to form0
    expect(getByTestId(FORMFIELD.YKT_HANKE)).toBeChecked();
    expect(getByLabelText('Hankkeen alkupäivä')).toHaveAttribute('value', alkuPvm);
    expect(getByLabelText('Hankkeen loppupäivä')).toHaveAttribute('value', loppuPvm);

    expect(getByTestId(FORMFIELD.NIMI)).toHaveAttribute('value', nimi);
    expect(getByTestId(FORMFIELD.KUVAUS)).toBe(hankeenKuvaus);
    getByTestId('forward').click(); // changes view to form1
    await waitFor(() => queryAllByText('Hankkeen yhteystiedot')[1]);
    getByTestId('forward').click(); // changes view to form2

    fireEvent.change(getByTestId('omistajat-etunimi'), {
      target: { value: omistajaEtunimi },
    });
    fireEvent.change(getByTestId('omistajat-sukunimi'), {
      target: { value: omistajaSukunimi },
    });
    fireEvent.change(getByTestId('omistajat-email'), {
      target: { value: omistajatEmail },
    });
    fireEvent.change(getByTestId('omistajat-puhelinnumero'), {
      target: { value: omistajatPuhelinnumero },
    });
    fireEvent.change(getByTestId('omistajat-osasto'), {
      target: { value: omistajatOsasto },
    });

    getByTestId('forward').click(); // changes view to form3
    await waitFor(() => queryAllByText('Työmaan tiedot')[1]);
    getByTestId('backward').click(); // changes view to form2

    expect(getByTestId('omistajat-etunimi')).toHaveAttribute('value', omistajaEtunimi);
    expect(getByTestId('omistajat-sukunimi')).toHaveAttribute('value', omistajaSukunimi);
    expect(getByTestId('omistajat-email')).toHaveAttribute('value', omistajatEmail);
    expect(getByTestId('omistajat-puhelinnumero')).toHaveAttribute('value', omistajatPuhelinnumero);
    expect(getByTestId('omistajat-osasto')).toHaveAttribute('value', omistajatOsasto);

    getByTestId('forward').click(); // changes view to form3
    await waitFor(() => queryAllByText('Työmaan tiedot')[1]);
    fireEvent.change(getByTestId(FORMFIELD.KATUOSOITE), {
      target: { value: katuosoite },
    });
    getByText('Työmaan tyyppi').click();
    getByText('Vesi').click();

    getByTestId('forward').click(); // changes view to form4
    await waitFor(() =>
      fireEvent.change(getByLabelText('Haitan alkupäivämäärä'), { target: { value: '24.03.2032' } })
    );
    expect(queryAllByText('Vesi')[0]);
    getByTestId('backward').click(); // changes view to form3
    expect(getByTestId(FORMFIELD.KATUOSOITE)).toHaveAttribute('value', katuosoite);
    getByTestId('forward').click(); // changes view to form4
    await waitFor(() => queryAllByText('Hankkeen haitat')[1]);

    fireEvent.change(getByLabelText('Haitan alkupäivämäärä'), { target: { value: alkuPvm } });

    fireEvent.change(getByLabelText('Haitan loppupäivämäärä'), { target: { value: loppuPvm } });

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

    getByTestId('backward').click(); // changes view to form3
    await waitFor(() => queryAllByText('Työmaan tiedot')[1]);
    getByTestId('forward').click(); // changes view to form4
    await waitFor(() => queryAllByText('Hankkeen haitat')[1]);

    expect(getByLabelText('Haitan alkupäivämäärä')).toHaveAttribute('value', alkuPvm);
    expect(getByLabelText('Haitan loppupäivämäärä')).toHaveAttribute('value', loppuPvm);
    expect(queryAllByText('Vähentää samanaikaisesti kaistan yhdellä ajosuunnalla')[0]);
    expect(queryAllByText('Ei vaikuta')[0]);
    expect(queryAllByText('Lyhytaikainen toistuva haitta')[0]);
    expect(queryAllByText('Pitkäkestoinen jatkuva haitta')[0]);

    getByText('Tallenna ja poistu').click();
    await waitFor(() => queryAllByText('Lomake on lähetetty onnistuneesti')[0]);
    expect(queryAllByText('Lomake on lähetetty onnistuneesti')[0]);
  });
});
