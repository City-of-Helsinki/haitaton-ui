import { http, HttpResponse, delay } from 'msw';
import { FORMFIELD, HankeDataFormState } from './types';
import HankeForm from './HankeForm';
import HankeFormContainer from './HankeFormContainer';
import { HANKE_VAIHE, HANKE_TYOMAATYYPPI, HankeData } from '../../types/hanke';
import { render, cleanup, fireEvent, waitFor, screen, within } from '../../../testUtils/render';
import hankkeet from '../../mocks/data/hankkeet-data';
import { server } from '../../mocks/test-server';
import { HankeAttachmentMetadata } from '../hankeAttachments/types';
import api from '../../api/api';
import * as hankeAttachmentsApi from '../hankeAttachments/hankeAttachmentsApi';
import { HankeUser } from '../hankeUsers/hankeUser';
import { fillNewContactPersonForm } from '../../forms/components/testUtils';
import { cloneDeep } from 'lodash';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { PathParams } from 'msw/lib/core/utils/matching/matchRequestUrl';
import { Haittojenhallintasuunnitelma } from '../../common/haittojenhallinta/types';

afterEach(cleanup);

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
    http.get('/api/hankkeet/:hankeTunnus/liitteet', async () => {
      return HttpResponse.json(response);
    }),
  );
}

function initFileUploadResponse() {
  server.use(
    http.post('/api/hankkeet/:hankeTunnus/liitteet', async () => {
      await delay();
      return new HttpResponse();
    }),
  );
}

function initFileDeleteResponse() {
  server.use(
    http.delete('/api/hankkeet/:hankeTunnus/liitteet/:attachmentId', async () => {
      return new HttpResponse();
    }),
  );
}

const nimi = 'test kuoppa';
const hankkeenKuvaus = 'Tässä on kuvaus';
const hankkeenOsoite = 'Sankaritie 3';
const updatedHaittojenhallintasuunnitelma = ', johon on lisätty tekstiä.';

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

async function setupAlueetPage(hanke: HankeDataFormState = hankkeet[2] as HankeDataFormState) {
  const { user } = render(
    <HankeForm formData={hanke} onIsDirtyChange={() => ({})} onFormClose={() => ({})}>
      <></>
    </HankeForm>,
  );

  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  expect(await screen.findByText('Vaihe 2/6: Alueet')).toBeInTheDocument();

  return { user };
}

async function setupHaittojenHallintaPage(
  hanke: HankeDataFormState = hankkeet[2] as HankeDataFormState,
) {
  const { user } = render(
    <HankeForm formData={hanke} onIsDirtyChange={() => ({})} onFormClose={() => ({})}>
      <></>
    </HankeForm>,
  );

  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  expect(await screen.findByText('Vaihe 3/6: Haittojen hallinta')).toBeInTheDocument();

  return { user };
}

