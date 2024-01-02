import React from 'react';
import { rest } from 'msw';
import { FORMFIELD, HankeDataFormState } from './types';
import HankeForm from './HankeForm';
import HankeFormContainer from './HankeFormContainer';
import { HANKE_VAIHE, HANKE_TYOMAATYYPPI } from '../../types/hanke';
import {
  render,
  cleanup,
  fireEvent,
  waitFor,
  screen,
  act,
  within,
} from '../../../testUtils/render';
import hankkeet from '../../mocks/data/hankkeet-data';
import { server } from '../../mocks/test-server';
import { HankeAttachmentMetadata } from '../hankeAttachments/types';
import api from '../../api/api';
import * as hankeAttachmentsApi from '../hankeAttachments/hankeAttachmentsApi';

afterEach(cleanup);

jest.setTimeout(30000);

const DUMMY_DATA = 'dummy_file_data';

const TEST_FILES = [
  new File([DUMMY_DATA], 'file.pdf', { type: 'application/pdf' }),
  new File([DUMMY_DATA], 'file.jpg', { type: 'image/jpg' }),
  new File([DUMMY_DATA], 'file.jpeg', { type: 'image/jpeg' }),
  new File([DUMMY_DATA], 'file.png', { type: 'image/png' }),
  new File([DUMMY_DATA], 'file.dgn', { type: 'image/vnd.dgn' }),
  new File([DUMMY_DATA], 'file.dwg', { type: 'image/vnd.dwg' }),
  new File([DUMMY_DATA], 'file.docx', {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }),
  new File([DUMMY_DATA], 'file.txt', { type: 'text/plain' }),
  new File([DUMMY_DATA], 'file.gt', { type: 'application/octet-stream' }),
];

async function uploadAttachment({
  hankeTunnus,
  file,
  abortSignal,
}: {
  hankeTunnus: string;
  file: File;
  abortSignal?: AbortSignal;
}) {
  const { data } = await api.post<HankeAttachmentMetadata>(
    `/hankkeet/${hankeTunnus}/liitteet`,
    { liite: file },
    {
      signal: abortSignal,
    },
  );
  return data;
}

function initFileGetResponse(response: HankeAttachmentMetadata[]) {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/liitteet', async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(response));
    }),
  );
}

function initFileUploadResponse() {
  server.use(
    rest.post('/api/hankkeet/:hankeTunnus/liitteet', async (req, res, ctx) => {
      return res(ctx.delay(), ctx.status(200));
    }),
  );
}

function initFileDeleteResponse() {
  server.use(
    rest.delete('/api/hankkeet/:hankeTunnus/liitteet/:attachmentId', async (req, res, ctx) => {
      return res(ctx.status(200));
    }),
  );
}

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
  omistajat: [],
  rakennuttajat: [],
  toteuttajat: [],
  muut: [],
  tyomaaTyyppi: [HANKE_TYOMAATYYPPI.AKILLINEN_VIKAKORJAUS],
  nimi: 'testi kuoppa',
  kuvaus: 'testi kuvaus',
};

