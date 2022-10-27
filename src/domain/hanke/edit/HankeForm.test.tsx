import React from 'react';
import { FORMFIELD, HankeDataFormState } from './types';
import HankeForm from './HankeForm';
import HankeFormContainer from './HankeFormContainer';
import { HANKE_VAIHE, HANKE_TYOMAATYYPPI } from '../../types/hanke';
import { render, cleanup, fireEvent, waitFor, screen } from '../../../testUtils/render';

afterEach(cleanup);

jest.setTimeout(10000);

const nimi = 'test kuoppa';
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
    const handleIsDirtyChange = jest.fn();
    const handleFormClose = jest.fn();

    render(
      <HankeForm
        formData={formData}
        onIsDirtyChange={handleIsDirtyChange}
        onFormClose={handleFormClose}
        onOpenHankeDelete={() => ({})}
      >
        child
      </HankeForm>
    );

    fireEvent.change(screen.getByTestId(FORMFIELD.NIMI), { target: { value: nimi } });
    fireEvent.change(screen.getByTestId(FORMFIELD.KUVAUS), { target: { value: hankkeenKuvaus } });
    fireEvent.change(screen.getByTestId(FORMFIELD.KATUOSOITE), {
      target: { value: hankkeenOsoite },
    });

    screen.queryByText('Hankkeen Vaihe')?.click();
    screen.queryAllByText('Suunnittelu')[0].click();

    screen.getByTestId(FORMFIELD.YKT_HANKE).click();

    expect(screen.getByRole('button', { name: 'Tallenna ja keskeytä' })).toBeDisabled();

    screen.queryAllByText('Hankkeen suunnitteluvaihe')[0].click();
    screen.queryAllByText('Yleis- tai hankesuunnittelu')[0].click();

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Tallenna ja keskeytä' })).not.toBeDisabled()
    );
  });

  test('Form should be populated correctly ', () => {
    render(
      <HankeForm
        formData={{
          ...formData,
          [FORMFIELD.NIMI]: 'Formin nimi',
          [FORMFIELD.KUVAUS]: 'Formin kuvaus',
        }}
        onIsDirtyChange={() => ({})}
        onFormClose={() => ({})}
        onOpenHankeDelete={() => ({})}
      >
        child
      </HankeForm>
    );
    expect(screen.getByTestId(FORMFIELD.NIMI)).toHaveValue('Formin nimi');
    expect(screen.getByTestId(FORMFIELD.KUVAUS)).toHaveValue('Formin kuvaus');
    expect(screen.getByText('Ohjelmointi')).toBeInTheDocument();
  });

  test('HankeFormContainer integration should work ', async () => {
    render(<HankeFormContainer />);
    fireEvent.change(screen.getByTestId(FORMFIELD.NIMI), { target: { value: nimi } });
    fireEvent.change(screen.getByTestId(FORMFIELD.KUVAUS), { target: { value: hankkeenKuvaus } });
    screen.queryAllByText('Hankkeen Vaihe')[0].click();
    screen.queryAllByText('Ohjelmointi')[0].click();

    screen.getByText('Tallenna ja keskeytä').click();

    await waitFor(() => expect(screen.queryByText('Luonnos tallennettu')));

    expect(screen.getByTestId(FORMFIELD.NIMI)).toHaveValue(nimi);
    expect(screen.getByTestId(FORMFIELD.KUVAUS)).toHaveValue(hankkeenKuvaus);
  });
});
