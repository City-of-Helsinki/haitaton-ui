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
/* Highly recommend to revise these tests to use typed constants like so
const hankeData: HankeDataDraft = {
  nimi: 'test kuoppa',
  kuvaus: 'Tässä on kuvaus',
  tyomaaKatuosoite: 'Sankaritie 3',
  alkuPvm: '24.03.2025',
  loppuPvm: '25.03.2025',
  vaihe: 'OHJELMOINTI',
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

    expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-13');
    expect(screen.getByText(`Hanke ${nimi} (HAI22-13) tallennettu omiin hankkeisiin.`));
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
    const fileUpload = screen.getByLabelText('Raahaa tiedostot tänne');
    user.upload(fileUpload, [
      new File(['test-a'], 'test-file-a.png', { type: 'image/png' }),
      new File(['test-b'], 'test-file-b.jpg', { type: 'image/jpg' }),
    ]);

    await waitFor(() => screen.findAllByText('Tallennetaan tiedostoja'));
    await act(async () => {
      waitFor(() => expect(screen.queryAllByText('Tallennetaan tiedostoja')).toHaveLength(0));
    });
    await waitFor(() => {
      expect(screen.queryByText('2/2 tiedosto(a) tallennettu')).toBeInTheDocument();
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
});