async function setupAlueetPage() {
  const hanke = hankkeet[2];

  const { user } = render(
    <HankeForm
      formData={hanke as HankeDataFormState}
      onIsDirtyChange={() => ({})}
      onFormClose={() => ({})}
    >
      <></>
    </HankeForm>,
  );

  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  expect(screen.queryByText('Vaihe 2/6: Alueet')).toBeInTheDocument();

  return { user };
}

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

    expect(screen.queryByText('Vaihe 1/6: Perustiedot')).toBeInTheDocument();
    expect(screen.queryByText('Kentän pituus oltava vähintään 3 merkkiä')).toBeInTheDocument();
  });

  test('Should allow next page if hanke name is set', async () => {
    const { user } = render(<HankeFormContainer />);
    fireEvent.change(screen.getByRole('textbox', { name: /hankkeen nimi/i }), {
      target: { value: nimi },
    });

    await user.click(screen.getByRole('button', { name: /seuraava/i }));
    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    expect(screen.queryByText('Vaihe 3/6: Haitat')).toBeInTheDocument();
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

  test('Nuisance and hindrance estimates for an area are correct', async () => {
    await setupAlueetPage();

    // Area name
    expect(screen.getByTestId('alueet.0.nimi')).toHaveValue('Hankealue 1');
    // Start date of the nuisance
    expect(screen.getByDisplayValue('2.1.2023')).toBeInTheDocument();
    // End date of the nuisance
    expect(screen.getByDisplayValue('24.2.2023')).toBeInTheDocument();
    // Noise nuisance
    expect(screen.getByText('Satunnainen haitta')).toBeInTheDocument();
    // Dust nuisance
    expect(screen.getByText('Lyhytaikainen toistuva haitta')).toBeInTheDocument();
    // Vibration nuisance
    expect(screen.getByText('Pitkäkestoinen jatkuva haitta')).toBeInTheDocument();
    // Lane hindrance
    expect(screen.getByText('Vähentää kaistan yhdellä ajosuunnalla')).toBeInTheDocument();
    // Hindrance affecting lane length
    expect(screen.getByText('Alle 10 m')).toBeInTheDocument();
  });

  test('Yhteystiedot can be filled', async () => {
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-1" />);

    // Hanke owner (accordion open by default)
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

    // Rakennuttaja
    await user.click(screen.getByText(/rakennuttajan tiedot/i));
    await user.click(screen.getByText(/lisää rakennuttaja/i));
    expect(screen.getAllByText('Rakennuttaja')).toHaveLength(1);

    await user.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
    await user.click(screen.getByText(/yksityishenkilö/i));
    expect(screen.getAllByLabelText(/y-tunnus/i)[1]).toBeDisabled();

    await user.click(screen.getByText(/lisää rakennuttaja/i)); // add second rakennuttaja
    expect(screen.getAllByText('Rakennuttaja')).toHaveLength(2);
    await user.click(screen.getAllByText(/poista rakennuttaja/i)[1]); // remove second rakennuttaja
    await user.click(screen.getByText(/poista rakennuttaja/i)); // remove first (and last) rakennuttaja
    expect(screen.queryByText('Rakennuttaja')).not.toBeInTheDocument();

    // Check Other types are present and clickable
    await user.click(screen.getByText(/toteuttajan tiedot/i));
    await user.click(screen.getByText(/muiden tahojen tiedot/i));
  });

  test('Should be able to save and quit', async () => {
    const hanke = hankkeet[1];
    const hankeName = hanke.nimi;

    const { user } = render(
      <HankeForm
        formData={hanke as HankeDataFormState}
        onIsDirtyChange={() => ({})}
        onFormClose={() => ({})}
      >
        children
      </HankeForm>,
    );

    fillBasicInformation({ name: hankeName });
    await user.click(screen.getByRole('button', { name: 'Tallenna ja keskeytä' }));

    expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
    expect(screen.getByText(`Hanke ${hankeName} (HAI22-2) tallennettu omiin hankkeisiin.`));
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

  test('Should be able to upload attachments', async () => {
    jest.spyOn(hankeAttachmentsApi, 'uploadAttachment').mockImplementation(uploadAttachment);
    initFileGetResponse([]);
    initFileUploadResponse();
    const { user } = render(<HankeFormContainer hankeTunnus="HAI22-2" />);
    await waitFor(() => screen.findByText('Perustiedot'));
    await user.click(screen.getByRole('button', { name: /liitteet/i }));

    user.upload(screen.getByLabelText('Raahaa tiedostot tänne'), TEST_FILES);

    await waitFor(() => screen.findAllByText('Tallennetaan tiedostoja'));
    await act(async () => {
      waitFor(() => expect(screen.queryAllByText('Tallennetaan tiedostoja')).toHaveLength(0));
    });
    await waitFor(() => {
      expect(screen.queryByText('9/9 tiedosto(a) tallennettu')).toBeInTheDocument();
    });
  });

  test('Should be able to delete attachments', async () => {
    const fileName = 'File1.png';
    initFileGetResponse([
      {
        id: '8a77c842-3d6b-42df-8ed0-7d1493a2c011',
        fileName,
        createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800285',
        createdAt: '2023-10-06T13:51:42.995157Z',
        hankeTunnus: 'HAI22-2',
      },
    ]);
    initFileDeleteResponse();
    const { user } = render(<HankeFormContainer hankeTunnus="HAI22-2" />);
    await waitFor(() => screen.findByText('Perustiedot'));
    await user.click(screen.getByRole('button', { name: /liitteet/i }));

    const { getAllByRole } = within(screen.getByTestId('file-upload-list'));
    const fileListItems = getAllByRole('listitem');
    const fileItem = fileListItems.find((i) => i.innerHTML.includes(fileName));
    const { getByRole } = within(fileItem!);
    await user.click(getByRole('button', { name: 'Poista' }));
    const { getByRole: getByRoleInDialog, getByText: getByTextInDialog } = within(
      screen.getByRole('dialog'),
    );

    expect(
      getByTextInDialog(`Haluatko varmasti poistaa liitetiedoston ${fileName}`),
    ).toBeInTheDocument();
    await user.click(getByRoleInDialog('button', { name: 'Poista' }));
    expect(screen.getByText(`Liitetiedosto ${fileName} poistettu`)).toBeInTheDocument();
  });

  test('Should list existing attachments in the attachments page and in summary page', async () => {
    const fileNameA = 'File1.png';
    const fileNameB = 'File2.pdf';
    const fileNameC = 'File3.jpg';
    initFileGetResponse([
      {
        id: '8a77c842-3d6b-42df-8ed0-7d1493a2c011',
        fileName: fileNameA,
        createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800285',
        createdAt: new Date().toISOString(),
        hankeTunnus: 'HAI22-2',
      },
      {
        id: '8a77c842-3d6b-42df-8ed0-7d1493a2c015',
        fileName: fileNameB,
        createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800285',
        createdAt: '2023-11-07T13:51:42.995157Z',
        hankeTunnus: 'HAI22-2',
      },
      {
        id: '8a77c842-3d6b-42df-8ed0-7d1493a2c016',
        fileName: fileNameC,
        createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800285',
        createdAt: new Date().toISOString(),
        hankeTunnus: 'HAI22-2',
      },
    ]);
    const { user } = render(<HankeFormContainer hankeTunnus="HAI22-2" />);
    await waitFor(() => screen.findByText('Perustiedot'));
    await user.click(screen.getByRole('button', { name: /liitteet/i }));

    const { getAllByRole } = within(screen.getByTestId('file-upload-list'));
    const fileListItems = getAllByRole('listitem');
    expect(fileListItems.length).toBe(3);

    const fileItemA = fileListItems.find((i) => i.innerHTML.includes(fileNameA));
    const { getByText: getByTextInA } = within(fileItemA!);
    expect(getByTextInA('Lisätty tänään')).toBeInTheDocument();

    const fileItemB = fileListItems.find((i) => i.innerHTML.includes(fileNameB));
    const { getByText: getByTextInB } = within(fileItemB!);
    expect(getByTextInB('Lisätty 7.11.2023')).toBeInTheDocument();

    const fileItemC = fileListItems.find((i) => i.innerHTML.includes(fileNameC));
    const { getByText: getByTextInC } = within(fileItemC!);
    expect(getByTextInC('Lisätty tänään')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

    expect(screen.getByText('Vaihe 6/6: Yhteenveto')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: fileNameA })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: fileNameB })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: fileNameC })).toBeInTheDocument();
  });

  test('Summary page should handle not filled data gracefully', async () => {
    const testAlue = {
      ...hankkeet[1]?.alueet?.[0],
      kaistaHaitta: null,
      kaistaPituusHaitta: null,
      meluHaitta: null,
      polyHaitta: null,
      tarinaHaitta: null,
    };
    const testHanke = {
      ...hankkeet[0],
      alueet: [testAlue],
    };

    const { user } = render(
      <HankeForm
        formData={testHanke as HankeDataFormState}
        onIsDirtyChange={() => ({})}
        onFormClose={() => ({})}
      >
        children
      </HankeForm>,
    );

    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));
    await waitFor(() => expect(screen.queryByText(/vaihe 6\/6: yhteenveto/i)).toBeInTheDocument());
    expect(screen.queryByText(/meluhaitta: -/i)).toBeInTheDocument();
    expect(screen.queryByText(/pölyhaitta: -/i)).toBeInTheDocument();
    expect(screen.queryByText(/tärinähaitta: -/i)).toBeInTheDocument();
    expect(screen.queryByText(/autoliikenteen kaistahaitta: -/i)).toBeInTheDocument();
    expect(screen.queryByText(/kaistahaittojen pituus: -/i)).toBeInTheDocument();
    expect(screen.queryByText(/muokkaa hanketta lisätäksesi tietoja/i)).toBeInTheDocument();
  });
});

