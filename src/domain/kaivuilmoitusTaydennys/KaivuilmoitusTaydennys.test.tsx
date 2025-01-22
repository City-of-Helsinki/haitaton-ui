import { cloneDeep } from 'lodash';
import { UserEvent } from '@testing-library/user-event';
import {
  Application,
  ApplicationAttachmentMetadata,
  AttachmentType,
  KaivuilmoitusData,
} from '../application/types/application';
import { HankeData } from '../types/hanke';
import hankkeet from '../mocks/data/hankkeet-data';
import hakemukset from '../mocks/data/hakemukset-data';
import { server } from '../mocks/test-server';
import { HttpResponse, http } from 'msw';
import { Taydennys, TaydennysAttachmentMetadata } from '../application/taydennys/types';
import { act, fireEvent, render, screen, waitFor, within } from '../../testUtils/render';
import KaivuilmoitusTaydennysContainer from './KaivuilmoitusTaydennysContainer';
import { createApplicationAttachments, createTaydennysAttachments } from '../mocks/attachments';
import api from '../api/api';
import * as taydennysAttachmentsApi from '../application/taydennys/taydennysAttachmentsApi';
import * as applicationAttachmentsApi from '../application/attachments';
import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../common/haittaIndexes/types';

const applicationAttachments = createApplicationAttachments(13, [
  { attachmentType: 'LIIKENNEJARJESTELY' },
  { attachmentType: 'MUU' },
]);
const taydennysAttachments = createTaydennysAttachments('c0a1fe7b-326c-4b25-a7bc-d1797762c01d', [
  { attachmentType: 'LIIKENNEJARJESTELY' },
  { attachmentType: 'VALTAKIRJA' },
  { attachmentType: 'MUU' },
]);

function setup(
  options: {
    application?: Application<KaivuilmoitusData>;
    taydennys?: Taydennys<KaivuilmoitusData>;
    hankeData?: HankeData;
    responseStatus?: number;
  } = {},
) {
  const {
    application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>,
    taydennys = {
      id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
      applicationData: application.applicationData,
      muutokset: [],
      liitteet: [],
    },
    hankeData = hankkeet[1] as HankeData,
    responseStatus = 200,
  } = options;
  server.use(
    http.put('/api/taydennykset/:id', async () => {
      return HttpResponse.json<Taydennys<KaivuilmoitusData>>(taydennys, {
        status: responseStatus,
      });
    }),
    http.post('/api/taydennykset/:id/laheta', async () => {
      return HttpResponse.json(application, { status: responseStatus });
    }),
    http.delete('/api/taydennykset/:id', async () => {
      return new HttpResponse(null, { status: responseStatus });
    }),
    http.post('/api/haittaindeksit', async () => {
      return HttpResponse.json<HaittaIndexData>(
        {
          liikennehaittaindeksi: {
            indeksi: 0,
            tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
          },
          pyoraliikenneindeksi: 0,
          autoliikenne: {
            indeksi: 0,
            haitanKesto: 0,
            katuluokka: 0,
            liikennemaara: 0,
            kaistahaitta: 0,
            kaistapituushaitta: 0,
          },
          linjaautoliikenneindeksi: 0,
          raitioliikenneindeksi: 0,
        },
        { status: responseStatus },
      );
    }),
  );
  return {
    ...render(
      <KaivuilmoitusTaydennysContainer
        hankeData={hankeData}
        originalApplication={application}
        taydennys={taydennys}
      />,
      undefined,
      `/fi/kaivuilmoitustaydennys/${application.id}/muokkaa`,
    ),
    application,
  };
}

async function fillAttachments(
  user: UserEvent,
  options: {
    trafficArrangementPlanFiles?: File[];
    mandateFiles?: File[];
    otherFiles?: File[];
    additionalInfo?: string;
  } = {},
) {
  const {
    trafficArrangementPlanFiles = [
      new File(['Liikennejärjestelyt'], 'liikennejärjestelyt.pdf', { type: 'application/pdf' }),
    ],
    mandateFiles = [],
    otherFiles = [],
    additionalInfo = 'Lisätietoja',
  } = options;

  const fileUploads = await screen.findAllByLabelText('Raahaa tiedostot tänne');
  if (trafficArrangementPlanFiles) {
    const fileUpload = fileUploads[0];
    await user.upload(fileUpload, trafficArrangementPlanFiles);
  }

  if (mandateFiles) {
    const fileUpload = fileUploads[1];
    await user.upload(fileUpload, mandateFiles);
  }

  if (otherFiles) {
    const fileUpload = fileUploads[2];
    await user.upload(fileUpload, otherFiles);
  }

  if (additionalInfo) {
    fireEvent.change(screen.getByLabelText(/lisätietoja hakemuksesta/i), {
      target: { value: additionalInfo },
    });
  }
}

