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
const loppuPvm = '25.03.2032';
const omistajaEtunimi = 'Matti';
const katuosoite = 'Pohjoinen Rautatiekatu 11 b 12';
const hankeenKuvaus = 'Tässä on kuvaus';

describe('HankeForm', () => {
  test('happypath', async () => {
    const { getByTestId, getByLabelText, getByText, queryAllByText, queryByText } = render(
      <Provider store={store}>
        <Form />
      </Provider>
    );

    getByTestId(FORMFIELD.YKT_HANKE).click();
    fireEvent.change(getByTestId(FORMFIELD.NIMI), { target: { value: nimi } });
    fireEvent.change(getByTestId(FORMFIELD.KUVAUS), { target: { value: hankeenKuvaus } });
    fireEvent.change(getByLabelText('Hankkeen alkupäivä', { exact: false }), {
      target: { value: alkuPvm },
    });
    fireEvent.change(getByLabelText('Hankkeen loppupäivä', { exact: false }), {
      target: { value: loppuPvm },
    });

    queryAllByText('Hankeen Vaihe')[0].click();
    queryAllByText('Ohjelmointi')[0].click();
    await waitFor(() => expect(getByTestId('forward')).not.toBeDisabled());
    getByTestId('forward').click(); // changes view to form1
    await waitFor(() => queryAllByText('Hankkeen yhteystiedot')[1]);

    getByTestId('backward').click(); // changes view to form0
    expect(getByTestId(FORMFIELD.YKT_HANKE)).toBeChecked();
    expect(getByLabelText('Hankkeen alkupäivä', { exact: false })).toHaveValue(alkuPvm);
    expect(getByLabelText('Hankkeen loppupäivä', { exact: false })).toHaveValue(loppuPvm);
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
    await waitFor(() => queryAllByText('Hankkeen yhteystiedot')[1]);
    expect(getByTestId('omistajat-etunimi')).toHaveValue(omistajaEtunimi);

    getByTestId('forward').click(); // changes view to form3
    await waitFor(() => getByTestId(FORMFIELD.KATUOSOITE));
    fireEvent.change(getByTestId(FORMFIELD.KATUOSOITE), {
      target: { value: katuosoite },
    });
    await waitFor(() => expect(getByTestId('forward')).not.toBeDisabled());

    getByTestId('forward').click(); // changes view to form4
    await waitFor(() => getByLabelText('Haitan alkupäivämäärä'));
    fireEvent.change(getByLabelText('Haitan alkupäivämäärä'), { target: { value: '24.03.2032' } });

    getByTestId('backward').click(); // changes view to form3
    await waitFor(() => getByTestId(FORMFIELD.KATUOSOITE));
    expect(getByTestId(FORMFIELD.KATUOSOITE)).toHaveValue(katuosoite);

    getByTestId('forward').click(); // changes view to form4
    await waitFor(() => queryAllByText('Hankkeen haitat')[1]);

    getByText('Tallenna ja poistu').click();
    await waitFor(() => queryByText('Lomake on lähetetty onnistuneesti'));
    expect(queryByText('Lomake on lähetetty onnistuneesti'));
  });

  test('suunnitteluVaihde should be required when vaihe is suunnittelu', async () => {
    const { getByTestId, getByLabelText, queryAllByText } = render(
      <Provider store={store}>
        <Form />
      </Provider>
    );

    getByTestId(FORMFIELD.YKT_HANKE).click();
    fireEvent.change(getByTestId(FORMFIELD.NIMI), { target: { value: nimi } });
    fireEvent.change(getByTestId(FORMFIELD.KUVAUS), { target: { value: hankeenKuvaus } });
    fireEvent.change(getByLabelText('Hankkeen alkupäivä', { exact: false }), {
      target: { value: alkuPvm },
    });
    fireEvent.change(getByLabelText('Hankkeen loppupäivä', { exact: false }), {
      target: { value: loppuPvm },
    });

    queryAllByText('Hankeen Vaihe')[0].click();
    queryAllByText('Suunnittelu')[0].click();

    await waitFor(() => expect(getByTestId('forward')).toBeDisabled());

    queryAllByText('Hankkeen suunnitteluvaihe')[0].click();
    queryAllByText('Yleis- tai hankesuunnittelu')[0].click();

    await waitFor(() => expect(getByTestId('forward')).not.toBeDisabled());
  });

  test('contacts should be validated correctly', async () => {
    const { getByTestId, getByLabelText, queryAllByText } = render(
      <Provider store={store}>
        <Form />
      </Provider>
    );

    getByTestId(FORMFIELD.YKT_HANKE).click();
    fireEvent.change(getByTestId(FORMFIELD.NIMI), { target: { value: nimi } });
    fireEvent.change(getByTestId(FORMFIELD.KUVAUS), { target: { value: hankeenKuvaus } });
    fireEvent.change(getByLabelText('Hankkeen alkupäivä', { exact: false }), {
      target: { value: alkuPvm },
    });
    fireEvent.change(getByLabelText('Hankkeen loppupäivä', { exact: false }), {
      target: { value: loppuPvm },
    });

    queryAllByText('Hankeen Vaihe')[0].click();
    queryAllByText('Ohjelmointi')[0].click();

    await waitFor(() => expect(getByTestId('forward')).not.toBeDisabled());

    getByTestId('forward').click();
    getByTestId('forward').click();
    await waitFor(() => queryAllByText('Hankkeen yhteystiedot')[1]);
    fireEvent.change(getByTestId('omistajat-etunimi'), {
      target: { value: omistajaEtunimi },
    });
    fireEvent.change(getByTestId('omistajat-sukunimi'), {
      target: { value: 'OmistajaSukunimi' },
    });
    fireEvent.change(getByTestId('omistajat-puhelinnumero'), {
      target: { value: '04500112233' },
    });
    fireEvent.change(getByTestId('omistajat-email'), {
      target: { value: 'wrongEmail' },
    });

    await waitFor(() => expect(getByTestId('forward')).toBeDisabled());
    fireEvent.change(getByTestId('omistajat-email'), {
      target: { value: 'omistaja@foo.bar' },
    });

    await waitFor(() => expect(getByTestId('forward')).not.toBeDisabled());
  });
});