describe('New contact person form', () => {
  function fillNewContactPersonForm(
    options: {
      etunimi?: string;
      sukunimi?: string;
      sahkoposti?: string;
      puhelinnumero?: string;
    } = {},
  ) {
    const {
      etunimi = 'Matti',
      sukunimi = 'Meikäläinen',
      sahkoposti = 'matti.meikalainen@test.com',
      puhelinnumero = '0401234567',
    } = options;
    fireEvent.change(screen.getByLabelText(/etunimi/i), {
      target: { value: etunimi },
    });
    fireEvent.change(screen.getByLabelText(/sukunimi/i), {
      target: { value: sukunimi },
    });
    fireEvent.change(screen.getAllByLabelText(/sähköposti/i)[1], {
      target: { value: sahkoposti },
    });
    fireEvent.change(screen.getAllByLabelText(/Puhelinnumero/i)[1], {
      target: { value: puhelinnumero },
    });
  }

  test('Should be able to create new user', async () => {
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-1" />);
    await user.click(screen.getByRole('button', { name: /lisää uusi yhteyshenkilö/i }));
    fillNewContactPersonForm();
    await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));

    expect(screen.getByText('Yhteyshenkilö tallennettu')).toBeInTheDocument();
  });

  test('Should not be able to create new user and show validation errors if info is not filled', async () => {
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-1" />);
    await user.click(screen.getByRole('button', { name: /lisää uusi yhteyshenkilö/i }));
    await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));

    expect(screen.getAllByText('Kenttä on pakollinen')).toHaveLength(4);
    expect(screen.queryByText('Yhteyshenkilö tallennettu')).not.toBeInTheDocument();
  });

  test('Should show error notification if creating new user fails', async () => {
    server.use(
      rest.post('/api/hankkeet/:hankeTunnus/kayttajat', async (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-1" />);
    await user.click(screen.getByRole('button', { name: /lisää uusi yhteyshenkilö/i }));
    fillNewContactPersonForm();
    await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));

    expect(screen.getByText('Yhteyshenkilön tallennus epäonnistui')).toBeInTheDocument();
  });
});
