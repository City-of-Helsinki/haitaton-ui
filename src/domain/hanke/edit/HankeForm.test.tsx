import React from 'react';
import { FORMFIELD, HankeDataFormState } from './types';
import HankeForm from './HankeForm';
import HankeFormContainer from './HankeFormContainer';
import { HANKE_VAIHE, HANKE_TYOMAATYYPPI } from '../../types/hanke';
import { render, cleanup, fireEvent, waitFor, screen } from '../../../testUtils/render';
import hankkeet from '../../mocks/data/hankkeet-data';

afterEach(cleanup);

jest.setTimeout(30000);

const nimi = 'test kuoppa';
const hankkeenKuvaus = 'Tässä on kuvaus';
const hankkeenOsoite = 'Sankaritie 3';

function fillBasicInformation(
  options: {
    name?: string;
    description?: string;
    address?: string;
    phase?: 'Ohjelmointi' | 'Suunnittelu' | 'Rakentaminen';
    isYKT?: boolean;
  } = {},
) {
  const {
    name = nimi,
    description = hankkeenKuvaus,
    address = hankkeenOsoite,
    phase = 'Ohjelmointi',
    isYKT = false,
  } = options;

  fireEvent.change(screen.getByLabelText(/hankkeen nimi/i), {
    target: { value: name },
  });
  fireEvent.change(screen.getByLabelText(/hankkeen kuvaus/i), { target: { value: description } });
  fireEvent.change(screen.getByLabelText(/katuosoite/i), {
    target: { value: address },
  });
  fireEvent.click(screen.getByRole('radio', { name: phase }));
  if (isYKT) {
    fireEvent.click(screen.getByRole('checkbox', { name: 'Hanke on YKT-hanke' }));
  }
}

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
  const renderResult = render(jsx);

  await waitFor(() => expect(screen.queryByText('Perustiedot')).toBeInTheDocument());
  await renderResult.user.click(screen.getByRole('button', { name: /yhteystiedot/i }));
  await waitFor(() => expect(screen.queryByText(/hankkeen omistajan tiedot/i)).toBeInTheDocument());

  return renderResult;
}

describe('HankeForm', () => {
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
      >
        child
      </HankeForm>,
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

  test('Should not allow next page if hanke name is not set', async () => {
    const { user } = render(<HankeFormContainer />);

    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    expect(screen.queryByText('Vaihe 1/5: Perustiedot')).toBeInTheDocument();
    expect(screen.queryByText('Kentän pituus oltava vähintään 3 merkkiä')).toBeInTheDocument();
  });

  test('Should allow next page if hanke name is set', async () => {
    const { user } = render(<HankeFormContainer />);
    fireEvent.change(screen.getByRole('textbox', { name: /hankkeen nimi/i }), {
      target: { value: nimi },
    });

    await user.click(screen.getByRole('button', { name: /seuraava/i }));
    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    expect(screen.queryByText('Vaihe 3/5: Haitat')).toBeInTheDocument();
  });

  test('Hanke nimi should be limited to 100 characters and not exceed the limit with additional characters', async () => {
    const { user } = render(<HankeFormContainer />);
    const initialName = 'b'.repeat(90);

    fireEvent.change(screen.getByRole('textbox', { name: /hankkeen nimi/i }), {
      target: { value: initialName },
    });

    await user.type(
      screen.getByRole('textbox', { name: /hankkeen nimi/i }),
      'additional_characters',
    );

    const result = screen.getByRole('textbox', { name: /hankkeen nimi/i });
    expect(result).toHaveValue(initialName.concat('additional'));
  });

  test('Yhteystiedot can be filled', async () => {
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-1" />);

    // Hanke owner
    await user.click(screen.getByRole('button', { name: /tyyppi/i }));
    await user.click(screen.getByText(/yritys/i));

    fireEvent.change(screen.getByTestId('omistajat.0.nimi'), {
      target: { value: 'Omistaja Yritys' },
    });
    fireEvent.change(screen.getByLabelText(/y-tunnus/i), {
      target: { value: 'y-tunnus' },
    });
    fireEvent.change(screen.getByTestId('omistajat.0.email'), {
      target: { value: 'test@mail.com' },
    });
    fireEvent.change(screen.getByTestId('omistajat.0.puhelinnumero'), {
      target: { value: '0401234567' },
    });

    // Hanke owner contact person
    fireEvent.change(screen.getByTestId('omistajat.0.alikontaktit.0.etunimi'), {
      target: { value: 'Olli' },
    });
    fireEvent.change(screen.getByTestId('omistajat.0.alikontaktit.0.sukunimi'), {
      target: { value: 'Omistaja' },
    });
    fireEvent.change(screen.getByTestId('omistajat.0.alikontaktit.0.email'), {
      target: { value: 'foo@bar.com' },
    });
    fireEvent.change(screen.getByTestId('omistajat.0.alikontaktit.0.puhelinnumero'), {
      target: { value: '0507654321' },
    });

    // Rakennuttaja
    await user.click(screen.getByText(/rakennuttajan tiedot/i));
    await user.click(screen.getByText(/lisää rakennuttaja/i));
    expect(screen.getAllByText('Rakennuttaja')).toHaveLength(1);

    await user.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
    await user.click(screen.getByText(/yksityishenkilö/i));
    expect(screen.getAllByLabelText(/y-tunnus/i)[1]).toBeDisabled();

    await user.click(screen.getAllByText(/lisää yhteyshenkilö/i)[1]);
    await user.click(screen.getAllByText(/lisää yhteyshenkilö/i)[1]);
    expect(screen.getAllByRole('tablist')[1].childElementCount).toBe(2); // many contacts can be added

    await user.click(screen.getByText(/poista yhteyshenkilö/i));
    expect(screen.queryByText(/poista yhteyshenkilö/i)).not.toBeInTheDocument(); // cannot remove last one

    await user.click(screen.getByText(/lisää rakennuttaja/i));
    expect(screen.getAllByText('Rakennuttaja')).toHaveLength(2);
    await user.click(screen.getAllByText(/poista rakennuttaja/i)[1]);
    await user.click(screen.getByText(/poista rakennuttaja/i));

    // Check Other types are present and clickable
    await user.click(screen.getByText(/toteuttajan tiedot/i));
    await user.click(screen.getByText(/muiden tahojen tiedot/i));
  });

  test('Should be able to save and quit', async () => {
    const { user } = render(<HankeFormContainer />);

    fillBasicInformation();

    await user.click(screen.getByRole('button', { name: 'Tallenna ja keskeytä' }));

    expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-14');
    expect(screen.getByText(`Hanke ${nimi} (HAI22-14) tallennettu omiin hankkeisiin.`));
  });

  test('Should be able to save hanke in the last page', async () => {
    const hanke = hankkeet[1];

    const { user } = render(
      <HankeForm
        formData={hanke as HankeDataFormState}
        onIsDirtyChange={() => ({})}
        onFormClose={() => ({})}
      >
        children
      </HankeForm>,
    );

    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));
    await user.click(screen.getByRole('button', { name: 'Tallenna' }));

    expect(window.location.pathname).toBe(`/fi/hankesalkku/${hanke.hankeTunnus}`);
    expect(
      screen.getByText(`Hanke ${hanke.nimi} (${hanke.hankeTunnus}) tallennettu omiin hankkeisiin.`),
    );
  });
});