async function setupYhteystiedotPage(jsx: JSX.Element) {
  const renderResult = render(jsx);

  await waitFor(() => expect(screen.queryByText('Perustiedot')).toBeInTheDocument());
  await renderResult.user.click(screen.getByRole('button', { name: /yhteystiedot/i }));
  await waitFor(() => expect(screen.queryByText(/hankkeen omistajan tiedot/i)).toBeInTheDocument());
  await waitFor(
    () =>
      expect(
        screen.queryByRole('button', { name: /lisää uusi yhteyshenkilö/i }),
      ).toBeInTheDocument(),
    { timeout: 5000 },
  );

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
    expect(screen.queryByText('Kenttä on pakollinen')).toBeInTheDocument();
  });

  test('Should allow next page if hanke name is set', async () => {
    const { user } = render(<HankeFormContainer />);
    fireEvent.change(screen.getByRole('textbox', { name: /hankkeen nimi/i }), {
      target: { value: nimi },
    });

    await user.click(screen.getByRole('button', { name: /seuraava/i }));
    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    expect(await screen.findByText('Vaihe 3/6: Haittojen hallinta')).toBeInTheDocument();
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
    expect(screen.getByText('Satunnainen meluhaitta')).toBeInTheDocument();
    // Dust nuisance
    expect(screen.getByText('Toistuva pölyhaitta')).toBeInTheDocument();
    // Vibration nuisance
    expect(screen.getByText('Jatkuva tärinähaitta')).toBeInTheDocument();
    // Lane hindrance
    expect(
      screen.getByText('Yksi autokaista vähenee - ajosuunta vielä käytössä'),
    ).toBeInTheDocument();
    // Hindrance affecting lane length
    expect(screen.getByText('Alle 10 m')).toBeInTheDocument();
  });

  test('Car traffic nuisance categories are shown correctly on area page', async () => {
    const { user } = await setupAlueetPage();

    await user.click(screen.getByRole('button', { name: /hankealueen liikennehaittaindeksit/i }));
    await user.click(screen.getAllByRole('button', { name: /haittaindeksi/i })[1]);

    expect(screen.getByText('Katuluokka')).toBeVisible();
    expect(screen.getByTestId('test-katuluokka')).toHaveTextContent('3');
    expect(screen.getByText('Autoliikenteen määrä')).toBeVisible();
    expect(screen.getByTestId('test-liikennemaara')).toHaveTextContent('3');
    expect(screen.getByText('Vaikutus autoliikenteen kaistamääriin')).toBeVisible();
    expect(screen.getByTestId('test-kaistahaitta')).toHaveTextContent('3');
    expect(screen.getByText('Autoliikenteen kaistavaikutusten pituus')).toBeVisible();
    expect(screen.getByTestId('test-kaistapituushaitta')).toHaveTextContent('3');
    expect(screen.getByText('Hankkeen kesto')).toBeVisible();
    expect(screen.getByTestId('test-haitanKesto')).toHaveTextContent('3');
  });

  test('Nuisance control plan is shown correctly', async () => {
    await setupHaittojenHallintaPage();

    expect(screen.getByTestId('test-common-nuisances')).toBeInTheDocument();

    expect(screen.getByText('Yleisten haittojen hallintasuunnitelma')).toBeInTheDocument();
    expect(screen.getByTestId('alueet.0.haittojenhallintasuunnitelma.YLEINEN')).toBeRequired();
    expect(
      screen.getByText('Pyöräliikenteelle koituvien haittojen hallintasuunnitelma'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('test-PYORALIIKENNE')).toHaveTextContent('3.5');
    expect(
      screen.getByTestId('alueet.0.haittojenhallintasuunnitelma.PYORALIIKENNE'),
    ).toBeRequired();
    expect(
      screen.getByText('Autoliikenteelle koituvien haittojen hallintasuunnitelma'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('test-AUTOLIIKENNE')).toHaveTextContent('3');
    expect(screen.getByTestId('alueet.0.haittojenhallintasuunnitelma.AUTOLIIKENNE')).toBeRequired();
    expect(screen.getByText('Linja-autojen paikallisliikenne')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Haitaton ei löytänyt tätä kohderyhmää alueelta. Voit tarvittaessa lisätä toimet haittojen hallintaan.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Lisää toimet haittojen hallintaan')).toBeInTheDocument();
    expect(screen.queryByTestId('test-LINJAAUTOLIIKENNE')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('alueet.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('Raitioliikenteelle koituvien haittojen hallintasuunnitelma'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('test-RAITIOLIIKENNE')).toHaveTextContent('2');
    expect(screen.getByText('Muiden haittojen hallintasuunnitelma')).toBeInTheDocument();
    expect(screen.getByTestId('test-meluHaitta')).toHaveTextContent('1');
    expect(screen.getByTestId('test-polyHaitta')).toHaveTextContent('3');
    expect(screen.getByTestId('test-tarinaHaitta')).toHaveTextContent('5');
  });

  test('Car traffic nuisance categories are shown correctly on nuisance control plan page', async () => {
    const { user } = await setupHaittojenHallintaPage();

    await user.click(screen.getByRole('button', { name: /haittaindeksi/i }));

    expect(screen.getByText('Katuluokka')).toBeVisible();
    expect(screen.getByTestId('test-katuluokka')).toHaveTextContent('3');
    expect(screen.getByText('Autoliikenteen määrä')).toBeVisible();
    expect(screen.getByTestId('test-liikennemaara')).toHaveTextContent('3');
    expect(screen.getByText('Vaikutus autoliikenteen kaistamääriin')).toBeVisible();
    expect(screen.getByTestId('test-kaistahaitta')).toHaveTextContent('3');
    expect(screen.getByText('Autoliikenteen kaistavaikutusten pituus')).toBeVisible();
    expect(screen.getByTestId('test-kaistapituushaitta')).toHaveTextContent('3');
    expect(screen.getByText('Hankkeen kesto')).toBeVisible();
    expect(screen.getByTestId('test-haitanKesto')).toHaveTextContent('3');
  });

  test('Non-detected nuisance field is shown correctly on nuisance control plan page', async () => {
    const { user } = await setupHaittojenHallintaPage();

    await user.click(screen.getByRole('button', { name: /lisää toimet haittojen hallintaan/i }));

    expect(screen.getByTestId('test-LINJAAUTOLIIKENNE')).toBeInTheDocument();
    expect(
      screen.getByTestId('alueet.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('alueet.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE'),
    ).not.toBeRequired();
  });

  test('Nuisance control plan is updated correctly', async () => {
    const { user } = await setupHaittojenHallintaPage();
    let haittojenhallintasuunnitelma: Haittojenhallintasuunnitelma;
    server.use(
      http.put<PathParams, HankeData>('/api/hankkeet/:hankeTunnus', async ({ request }) => {
        const hankeData = await request.json();
        haittojenhallintasuunnitelma = hankeData.alueet[0]
          .haittojenhallintasuunnitelma as Haittojenhallintasuunnitelma;
        return HttpResponse.json<HankeData>(hankeData);
      }),
    );

    await user.type(
      screen.getByTestId('alueet.0.haittojenhallintasuunnitelma.YLEINEN'),
      updatedHaittojenhallintasuunnitelma,
    );
    await user.type(
      screen.getByTestId('alueet.0.haittojenhallintasuunnitelma.PYORALIIKENNE'),
      updatedHaittojenhallintasuunnitelma,
    );
    await user.type(
      screen.getByTestId('alueet.0.haittojenhallintasuunnitelma.AUTOLIIKENNE'),
      updatedHaittojenhallintasuunnitelma,
    );
    await user.type(
      screen.getByTestId('alueet.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE'),
      updatedHaittojenhallintasuunnitelma,
    );
    await user.type(
      screen.getByTestId('alueet.0.haittojenhallintasuunnitelma.MUUT'),
      updatedHaittojenhallintasuunnitelma,
    );

    await user.click(screen.getByRole('button', { name: /seuraava/i }));
    // @ts-expect-error updatedHaittojenhallintasuunnitelma is set in the request handler above
    expect(haittojenhallintasuunnitelma.YLEINEN).toBe(
      'Yleisten haittojen hallintasuunnitelma, johon on lisätty tekstiä.',
    );
    // @ts-expect-error updatedHaittojenhallintasuunnitelma is set in the request handler above
    expect(haittojenhallintasuunnitelma.PYORALIIKENNE).toBe(
      'Pyöräliikenteelle koituvien haittojen hallintasuunnitelma, johon on lisätty tekstiä.',
    );
    // @ts-expect-error updatedHaittojenhallintasuunnitelma is set in the request handler above
    expect(haittojenhallintasuunnitelma.AUTOLIIKENNE).toBe(
      'Autoliikenteelle koituvien haittojen hallintasuunnitelma, johon on lisätty tekstiä.',
    );
    // @ts-expect-error updatedHaittojenhallintasuunnitelma is set in the request handler above
    expect(haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE).toBe('');
    // @ts-expect-error updatedHaittojenhallintasuunnitelma is set in the request handler above
    expect(haittojenhallintasuunnitelma.RAITIOLIIKENNE).toBe(
      'Raitioliikenteelle koituvien haittojen hallintasuunnitelma, johon on lisätty tekstiä.',
    );
    // @ts-expect-error updatedHaittojenhallintasuunnitelma is set in the request handler above
    expect(haittojenhallintasuunnitelma.MUUT).toBe(
      'Muiden haittojen hallintasuunnitelma, johon on lisätty tekstiä.',
    );
  });

  test('Yhteystiedot can be filled', async () => {
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-1" />);

    // Hanke owner (accordion open by default)
    // Yritys should be default contact type
    expect(screen.getByText(/yritys/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /tyyppi/i }));
    await user.click(screen.getByText(/yhteisö/i));

    fireEvent.change(screen.getAllByRole('combobox', { name: /nimi/i })[0], {
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
    await user.click(screen.getByText(/lisää rakennuttaja/i));
    expect(screen.getAllByText('Rakennuttaja')).toHaveLength(1);

    await user.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
    await user.click(screen.getByText(/yksityishenkilö/i));
    expect(screen.getAllByLabelText(/y-tunnus/i)[1]).toBeDisabled();

    await user.click(screen.getByText(/lisää rakennuttaja/i)); // add second rakennuttaja
    expect(screen.getAllByText(/(^rakennuttaja$)|(^rakennuttaja \d$)/i)).toHaveLength(2);
    await user.click(screen.getAllByText(/poista rakennuttaja/i)[1]); // remove second rakennuttaja
    await user.click(screen.getByText(/poista rakennuttaja/i)); // remove first (and last) rakennuttaja
    expect(screen.queryByText('Rakennuttaja')).not.toBeInTheDocument();

    // Check Other types are present and clickable
    await user.click(screen.getByText(/toteuttajan tiedot/i));
    await user.click(screen.getByText(/muiden tahojen tiedot/i));
  });

  test('Should be able to save and quit', async () => {
    const hanke = cloneDeep(hankkeet[1]);
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
    const hanke = cloneDeep(hankkeet[2]);

    const { user } = render(
      <HankeForm
        formData={hanke as HankeDataFormState}
        onIsDirtyChange={() => ({})}
        onFormClose={() => ({})}
      >
        children
      </HankeForm>,
    );

    await user.click(await screen.findByRole('button', { name: /yhteenveto/i }));
    await user.click(await screen.findByRole('button', { name: 'Tallenna' }));

    expect(window.location.pathname).toBe(`/fi/hankesalkku/${hanke.hankeTunnus}`);
    expect(
      await screen.findByText(
        `Hanke ${hanke.nimi} (${hanke.hankeTunnus}) tallennettu omiin hankkeisiin.`,
      ),
    );
  });

  test('Should be able to upload attachments', async () => {
    jest.spyOn(hankeAttachmentsApi, 'uploadAttachment').mockImplementation(uploadAttachment);
    initFileGetResponse([]);
    initFileUploadResponse();
    const { user } = render(<HankeFormContainer hankeTunnus="HAI22-1" />);
    await screen.findByText('Perustiedot');
    await user.click(screen.getByRole('button', { name: /liitteet/i }));

    await user.upload(await screen.findByLabelText('Raahaa tiedostot tänne'), TEST_FILES);

    await screen.findAllByText('Tallennetaan tiedostoja');
    await waitForElementToBeRemoved(() => screen.queryAllByText('Tallennetaan tiedostoja'));
    expect(await screen.findByText('9/9 tiedosto(a) tallennettu')).toBeInTheDocument();
  });

  test('Should be able to delete attachments', async () => {
    const fileName = 'File1.png';
    initFileGetResponse([
      {
        id: '8a77c842-3d6b-42df-8ed0-7d1493a2c011',
        fileName,
        contentType: 'image/png',
        size: 123,
        createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800285',
        createdAt: '2023-10-06T13:51:42.995157Z',
        hankeTunnus: 'HAI22-2',
      },
    ]);
    initFileDeleteResponse();
    const { user } = render(<HankeFormContainer hankeTunnus="HAI22-1" />);
    await waitFor(() => screen.findByText('Perustiedot'));
    await user.click(screen.getByRole('button', { name: /liitteet/i }));

    const { findAllByRole } = within(await screen.findByTestId('file-upload-list'));
    const fileListItems = await findAllByRole('listitem');
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
        contentType: 'image/png',
        size: 123,
        createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800285',
        createdAt: new Date().toISOString(),
        hankeTunnus: 'HAI22-2',
      },
      {
        id: '8a77c842-3d6b-42df-8ed0-7d1493a2c015',
        fileName: fileNameB,
        contentType: 'application/pdf',
        size: 123456,
        createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800285',
        createdAt: '2023-11-07T13:51:42.995157Z',
        hankeTunnus: 'HAI22-2',
      },
      {
        id: '8a77c842-3d6b-42df-8ed0-7d1493a2c016',
        fileName: fileNameC,
        contentType: 'image/jpeg',
        size: 123456789,
        createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800285',
        createdAt: new Date().toISOString(),
        hankeTunnus: 'HAI22-2',
      },
    ]);
    const { user } = render(<HankeFormContainer hankeTunnus="HAI22-1" />);
    await waitFor(() => screen.findByText('Perustiedot'));
    await user.click(screen.getByRole('button', { name: /liitteet/i }));

    const { findAllByRole } = within(await screen.findByTestId('file-upload-list'));
    const fileListItems = await findAllByRole('listitem');
    expect(fileListItems.length).toBe(3);

    const fileItemA = fileListItems.find((i) => i.innerHTML.includes(fileNameA));
    const { getByText: getByTextInA } = within(fileItemA!);
    expect(getByTextInA('Lisätty tänään')).toBeInTheDocument();
    expect(getByTextInA('(123 B)')).toBeInTheDocument();

    const fileItemB = fileListItems.find((i) => i.innerHTML.includes(fileNameB));
    const { getByText: getByTextInB } = within(fileItemB!);
    expect(getByTextInB('Lisätty 7.11.2023')).toBeInTheDocument();
    expect(getByTextInB('(121 KB)')).toBeInTheDocument();

    const fileItemC = fileListItems.find((i) => i.innerHTML.includes(fileNameC));
    const { getByText: getByTextInC } = within(fileItemC!);
    expect(getByTextInC('Lisätty tänään')).toBeInTheDocument();
    expect(getByTextInC('(117.7 MB)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

    expect(await screen.findByText('Vaihe 6/6: Yhteenveto')).toBeInTheDocument();
    expect(screen.getByText(fileNameA)).toBeInTheDocument();
    expect(screen.getByText(fileNameB)).toBeInTheDocument();
    expect(screen.getByText(fileNameC)).toBeInTheDocument();
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

  test('Should show missing fields for hanke to be public in each page of the form', async () => {
    const testHanke = {
      ...hankkeet[0],
      kuvaus: '',
      vaihe: null,
    };

    const { user } = render(
      <HankeForm
        formData={testHanke as HankeDataFormState}
        onIsDirtyChange={() => {}}
        onFormClose={() => {}}
      >
        children
      </HankeForm>,
    );

    const draftStateText =
      'Hanke on luonnostilassa. Sen näkyvyys muille hankkeille on rajoitettua, eikä sille voi lisätä hakemuksia. Seuraavat kentät tällä sivulla vaaditaan hankeen julkaisemiseksi:';

    await screen.findByText(draftStateText);
    expect(screen.getByRole('link', { name: /hankkeen kuvaus/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /katuosoite/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /hankkeen vaihe/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/hankkeen kuvaus/i), {
      target: { value: 'Kuvaus' },
    });
    fireEvent.change(screen.getByLabelText(/katuosoite/i), {
      target: { value: 'Katu 1' },
    });
    await user.click(screen.getByRole('radio', { name: 'Ohjelmointi' }));

    expect(screen.queryByText(draftStateText)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    expect(await screen.findByText(draftStateText)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /hankealueet: hankealueen piirtäminen/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    expect(
      await screen.findByText(
        'Hanke on luonnostilassa. Sen näkyvyys muille hankkeille on rajoitettua, eikä sille voi lisätä hakemuksia. Seuraavat tiedot lomakkeella vaaditaan haittojenhallinnan täyttämiseen:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /hankealueet: hankealueen piirtäminen/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    expect(await screen.findByText(draftStateText)).toBeInTheDocument();
    await screen.findByRole('link', { name: /hankkeen omistaja: nimi/i });
    expect(
      screen.getByRole('link', { name: /hankkeen omistaja: sähköposti/i }),
    ).toBeInTheDocument();
  });

  test('Should show pages that have missing information for hanke to be public in summary page', async () => {
    const testHanke = {
      ...hankkeet[0],
      kuvaus: '',
      vaihe: null,
    };

    const { user } = render(
      <HankeForm
        formData={testHanke as HankeDataFormState}
        onIsDirtyChange={() => {}}
        onFormClose={() => {}}
      >
        children
      </HankeForm>,
    );

    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

    await screen.findByText(
      'Hanke on luonnostilassa. Sen näkyvyys muille hankkeille on rajoitettua, eikä sille voi lisätä hakemuksia. Seuraavissa vaiheissa on puuttuvia tietoja:',
    );
    expect(screen.getByRole('listitem', { name: /perustiedot/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /alueet/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /yhteystiedot/i })).toBeInTheDocument();
  });

  test('Should not be able to move to another step if modifying public hanke and leaving missing information', async () => {
    const testHanke = cloneDeep(hankkeet[1]);

    const { user } = render(
      <HankeForm
        formData={testHanke as HankeDataFormState}
        onIsDirtyChange={() => {}}
        onFormClose={() => {}}
      >
        children
      </HankeForm>,
    );

    fireEvent.change(screen.getByLabelText(/hankkeen kuvaus/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/katuosoite/i), {
      target: { value: '' },
    });
    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    expect(screen.queryByText('Vaihe 1/6: Perustiedot')).toBeInTheDocument();
  });

  test('Should show confirmation dialog when deleting hanke area', async () => {
    const hanke = cloneDeep(hankkeet[3] as HankeDataFormState);
    hanke.alueet = hankkeet[2].alueet;
    const { user } = await setupAlueetPage(hanke);

    await user.click(screen.getByRole('button', { name: 'Poista alue' }));

    const { getByRole, getByText } = within(screen.getByRole('dialog'));
    expect(getByText('Haluatko varmasti poistaa hankealueen Hankealue 1?')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Poista' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Peruuta' })).toBeInTheDocument();

    await user.click(getByRole('button', { name: 'Poista' }));

    expect(screen.queryByText(/hankealue 1/i)).not.toBeInTheDocument();
  });

  async function setupHaittaIndexUpdateTest(
    nuisanceResponse = {
      autoliikenne: {
        indeksi: 2.5,
        haitanKesto: 3,
        katuluokka: 3,
        liikennemaara: 3,
        kaistahaitta: 1,
        kaistapituushaitta: 1,
      },
      pyoraliikenneindeksi: 4,
      linjaautoliikenneindeksi: 2,
      raitioliikenneindeksi: 3,
      liikennehaittaindeksi: {
        indeksi: 4,
        tyyppi: 'PYORALIIKENNEINDEKSI',
      },
    },
  ) {
    server.use(
      http.post('/api/haittaindeksit', async () => {
        return HttpResponse.json(nuisanceResponse);
      }),
    );

    const hanke = cloneDeep(hankkeet[2] as HankeDataFormState);
    const feature = new Feature(
      new Polygon([
        [
          [25496559.78, 6672988.05],
          [25496681.62, 6672825.27],
          [25496727.94, 6672856.74],
          [25496595.92, 6673029.09],
          [25496549.25, 6673005.46],
          [25496559.78, 6672988.05],
        ],
      ]),
    );
    hanke.alueet = hanke.alueet?.map((alue) => ({
      ...alue,
      feature,
    }));
    const { user } = await setupAlueetPage(hanke);
    await user.click(
      screen.getByRole('button', { name: 'Hankealueen liikennehaittaindeksit (0-5)' }),
    );
    return { user, feature };
  }

  test('Should show correct haitta indexes for hanke area and updated indexes when updating nuisances', async () => {
    const { user } = await setupHaittaIndexUpdateTest();

    expect(screen.getByTestId('test-pyoraliikenneindeksi')).toHaveTextContent('3.5');
    expect(screen.getByTestId('test-autoliikenneindeksi')).toHaveTextContent('3');
    expect(screen.getByTestId('test-linjaautoliikenneindeksi')).toHaveTextContent('0');
    expect(screen.getByTestId('test-raitioliikenneindeksi')).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: 'Kaistahaittojen pituus *' }));
    await user.click(screen.getByText('10-99 m'));

    expect(screen.getByTestId('test-pyoraliikenneindeksi')).toHaveTextContent('4');
    expect(screen.getByTestId('test-autoliikenneindeksi')).toHaveTextContent('2.5');
    expect(screen.getByTestId('test-linjaautoliikenneindeksi')).toHaveTextContent('2');
    expect(screen.getByTestId('test-raitioliikenneindeksi')).toHaveTextContent('3');
  });

  test('Should show updated haitta indexes when modifying hanke area', async () => {
    const { feature } = await setupHaittaIndexUpdateTest();

    feature.changed();

    await waitFor(() => {
      expect(screen.getByTestId('test-pyoraliikenneindeksi')).toHaveTextContent('4');
      expect(screen.getByTestId('test-autoliikenneindeksi')).toHaveTextContent('2.5');
      expect(screen.getByTestId('test-linjaautoliikenneindeksi')).toHaveTextContent('2');
      expect(screen.getByTestId('test-raitioliikenneindeksi')).toHaveTextContent('3');
    });
  });
});

describe('New contact person form and contact person dropdown', () => {
  test('Should be able to create new user and new user is added to dropdown', async () => {
    const newUser = {
      etunimi: 'Martti',
      sukunimi: 'Mielikäinen',
      sahkoposti: 'martti@test.com',
      puhelinnumero: '0000000000',
    };
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-1" />);
    await user.click(screen.getByRole('button', { name: /lisää uusi yhteyshenkilö/i }));
    fillNewContactPersonForm(newUser);
    await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));

    expect(await screen.findByText('Yhteyshenkilö tallennettu')).toBeInTheDocument();
    expect(
      screen.getByText(`${newUser.etunimi} ${newUser.sukunimi} (${newUser.sahkoposti})`),
    ).toBeInTheDocument();
  });

  test('Should not be able to create new user and show validation errors if info is not filled', async () => {
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-1" />);
    await user.click(screen.getByRole('button', { name: /lisää uusi yhteyshenkilö/i }));
    await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));

    expect(await screen.findAllByText('Kenttä on pakollinen')).toHaveLength(4);
    expect(screen.queryByText('Yhteyshenkilö tallennettu')).not.toBeInTheDocument();
  });

  test('Should not be able to create new user and show validation error if the new user has an existing email address', async () => {
    const newUser = {
      etunimi: 'Martti',
      sukunimi: 'Mielikäinen',
      sahkoposti: 'martti.mielikainen@test.com',
      puhelinnumero: '0000000000',
    };
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-1" />);
    await user.click(screen.getByRole('button', { name: /lisää uusi yhteyshenkilö/i }));
    fillNewContactPersonForm(newUser);
    await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));
    fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));
    await user.click(screen.getByRole('button', { name: /lisää uusi yhteyshenkilö/i }));
    fillNewContactPersonForm(newUser);
    await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));

    expect(
      await screen.findByText(
        'Valitsemasi sähköpostiosoite löytyy jo hankkeen käyttäjähallinnasta. Lisää yhteyshenkilö pudotusvalikosta.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Yhteyshenkilö tallennettu')).not.toBeInTheDocument();
  });

  test('Should show error notification if creating new user fails', async () => {
    server.use(
      http.post('/api/hankkeet/:hankeTunnus/kayttajat', async () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-1" />);
    await user.click(screen.getByRole('button', { name: /lisää uusi yhteyshenkilö/i }));
    fillNewContactPersonForm();
    await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));

    expect(await screen.findByText('Yhteyshenkilön tallennus epäonnistui')).toBeInTheDocument();
  });

  test('Should show all hanke users in the contact person dropdown', async () => {
    const hankeUsers: HankeUser[] = [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        sahkoposti: 'matti.meikalainen@test.com',
        etunimi: 'Matti',
        sukunimi: 'Meikäläinen',
        puhelinnumero: '0401234567',
        kayttooikeustaso: 'KAIKKI_OIKEUDET',
        roolit: [],
        tunnistautunut: true,
        kutsuttu: null,
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        sahkoposti: 'teppo@test.com',
        etunimi: 'Teppo',
        sukunimi: 'Työmies',
        puhelinnumero: '0401234567',
        kayttooikeustaso: 'KAIKKIEN_MUOKKAUS',
        roolit: [],
        tunnistautunut: false,
        kutsuttu: '2024-02-15T19:59:59.999Z',
      },
    ];
    server.use(
      http.get('/api/hankkeet/:hankeTunnus/kayttajat', async () => {
        return HttpResponse.json<{ kayttajat: HankeUser[] }>({ kayttajat: hankeUsers });
      }),
    );

    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-1" />);
    await user.click(screen.getByRole('button', { name: 'Yhteyshenkilöt: Sulje ja avaa valikko' }));

    hankeUsers.forEach((hankeUser) => {
      expect(
        screen.getByText(`${hankeUser.etunimi} ${hankeUser.sukunimi} (${hankeUser.sahkoposti})`),
      ).toBeInTheDocument();
    });
  });
});

