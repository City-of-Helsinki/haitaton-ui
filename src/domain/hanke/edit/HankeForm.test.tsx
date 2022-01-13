import React from 'react';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import { FORMFIELD } from './types';
import HankeForm from './HankeForm';
import HankeFormContainer from './HankeFormContainer';
import { HANKE_VAIHE, HANKE_TYOMAATYYPPI } from '../../types/hanke';
import { render } from '../../../testUtils/render';

afterEach(cleanup);

jest.setTimeout(10000);

const nimi = 'test kuoppa';
const alkuPvm = '24.03.2025';
const loppuPvm = '25.03.2032';
const haittaAlkuPvm = '24.03.2025';
const haittaLoppuPvm = '25.03.2032';
const omistajaEtunimi = 'Matti';
const katuosoite = 'Pohjoinen Rautatiekatu 11 b 12';
const hankeenKuvaus = 'Tässä on kuvaus';

const formData = {
  vaihe: HANKE_VAIHE.OHJELMOINTI,
  toteuttajat: [],
  arvioijat: [],
  omistajat: [],
  tyomaaTyyppi: [HANKE_TYOMAATYYPPI.AKILLINEN_VIKAKORJAUS],
  tilat: {
    onGeometrioita: true,
    onKaikkiPakollisetLuontiTiedot: true,
    onTiedotLiikenneHaittaIndeksille: true,
    onLiikenneHaittaIndeksi: false,
    onViereisiaHankkeita: false,
    onAsiakasryhmia: false,
  },
};