describe('Saving the form', () => {
  test('Should be able to save and quit', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

    expect(screen.queryAllByText(/hakemus tallennettu/i).length).toBe(2);
    expect(window.location.pathname).toBe('/fi/hakemus/13');
  });

  test('Should save on page change', async () => {
    const { user } = setup();
    fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
      target: { value: 'Muuttunut kuvaus' },
    });
    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    expect(screen.getByText(/hakemus tallennettu/i)).toBeInTheDocument();
  });

  test('Should show error message if saving fails', async () => {
    const { user } = setup({ responseStatus: 500 });
    fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
      target: { value: 'Muuttunut kuvaus' },
    });
    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    expect(screen.getAllByText(/tallentaminen epäonnistui/i)[0]).toBeInTheDocument();
  });

  test('Should show error message and not navigate away when save and quit fails', async () => {
    const { user, application } = setup({ responseStatus: 500 });
    await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

    expect(await screen.findAllByText(/tallentaminen epäonnistui/i)).toHaveLength(2);
    expect(window.location.pathname).toBe(`/fi/kaivuilmoitustaydennys/${application.id}/muokkaa`);
  });
});

describe('Taydennyspyynto notification', () => {
  test('Should show taydennyspyynto notification', async () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Täydennyspyyntö' })).toBeInTheDocument();
    expect(screen.getByText('Muokkaa hakemusta korjataksesi seuraavat asiat:')).toBeInTheDocument();
  });
});

describe('Canceling taydennys', () => {
  test('Should be able to cancel taydennys', async () => {
    const application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>;
    application.taydennys = {
      id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
      applicationData: application.applicationData,
      muutokset: [],
      liitteet: [],
    };
    const { user } = setup({
      application,
      taydennys: application.taydennys,
    });
    await user.click(screen.getByRole('button', { name: /peru täydennysluonnos/i }));
    await user.click(await screen.findByRole('button', { name: /vahvista/i }));

    expect(await screen.findByText('Täydennysluonnos peruttiin')).toBeInTheDocument();
    expect(screen.getByText('Täydennysluonnos peruttiin onnistuneesti')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/fi/hakemus/13');
  });
});

describe('Taydennys attachments', () => {
  async function uploadAttachmentMock({
    taydennysId,
    attachmentType,
    file,
    abortSignal,
  }: {
    taydennysId: string;
    attachmentType: AttachmentType;
    file: File;
    abortSignal?: AbortSignal;
  }) {
    const { data } = await api.post<TaydennysAttachmentMetadata>(
      `/taydennykset/${taydennysId}/liitteet?tyyppi=${attachmentType}`,
      { liite: file },
      {
        signal: abortSignal,
      },
    );
    return data;
  }

  function initFileGetResponse(response: ApplicationAttachmentMetadata[]) {
    server.use(
      http.get('/api/hakemukset/:id/liitteet', async () => {
        return HttpResponse.json(response);
      }),
    );
  }

  test('Should be able to upload attachments', async () => {
    const uploadSpy = jest
      .spyOn(taydennysAttachmentsApi, 'uploadAttachment')
      .mockImplementation(uploadAttachmentMock);
    initFileGetResponse([]);
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /liitteet/i }));
    await fillAttachments(user, {
      trafficArrangementPlanFiles: [
        new File(['liikennejärjestelyt'], 'liikennejärjestelyt.pdf', { type: 'application/pdf' }),
      ],
      mandateFiles: [new File(['valtakirja'], 'valtakirja.pdf', { type: 'application/pdf' })],
      otherFiles: [new File(['muu'], 'muu.png', { type: 'image/png' })],
    });
    await act(async () => {
      waitFor(() => expect(screen.queryAllByText('Tallennetaan tiedostoja')).toHaveLength(0));
    });
    await waitFor(
      () => {
        expect(screen.queryAllByText('1/1 tiedosto(a) tallennettu')).toHaveLength(3);
      },
      { timeout: 5000 },
    );
    expect(uploadSpy).toHaveBeenCalledTimes(3);
  });

  test('Should be able to delete attachments', async () => {
    initFileGetResponse([]);
    const testApplication = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>;
    testApplication.taydennys = {
      id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
      applicationData: testApplication.applicationData,
      muutokset: [],
      liitteet: taydennysAttachments,
    };
    const { user } = setup({
      application: testApplication,
      taydennys: testApplication.taydennys,
    });
    await user.click(screen.getByRole('button', { name: /liitteet/i }));

    taydennysAttachments.forEach((attachment) => {
      expect(screen.getByText(attachment.fileName)).toBeInTheDocument();
    });

    const fileUploadLists = screen.getAllByTestId('file-upload-list');
    let index = 0;
    for (const fileUploadList of fileUploadLists) {
      const metadata = taydennysAttachments[index++];
      const { getAllByRole } = within(fileUploadList);
      const fileListItems = getAllByRole('listitem');
      const fileItem = fileListItems.find((i) => i.innerHTML.includes(metadata.fileName));
      const { getByRole } = within(fileItem!);
      await user.click(getByRole('button', { name: 'Poista' }));
      const { getByRole: getByRoleInDialog, getByText: getByTextInDialog } = within(
        await screen.findByRole('dialog'),
      );

      expect(
        getByTextInDialog(`Haluatko varmasti poistaa liitetiedoston ${metadata.fileName}`),
      ).toBeInTheDocument();
      await user.click(getByRoleInDialog('button', { name: 'Poista' }));
      expect(screen.getByText(`Liitetiedosto ${metadata.fileName} poistettu`)).toBeInTheDocument();
    }
  });

  test('Should show original application attachments in attachments page', async () => {
    const fetchContentMock = jest
      .spyOn(applicationAttachmentsApi, 'getAttachmentFile')
      .mockImplementation(jest.fn());
    initFileGetResponse(applicationAttachments);
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /liitteet/i }));

    expect(
      screen.getByText('Alkuperäiset tilapäisiä liikennejärjestelyitä koskevat suunnitelmat'),
    ).toBeInTheDocument();
    expect(screen.getByText('Alkuperäinen valtakirja')).toBeInTheDocument();
    expect(screen.getByText('Alkuperäiset muut liitteet')).toBeInTheDocument();
    applicationAttachments.forEach((attachment) => {
      expect(screen.getByText(attachment.fileName)).toBeInTheDocument();
    });

    await user.click(screen.getByText(applicationAttachments[0].fileName));

    expect(fetchContentMock).toHaveBeenCalledWith(13, applicationAttachments[0].id);
  });
});

