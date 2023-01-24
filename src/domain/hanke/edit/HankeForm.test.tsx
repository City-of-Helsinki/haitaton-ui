import React from 'react';
import userEvent from '@testing-library/user-event';
import { FORMFIELD, HankeDataFormState } from './types';
import HankeForm from './HankeForm';
import HankeFormContainer from './HankeFormContainer';
import { HANKE_VAIHE, HANKE_TYOMAATYYPPI } from '../../types/hanke';
import { render, cleanup, fireEvent, waitFor, screen } from '../../../testUtils/render';

afterEach(cleanup);

jest.setTimeout(30000);

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
  rakennuttajat: [],
  toteuttajat: [],
  muut: [],
  tyomaaTyyppi: [HANKE_TYOMAATYYPPI.AKILLINEN_VIKAKORJAUS],
  nimi: 'testi kuoppa',
  kuvaus: 'testi kuvaus',
};

async function setupYhteystiedotPage(jsx: JSX.Element) {
  const user = userEvent.setup();
  const renderResult = render(jsx);

  await waitFor(() => expect(screen.queryByText('Perustiedot')).toBeInTheDocument());
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));
  await waitFor(() => expect(screen.queryByText(/hankkeen omistaja/i)).toBeInTheDocument());

  return {
    user,
    ...renderResult,
  };
}

describe('HankeForm', () => {
  test('suunnitteluVaihde should be required when vaihe is suunnittelu', async () => {
    const handleIsDirtyChange = jest.fn();
    const handleFormClose = jest.fn();
    const user = userEvent.setup();

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

    await user.click(screen.getByRole('radio', { name: 'Suunnittelu' }));

    await user.click(screen.getByRole('checkbox', { name: 'Hanke on YKT-hanke' }));

    await user.click(screen.getByText('Hankkeen suunnitteluvaihe'));
    await user.click(screen.getByText('Yleis- tai hankesuunnittelu'));
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
    screen.queryAllByText('Hankkeen vaihe')[0].click();
    screen.queryAllByText('Ohjelmointi')[0].click();

    screen.getByText('Tallenna ja keskeytä').click();

    await waitFor(() => expect(screen.queryByText('Luonnos tallennettu')));

    expect(screen.getByTestId(FORMFIELD.NIMI)).toHaveValue(nimi);
    expect(screen.getByTestId(FORMFIELD.KUVAUS)).toHaveValue(hankkeenKuvaus);
  });

  test('Yhteystiedot can be filled', async () => {
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-1" />);

    await user.click(screen.getByRole('button', { name: /tyyppi/i }));
    await user.click(screen.getByText(/yritys/i));
    await user.type(screen.getByRole('textbox', { name: /nimi/i }), 'Olli Omistaja');
    await user.type(
      screen.getByRole('textbox', { name: /y-tunnus tai henkilötunnus/i }),
      'y-tunnus'
    );
    await user.type(screen.getByRole('textbox', { name: /katuosoite/i }), 'Testikuja 1');
    await user.type(screen.getByRole('textbox', { name: /postinumero/i }), '00000');
    await user.type(screen.getByRole('textbox', { name: /postitoimipaikka/i }), 'Testikaupunki');
    await user.type(screen.getByRole('textbox', { name: /sähköposti/i }), 'test@mail.com');
    await user.type(screen.getByRole('textbox', { name: /puhelinnumero/i }), '0400000000');

    expect(screen.queryByRole('group', { name: 'Yhteyshenkilö' })).not.toBeInTheDocument();
    await user.click(screen.getByLabelText(/erillinen yhteyshenkilö/i));
    expect(screen.getByRole('group', { name: 'Yhteyshenkilö' })).toBeInTheDocument();

    await user.type(screen.getAllByRole('textbox', { name: /nimi/i })[1], 'Testi Yhteyshenkilö');
    await user.type(
      screen.getAllByRole('textbox', { name: /sähköposti/i })[1],
      'yhteyshenkilo@mail.com'
    );

    await user.click(screen.getByText(/lisää rakennuttajia/i));
    await user.click(screen.getByText(/lisää rakennuttaja/i));
    expect(screen.getAllByText('Rakennuttaja')).toHaveLength(1);

    await user.click(screen.getByText(/lisää yhteyshenkilö/i));
    await user.click(screen.getByText(/lisää yhteyshenkilö/i));
    expect(screen.getByRole('tablist').childElementCount).toBe(2);

    await user.click(screen.getByText(/lisää rakennuttaja/i));
    expect(screen.getAllByText('Rakennuttaja')).toHaveLength(2);

    await user.click(screen.getAllByText(/poista rakennuttaja/i)[1]);
    expect(screen.getAllByText('Rakennuttaja')).toHaveLength(1);

    await user.click(screen.getByText(/poista yhteyshenkilö/i));
    expect(screen.getByRole('tablist').childElementCount).toBe(1);
    await user.click(screen.getByText(/poista yhteyshenkilö/i));
    expect(screen.queryByText('Yhteyshenkilön tiedot')).not.toBeInTheDocument();
  });
});