describe('HankeForm', () => {
  jest.setTimeout(20000);
  test('happypath', async () => {
    const handleSave = jest.fn();
    const handleSaveGeometry = jest.fn();
    const handleIsDirtyChange = jest.fn();
    const handleUnmount = jest.fn();
    const handleFormClose = jest.fn();
    const isSaving = false;

    const { getByTestId, getByLabelText, queryAllByText } = render(
      <HankeForm
        formData={formData}
        onSave={handleSave}
        onSaveGeometry={handleSaveGeometry}
        onIsDirtyChange={handleIsDirtyChange}
        onUnmount={handleUnmount}
        onFormClose={handleFormClose}
        isSaving={isSaving}
      />
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
    queryAllByText('Hankkeen Vaihe')[0].click();
    queryAllByText('Ohjelmointi')[0].click();
    expect(handleIsDirtyChange).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(getByTestId('forward')).not.toBeDisabled());

    getByTestId('forward').click(); // changes view to form1
    expect(handleSave).toHaveBeenCalledTimes(1);
    await waitFor(() => queryAllByText('Hankkeen yhteystiedot')[1]);

    getByTestId('backward').click(); // changes view to form0
    // await waitFor(() => expect(getByTestId(FORMFIELD.YKT_HANKE)).toBeChecked());
    expect(getByLabelText('Hankkeen alkupäivä', { exact: false })).toHaveValue(alkuPvm);
    expect(getByLabelText('Hankkeen loppupäivä', { exact: false })).toHaveValue(loppuPvm);
    expect(getByTestId(FORMFIELD.NIMI)).toHaveValue(nimi);
    expect(getByTestId(FORMFIELD.KUVAUS)).toHaveValue(hankeenKuvaus);

    getByTestId('forward').click(); // changes view to form1
    getByTestId('forward').click(); // changes view to form2
    await waitFor(() => queryAllByText('Hankkeen yhteystiedot')[1]);
    expect(handleSave).toHaveBeenCalledTimes(2);
    fireEvent.change(getByTestId('omistajat-etunimi'), {
      target: { value: omistajaEtunimi },
    });
    fireEvent.change(getByTestId('omistajat-sukunimi'), {
      target: { value: omistajaEtunimi },
    });
    fireEvent.change(getByTestId('omistajat-email'), {
      target: { value: 'pekka@omistaja.fi' },
    });
    fireEvent.change(getByTestId('omistajat-puhelinnumero'), {
      target: { value: '0406664200' },
    });

    getByTestId('forward').click(); // changes view to form3
    await waitFor(() => queryAllByText('Hankkeen lisätiedot')[1]);

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
    await waitFor(() => queryAllByText('Hankkeen haitat')[1]);

    fireEvent.change(getByLabelText('Haitan alkupäivämäärä', { exact: false }), {
      target: { value: haittaAlkuPvm },
    });

    fireEvent.change(getByLabelText('Haitan loppupäivämäärä', { exact: false }), {
      target: { value: haittaLoppuPvm },
    });

    getByTestId('backward').click(); // changes view to form3
    await waitFor(() => getByTestId(FORMFIELD.KATUOSOITE));
    expect(getByTestId(FORMFIELD.KATUOSOITE)).toHaveValue(katuosoite);

    getByTestId('forward').click(); // changes view to form4
    await waitFor(() => queryAllByText('Hankkeen haitat')[1]);

    queryAllByText('Kaistahaitta')[0].click();
    queryAllByText('Ei vaikuta')[0].click();

    queryAllByText('Kaistan pituushaitta')[0].click();
    queryAllByText('Enintään 10 m')[0].click();
  });

  test('suunnitteluVaihde should be required when vaihe is suunnittelu', async () => {
    const handleSave = jest.fn();
    const handleSaveGeometry = jest.fn();
    const handleIsDirtyChange = jest.fn();
    const handleUnmount = jest.fn();
    const handleFormClose = jest.fn();

    const { getByTestId, getByLabelText, queryAllByText } = render(
      <HankeForm
        formData={formData}
        onSave={handleSave}
        onSaveGeometry={handleSaveGeometry}
        onIsDirtyChange={handleIsDirtyChange}
        onUnmount={handleUnmount}
        onFormClose={handleFormClose}
        isSaving
      />
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

    queryAllByText('Hankkeen Vaihe')[0].click();
    queryAllByText('Suunnittelu')[0].click();

    await waitFor(() => expect(getByTestId('forward')).toBeDisabled());

    queryAllByText('Hankkeen suunnitteluvaihe')[0].click();
    queryAllByText('Yleis- tai hankesuunnittelu')[0].click();

    await waitFor(() => expect(getByTestId('forward')).not.toBeDisabled());
  });

  test('contacts should be validated correctly', async () => {
    const handleSave = jest.fn();
    const handleSaveGeometry = jest.fn();
    const handleIsDirtyChange = jest.fn();
    const handleUnmount = jest.fn();
    const handleFormClose = jest.fn();

    const { getByTestId, getByLabelText, queryAllByText, queryByText } = render(
      <HankeForm
        formData={formData}
        onSave={handleSave}
        onSaveGeometry={handleSaveGeometry}
        onIsDirtyChange={handleIsDirtyChange}
        onUnmount={handleUnmount}
        onFormClose={handleFormClose}
        isSaving
      />
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

    queryAllByText('Hankkeen Vaihe')[0].click();
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

    await waitFor(() => expect(queryByText('Sähköposti on virheellinen')));
    await waitFor(() => expect(getByTestId('forward')).toBeDisabled());

    fireEvent.change(getByTestId('omistajat-email'), {
      target: { value: 'omistaja@foo.bar' },
    });

    await waitFor(() => expect(getByTestId('forward')).not.toBeDisabled());
  });

  /* test('Success notification should be shown', async () => {
    const { queryByTestId, queryByText } = render(
      <HankeForm
        formData={formData}
        // showNotification="success"
        onSave={() => ({})}
        onSubmit={() => ({})}
        onSaveGeometry={() => ({})}
        onIsDirtyChange={() => ({})}
        onUnmount={() => ({})}
        onFormClose={() => ({})}
      />
    );
    await waitFor(() => expect(queryByText('Luonnos tallennettu')));
    await waitFor(() => expect(queryByTestId('notification')).toBeNull());
  }); */

  test('Form should be populated correctly ', async () => {
    const { getByTestId, getByText } = render(
      <HankeForm
        formData={{
          ...formData,
          [FORMFIELD.NIMI]: 'Lenkkeilijä Pekka',
        }}
        onSave={() => ({})}
        onSaveGeometry={() => ({})}
        onIsDirtyChange={() => ({})}
        onUnmount={() => ({})}
        onFormClose={() => ({})}
        isSaving
      />
    );
    expect(getByTestId(FORMFIELD.NIMI)).toHaveValue('Lenkkeilijä Pekka');
    expect(getByTestId(FORMFIELD.KUVAUS)).toHaveValue('');
    expect(getByText('Ohjelmointi')).toBeInTheDocument();
  });

  test('Form editing should be disabled if it is already started ', async () => {
    const { getByTestId, getByText } = render(
      <HankeForm
        formData={{
          ...formData,
          [FORMFIELD.ALKU_PVM]: '1999-03-15T00:00:00Z',
        }}
        onSave={() => ({})}
        onSaveGeometry={() => ({})}
        onIsDirtyChange={() => ({})}
        onUnmount={() => ({})}
        onFormClose={() => ({})}
        isSaving
      />
    );
    expect(getByTestId('editing-disabled-notification')).toBeInTheDocument();
    expect(getByText(/Käynnissä olevan hankkeen tietoja ei voi muokata/i)).toBeDefined();
  });

  test('HankeFormContainer integration should work ', async () => {
    const { getByText, queryByText, getByLabelText, queryAllByText, getByTestId } = render(
      <HankeFormContainer />
    );
    fireEvent.change(getByTestId(FORMFIELD.NIMI), { target: { value: nimi } });
    fireEvent.change(getByTestId(FORMFIELD.KUVAUS), { target: { value: hankeenKuvaus } });
    fireEvent.change(getByLabelText('Hankkeen alkupäivä', { exact: false }), {
      target: { value: alkuPvm },
    });
    fireEvent.change(getByLabelText('Hankkeen loppupäivä', { exact: false }), {
      target: { value: loppuPvm },
    });
    queryAllByText('Hankkeen Vaihe')[0].click();
    queryAllByText('Ohjelmointi')[0].click();

    getByText('Tallenna luonnos').click();

    await waitFor(() => expect(getByTestId('forward')).toBeDisabled());
    await waitFor(() => expect(queryByText('Luonnos tallennettu')));

    expect(getByTestId(FORMFIELD.NIMI)).toHaveValue(nimi);
    expect(getByTestId(FORMFIELD.KUVAUS)).toHaveValue(hankeenKuvaus);
  });
});
