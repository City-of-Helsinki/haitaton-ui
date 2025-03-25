import { HttpResponse, http } from 'msw';
import { cloneDeep } from 'lodash';
import { server } from '../mocks/test-server';
import {
  Application,
  ApplicationAttachmentMetadata,
  AttachmentType,
  KaivuilmoitusData,
} from '../application/types/application';
import {
  Muutosilmoitus,
  MuutosilmoitusAttachmentMetadata,
} from '../application/muutosilmoitus/types';
import { HankeData } from '../types/hanke';
import { fireEvent, render, screen, waitFor, within } from '../../testUtils/render';
import KaivuilmoitusMuutosilmoitusContainer from './KaivuilmoitusMuutosilmoitusContainer';
import hankkeet from '../mocks/data/hankkeet-data';
import hakemukset from '../mocks/data/hakemukset-data';
import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../common/haittaIndexes/types';
import { UserEvent } from '@testing-library/user-event/index';
import api from '../api/api';
import * as muutosilmoitusAttachmentApi from '../application/muutosilmoitus/muutosilmoitusAttachmentsApi';
import * as applicationAttachmentsApi from '../application/attachments';
import {
  createApplicationAttachments,
  createMuutosilmoitusAttachments,
} from '../mocks/attachments';

const applicationAttachments = createApplicationAttachments(13, [
  { attachmentType: 'LIIKENNEJARJESTELY' },
  { attachmentType: 'MUU' },
]);
const muutosilmoitusAttachments = createMuutosilmoitusAttachments(
  'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
  [
    { attachmentType: 'LIIKENNEJARJESTELY' },
    { attachmentType: 'VALTAKIRJA' },
    { attachmentType: 'MUU' },
  ],
);

function setup(
  options: {
    application?: Application<KaivuilmoitusData>;
    muutosilmoitus?: Muutosilmoitus<KaivuilmoitusData>;
    hankeData?: HankeData;
    responseStatus?: number;
  } = {},
) {
  const {
    application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>,
    muutosilmoitus = {
      id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
      applicationData: application.applicationData,
      sent: new Date('2025-09-01T15:00:00.000Z'),
      liitteet: [],
      muutokset: [],
    },
    hankeData = hankkeet[1] as HankeData,
    responseStatus = 200,
  } = options;
  server.use(
    http.put('/api/muutosilmoitukset/:id', async () => {
      return HttpResponse.json<Muutosilmoitus<KaivuilmoitusData>>(muutosilmoitus, {
        status: responseStatus,
      });
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
    http.post('/api/muutosilmoitukset/:id/laheta', async () => {
      return HttpResponse.json<Application>(
        {
          ...application,
          muutosilmoitus: {
            ...muutosilmoitus,
            sent: new Date(),
          },
        },
        { status: responseStatus },
      );
    }),
    http.delete('/api/muutosilmoitukset/:id', async () => {
      return new HttpResponse(null, { status: responseStatus });
    }),
  );
  return {
    ...render(
      <KaivuilmoitusMuutosilmoitusContainer
        hankeData={hankeData}
        originalApplication={application}
        muutosilmoitus={muutosilmoitus}
      />,
      undefined,
      `/fi/kaivuilmoitus-muutosilmoitus/${application.id}/muokkaa`,
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
    expect(window.location.pathname).toBe(
      `/fi/kaivuilmoitus-muutosilmoitus/${application.id}/muokkaa`,
    );
  });
});

describe('Canceling muutosilmoitus', () => {
  test('Should be able to cancel muutosilmoitus', async () => {
    const application = cloneDeep(hakemukset[13]) as Application<KaivuilmoitusData>;
    const { user } = setup({
      application,
      muutosilmoitus: application.muutosilmoitus!,
      responseStatus: 204,
    });
    await user.click(screen.getByRole('button', { name: /peru muutosilmoitus/i }));
    await user.click(await screen.findByRole('button', { name: /vahvista/i }));

    expect(await screen.findByText('Muutosilmoitus peruttiin')).toBeInTheDocument();
    expect(screen.getByText('Muutosilmoitus peruttiin onnistuneesti')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/fi/hakemus/14');
  });
});

describe('Muutosilmoitus attachments', () => {
  async function uploadAttachmentMock({
    muutosilmoitusId,
    attachmentType,
    file,
    abortSignal,
  }: {
    muutosilmoitusId: string;
    attachmentType: AttachmentType;
    file: File;
    abortSignal?: AbortSignal;
  }) {
    const { data } = await api.post<MuutosilmoitusAttachmentMetadata>(
      `/muutosilmoitukset/${muutosilmoitusId}/liitteet?tyyppi=${attachmentType}`,
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
      .spyOn(muutosilmoitusAttachmentApi, 'uploadAttachment')
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
    await waitFor(
      () => {
        expect(screen.queryAllByText('Tallennetaan tiedostoja')).toHaveLength(0);
      },
      { timeout: 5000 },
    );
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
    testApplication.muutosilmoitus = {
      id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
      sent: null,
      applicationData: testApplication.applicationData,
      muutokset: [],
      liitteet: muutosilmoitusAttachments,
    };
    const { user } = setup({
      application: testApplication,
      muutosilmoitus: testApplication.muutosilmoitus,
    });
    await user.click(screen.getByRole('button', { name: /liitteet/i }));

    muutosilmoitusAttachments.forEach((attachment) => {
      expect(screen.getByText(attachment.fileName)).toBeInTheDocument();
    });

    const fileUploadLists = screen.getAllByTestId('file-upload-list');
    let index = 0;
    for (const fileUploadList of fileUploadLists) {
      const metadata = muutosilmoitusAttachments[index++];
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

describe('Sending muutosilmoitus', () => {
  test('Should be able to send muutosilmoitus', async () => {
    const applicationBase = cloneDeep(hakemukset[13]) as Application<KaivuilmoitusData>;
    const application = {
      ...applicationBase,
      muutosilmoitus: {
        ...applicationBase.muutosilmoitus!,
        sent: null,
        muutokset: ['workDescription'],
      },
    };
    const { user } = setup({
      application: application,
      muutosilmoitus: application.muutosilmoitus,
    });
    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));
    await user.click(screen.getByRole('button', { name: /lähetä muutosilmoitus/i }));
    await user.click(await screen.findByRole('button', { name: /vahvista/i }));

    expect(await screen.findByText('Muutosilmoitus lähetetty')).toBeInTheDocument();
    expect(screen.getByText('Muutosilmoitus on lähetetty käsiteltäväksi.')).toBeInTheDocument();
  });
});