describe('Error notification', () => {
  test('Should show fields with errors in notification in perustiedot page', async () => {
    setup();

    expect(
      screen.queryByText('Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:'),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/työn nimi/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));
    fireEvent.click(screen.getByRole('checkbox', { name: /työstä vastaavana/i }));

    expect(
      await screen.findByText(
        'Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /työn nimi/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /työn kuvaus/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /työssä on kyse/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /työhön vaadittava pätevyys/i })).toBeInTheDocument();
  });

  test('Should show fields with errors in notification in alueet page', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /alueet/i }));

    expect(
      screen.queryByText('Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:'),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/työn alkupäivämäärä/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/työn loppupäivämäärä/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/katuosoite/i), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByRole('button', { name: /poista valittu/i }));

    expect(
      await screen.findByText(
        'Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Työn alkupäivämäärä/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Työn loppupäivämäärä/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Työalueet (Hankealue 2): Katuosoite' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Työalueet (Hankealue 2): Työn tarkoitus' }),
    ).toBeInTheDocument();
  });

  test('Should show fields with errors in notification in haittojenhallinta page', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /haittojen hallinta/i }));

    expect(
      screen.queryByText('Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:'),
    ).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.YLEINEN'),
      {
        target: { value: '' },
      },
    );
    fireEvent.change(
      screen.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.PYORALIIKENNE'),
      {
        target: { value: '' },
      },
    );

    expect(
      await screen.findByText(
        'Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Työalueet (Hankealue 2): Toimet työalueiden haittojen hallintaan',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Työalueet (Hankealue 2) Pyöräliikenteen merkittävyys: Toimet työalueiden haittojen hallintaan',
      }),
    ).toBeInTheDocument();
  });

  test('Should show fields with errors in notification in yhteystiedot page', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

    expect(
      screen.queryByText('Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:'),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getAllByRole('combobox', { name: /nimi/i })[0], {
      target: { value: '' },
    });
    fireEvent.change(
      screen.getByTestId('applicationData.customerWithContacts.customer.registryKey'),
      {
        target: { value: '123' },
      },
    );
    fireEvent.change(screen.getByTestId('applicationData.customerWithContacts.customer.email'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByTestId('applicationData.customerWithContacts.customer.phone'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: /poista valittu/i })[0]);

    expect(
      await screen.findByText(
        'Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /työstä vastaava: Vähintään yksi yhteyshenkilö tulee olla asetettuna/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Työstä vastaava: Sähköposti/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Työstä vastaava: Puhelin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Työstä vastaava: Nimi/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Työstä vastaava: Y-tunnus/i })).toBeInTheDocument();
  });
});
