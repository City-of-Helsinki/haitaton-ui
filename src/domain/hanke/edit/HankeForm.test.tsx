import React from 'react';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import { FORMFIELD, HankeDataFormState } from './types';
import HankeForm from './HankeForm';
import HankeFormContainer from './HankeFormContainer';
import { HANKE_VAIHE, HANKE_TYOMAATYYPPI } from '../../types/hanke';
import { render } from '../../../testUtils/render';

afterEach(cleanup);

jest.setTimeout(10000);

const nimi = 'test kuoppa';
const alkuPvm = '24.03.2025';
const loppuPvm = '25.03.2032';
const hankkeenKuvaus = 'Tässä on kuvaus';
const hankkeenOsoite = 'Sankaritie 3';
/* Highly recommend to revise these tests to use typed constants like so
const hankeData: HankeDataDraft = {
  nimi: 'test kuoppa',
  kuvaus: 'Tässä on kuvaus',
  tyomaaKatuosoite: 'Sankaritie 3',
  alkuPvm: '24.03.2025',
  loppuPvm: '25.03.2025',
  vaihe: 'OHJELMOINTI',
  suunnitteluVaihe: 'KATUSUUNNITTELU_TAI_ALUEVARAUS',
  omistajat: [
    {
      id: null,
      etunimi: 'Matti',
      email: 'Matti@haitaton.hel.fi',
      sukunimi: 'Meikäläinen',
      organisaatioId: null,
      organisaatioNimi: 'Matin organisaatio',
      osasto: '',
      puhelinnumero: '12341234',
    },
  ],
};
*/

const formData: HankeDataFormState = {
  vaihe: HANKE_VAIHE.OHJELMOINTI,
  toteuttajat: [],
  arvioijat: [],
  omistajat: [],
  tyomaaTyyppi: [HANKE_TYOMAATYYPPI.AKILLINEN_VIKAKORJAUS],
  nimi: 'testi kuoppa',
  kuvaus: 'testi kuvaus',
};

describe('HankeForm', () => {
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
        onOpenHankeDelete={() => ({})}
      >
        child
      </HankeForm>
    );

    fireEvent.change(getByTestId(FORMFIELD.NIMI), { target: { value: nimi } });
    fireEvent.change(getByTestId(FORMFIELD.KUVAUS), { target: { value: hankkeenKuvaus } });
    fireEvent.change(getByTestId(FORMFIELD.KATUOSOITE), { target: { value: hankkeenOsoite } });
    fireEvent.change(getByLabelText('Hankkeen alkupäivä', { exact: false }), {
      target: { value: alkuPvm },
    });
    fireEvent.change(getByLabelText('Hankkeen loppupäivä', { exact: false }), {
      target: { value: loppuPvm },
    });

    queryAllByText('Hankkeen Vaihe')[0].click();
    queryAllByText('Suunnittelu')[0].click();

    getByTestId(FORMFIELD.YKT_HANKE).click();

    await waitFor(() => expect(getByTestId('forward')).toBeDisabled());

    queryAllByText('Hankkeen suunnitteluvaihe')[0].click();
    queryAllByText('Yleis- tai hankesuunnittelu')[0].click();

    await waitFor(() => expect(getByTestId('forward')).not.toBeDisabled());
  });

  test('Form should be populated correctly ', async () => {
    const { getByTestId, getByText } = render(
      <HankeForm
        formData={{
          ...formData,
          [FORMFIELD.NIMI]: 'Formin nimi',
          [FORMFIELD.KUVAUS]: 'Formin kuvaus',
        }}
        onSave={() => ({})}
        onSaveGeometry={() => ({})}
        onIsDirtyChange={() => ({})}
        onUnmount={() => ({})}
        onFormClose={() => ({})}
        isSaving
        onOpenHankeDelete={() => ({})}
      >
        child
      </HankeForm>
    );
    expect(getByTestId(FORMFIELD.NIMI)).toHaveValue('Formin nimi');
    expect(getByTestId(FORMFIELD.KUVAUS)).toHaveValue('Formin kuvaus');
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
        onOpenHankeDelete={() => ({})}
      >
        child
      </HankeForm>
    );
    expect(getByTestId('editing-disabled-notification')).toBeInTheDocument();
    expect(getByText(/Käynnissä olevan hankkeen tietoja ei voi muokata/i)).toBeDefined();
  });

  test('HankeFormContainer integration should work ', async () => {
    const { getByText, queryByText, getByLabelText, queryAllByText, getByTestId } = render(
      <HankeFormContainer />
    );
    fireEvent.change(getByTestId(FORMFIELD.NIMI), { target: { value: nimi } });
    fireEvent.change(getByTestId(FORMFIELD.KUVAUS), { target: { value: hankkeenKuvaus } });
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
    expect(getByTestId(FORMFIELD.KUVAUS)).toHaveValue(hankkeenKuvaus);
  });
});