describe('Selecting user in user name search input', () => {
  test('Should fill email and phone number when selecting existing user in user name search input', async () => {
    const hankeUsers: HankeUser[] = [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        sahkoposti: 'matti.meikalainen@test.com',
        etunimi: 'Matti',
        sukunimi: 'Meikäläinen',
        puhelinnumero: '0401234567',
        kayttooikeustaso: 'KAIKKI_OIKEUDET',
        roolit: [],
        tunnistautunut: true,
        kutsuttu: null,
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        sahkoposti: 'marja@test.com',
        etunimi: 'Marja',
        sukunimi: 'Marjanen',
        puhelinnumero: '0405554567',
        kayttooikeustaso: 'KAIKKIEN_MUOKKAUS',
        roolit: [],
        tunnistautunut: true,
        kutsuttu: null,
      },
    ];
    server.use(
      http.get('/api/hankkeet/:hankeTunnus/kayttajat', async () => {
        return HttpResponse.json<{ kayttajat: HankeUser[] }>({ kayttajat: hankeUsers });
      }),
    );
    const { user } = await setupYhteystiedotPage(<HankeFormContainer hankeTunnus="HAI22-3" />);
    const omistajaNameInput = screen.getAllByRole('combobox', { name: /nimi/i })[0];
    await user.clear(omistajaNameInput);
    await user.type(omistajaNameInput, 'marja');
    await screen.findByText('Marja Marjanen');
    await user.click(screen.getByText('Marja Marjanen'));

    expect(screen.getByTestId('omistajat.0.email')).toHaveValue('marja@test.com');
    expect(screen.getByTestId('omistajat.0.puhelinnumero')).toHaveValue('0405554567');

    await user.click(screen.getByRole('button', { name: /lisää muu taho/i }));
    const muuTahoNameInput = screen.getAllByRole('combobox', { name: /nimi/i })[1];
    await user.type(muuTahoNameInput, 'matti');
    await screen.findByText('Matti Meikäläinen');
    await user.click(screen.getByText('Matti Meikäläinen'));

    expect(screen.getByTestId('muut.0.email')).toHaveValue('matti.meikalainen@test.com');
    expect(screen.getByTestId('muut.0.puhelinnumero')).toHaveValue('0401234567');
  });
});
