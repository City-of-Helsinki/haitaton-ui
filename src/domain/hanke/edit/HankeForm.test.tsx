import React from 'react';
import userEvent from '@testing-library/user-event';
import MockAxios from 'jest-mock-axios';
import { FORMFIELD, HankeDataFormState } from './types';
import HankeForm from './HankeForm';
import HankeFormContainer from './HankeFormContainer';
import { HANKE_VAIHE, HANKE_TYOMAATYYPPI } from '../../types/hanke';
import { render, cleanup, fireEvent, waitFor, screen } from '../../../testUtils/render';
import hankeMock from '../../mocks/hankeDraft';

afterEach(cleanup);

jest.setTimeout(20000);

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
  rakennuttajat: [],
  toteuttajat: [],
  muutTahot: [],
  tyomaaTyyppi: [HANKE_TYOMAATYYPPI.AKILLINEN_VIKAKORJAUS],
  nimi: 'testi kuoppa',
  kuvaus: 'testi kuvaus',
};

async function setupYhteystiedotPage(jsx: JSX.Element) {
  MockAxios.get.mockResolvedValueOnce({ data: hankeMock });
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
    fireEvent.change(screen.getByLabelText('Hankkeen alkupäivä', { exact: false }), {
      target: { value: alkuPvm },
    });
    fireEvent.change(screen.getByLabelText('Hankkeen loppupäivä', { exact: false }), {
      target: { value: loppuPvm },
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
          [FORMFIELD.ALKU_PVM]: '2022-11-06T00:00:00Z',
          [FORMFIELD.LOPPU_PVM]: '2023-01-18T00:00:00Z',
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
    expect(screen.getByLabelText('Hankkeen alkupäivä', { exact: false })).toHaveValue('6.11.2022');
    expect(screen.getByLabelText('Hankkeen loppupäivä', { exact: false })).toHaveValue('18.1.2023');
  });

  test('Form editing should be disabled if it is already started ', () => {
    render(
      <HankeForm
        formData={{
          ...formData,
          [FORMFIELD.ALKU_PVM]: '1999-03-15T00:00:00Z',
        }}
        onIsDirtyChange={() => ({})}
        onFormClose={() => ({})}
        onOpenHankeDelete={() => ({})}
      >
        child
      </HankeForm>
    );
    expect(screen.getByTestId('editing-disabled-notification')).toBeInTheDocument();
    expect(screen.getByText(/Käynnissä olevan hankkeen tietoja ei voi muokata/i)).toBeDefined();
  });

  test('HankeFormContainer integration should work ', async () => {
    render(<HankeFormContainer />);
    fireEvent.change(screen.getByTestId(FORMFIELD.NIMI), { target: { value: nimi } });
    fireEvent.change(screen.getByTestId(FORMFIELD.KUVAUS), { target: { value: hankkeenKuvaus } });
    fireEvent.change(screen.getByLabelText('Hankkeen alkupäivä', { exact: false }), {
      target: { value: alkuPvm },
    });
    fireEvent.change(screen.getByLabelText('Hankkeen loppupäivä', { exact: false }), {
      target: { value: loppuPvm },
    });
    screen.queryAllByText('Hankkeen Vaihe')[0].click();
    screen.queryAllByText('Ohjelmointi')[0].click();

    screen.getByText('Tallenna ja keskeytä').click();

    await waitFor(() => expect(screen.queryByText('Luonnos tallennettu')));

    expect(screen.getByTestId(FORMFIELD.NIMI)).toHaveValue(nimi);
    expect(screen.getByTestId(FORMFIELD.KUVAUS)).toHaveValue(hankkeenKuvaus);
  });

  test('Date control validations should work', async () => {
    render(<HankeFormContainer />);

    const startDateControl = screen.getByLabelText('Hankkeen alkupäivä', { exact: false });
    const endDateControl = screen.getByLabelText('Hankkeen loppupäivä', { exact: false });

    fireEvent.change(startDateControl, {
      target: { value: '1.13.2023' },
    });
    fireEvent.blur(startDateControl);

    await waitFor(() =>
      expect(screen.queryByText('Kentän tyyppi on virheellinen')).toBeInTheDocument()
    );

    fireEvent.change(startDateControl, {
      target: { value: '1.12.2023' },
    });
    fireEvent.blur(startDateControl);

    await waitFor(() =>
      expect(screen.queryByText('Kentän tyyppi on virheellinen')).not.toBeInTheDocument()
    );

    fireEvent.change(endDateControl, {
      target: { value: '1.11.2023' },
    });
    fireEvent.blur(endDateControl);

    await waitFor(() =>
      expect(screen.queryByText('Ensimmäinen mahdollinen päivä on 1.12.2023')).toBeInTheDocument()
    );

    fireEvent.change(endDateControl, {
      target: { value: '1.12.2023' },
    });
    fireEvent.blur(endDateControl);

    await waitFor(() =>
      expect(
        screen.queryByText('Ensimmäinen mahdollinen päivä on 1.12.2023')
      ).not.toBeInTheDocument()
    );
  });

  test('Yhteystiedot can be filled', async () => {
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI-1" />);

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

    await user.click(screen.getByRole('button', { name: 'Lisää rakennuttajia' }));
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
