import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '../../testUtils/render';
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import { HankeData } from '../types/hanke';
import hankkeet from '../mocks/data/hankkeet-data';
import { server } from '../mocks/test-server';
import { rest } from 'msw';
import {
  Application,
  ApplicationAttachmentMetadata,
  KaivuilmoitusData,
} from '../application/types/application';
import * as applicationAttachmentsApi from '../application/attachments';
import applications from '../mocks/data/hakemukset-data';
import {
  initApplicationAttachmentGetResponse,
  uploadApplicationAttachmentMock,
} from '../../testUtils/helperFunctions';

afterEach(cleanup);

jest.setTimeout(40000);

async function fillBasicInformation(
  user: UserEvent,
  options: {
    name?: string;
    description?: string;
    existingCableReport?: string;
    cableReports?: string[];
    placementContracts?: string[];
    requiredCompetence?: boolean;
  } = {},
) {
  const {
    name = 'Kaivuilmoitus',
    description = 'Testataan kaivuilmoituslomaketta',
    existingCableReport = 'JS2300001',
    cableReports = ['JS2300003'],
    placementContracts = ['SL0000001'],
    requiredCompetence = true,
  } = options;

  fireEvent.change(screen.getByLabelText(/työn nimi/i), {
    target: { value: name },
  });

  fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
    target: { value: description },
  });

  fireEvent.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));

  if (existingCableReport) {
    await screen.findAllByLabelText(/tehtyjen johtoselvitysten tunnukset/i);
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Tehtyjen johtoselvitysten tunnukset: Sulje ja avaa valikko',
      }),
    );
    fireEvent.click(screen.getByText(existingCableReport));
  }

  for (const cableReport of cableReports) {
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: cableReport },
    });
    await user.keyboard('{Enter}');
  }

  for (const placementContract of placementContracts) {
    fireEvent.change(screen.getByLabelText('Sijoitussopimustunnus'), {
      target: { value: placementContract },
    });
    fireEvent.click(screen.getByRole('button', { name: /lisää/i }));
  }

  if (requiredCompetence) {
    // Check 'Työhön vaadittava pätevyys' checkbox
    fireEvent.click(screen.getByRole('checkbox', { name: /työstä vastaavana/i }));
  }
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

  const fileUploads = screen.getAllByLabelText('Raahaa tiedostot tänne');
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

test('Should be able fill perustiedot and save form', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user);
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.queryAllByText(/hakemus tallennettu/i).length).toBe(2);
  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
});

test('Should not be able to save form if work name is missing', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user, { name: '' });
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.getByText('Vaihe 1/3: Perustiedot')).toBeInTheDocument();
  expect(screen.queryAllByText('Kenttä on pakollinen').length).toBe(1);
});

test('Should show error message if saving fails', async () => {
  server.use(
    rest.post('/api/hakemukset', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user);
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.getByText('Vaihe 1/3: Perustiedot')).toBeInTheDocument();
  expect(screen.getAllByText(/tallentaminen epäonnistui/i)[0]).toBeInTheDocument();
});

test('Should be able to upload attachments', async () => {
  const uploadSpy = jest
    .spyOn(applicationAttachmentsApi, 'uploadAttachment')
    .mockImplementation(uploadApplicationAttachmentMock);
  initApplicationAttachmentGetResponse([]);
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(
    <KaivuilmoitusContainer
      hankeData={hankeData}
      application={applications[4] as Application<KaivuilmoitusData>}
    />,
  );
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
  const attachmentMetadata: ApplicationAttachmentMetadata[] = [
    {
      id: '8a77c842-3d6b-42df-8ed0-7d1493a2c015',
      fileName: 'liikennejärjestelyt.pdf',
      contentType: 'application/pdf',
      size: 123456789,
      createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800286',
      createdAt: '2023-12-01T13:51:42.995157Z',
      applicationId: 1,
      attachmentType: 'LIIKENNEJARJESTELY',
    },
    {
      id: '8a77c842-3d6b-42df-8ed0-7d1493a2c016',
      fileName: 'valtakirja.pdf',
      contentType: 'application/pdf',
      size: 123456789,
      createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800286',
      createdAt: new Date().toISOString(),
      applicationId: 1,
      attachmentType: 'VALTAKIRJA',
    },
    {
      id: '8a77c842-3d6b-42df-8ed0-7d1493a2c017',
      fileName: 'muu.png',
      contentType: 'image/png',
      size: 123456,
      createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800286',
      createdAt: '2023-10-07T13:51:42.995157Z',
      applicationId: 1,
      attachmentType: 'MUU',
    },
  ];
  initApplicationAttachmentGetResponse(attachmentMetadata);
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(
    <KaivuilmoitusContainer
      hankeData={hankeData}
      application={applications[4] as Application<KaivuilmoitusData>}
    />,
  );
  await user.click(screen.getByRole('button', { name: /liitteet/i }));

  const fileUploadLists = screen.getAllByTestId('file-upload-list');
  let index = 0;
  for (const fileUploadList of fileUploadLists) {
    const metadata = attachmentMetadata[index++];
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

test('Should list existing attachments in the attachments page', async () => {
  const fileNameA = 'test-file-a.pdf';
  const fileNameB = 'test-file-b.pdf';
  const fileNameC = 'test-file-c.png';
  initApplicationAttachmentGetResponse([
    {
      id: '8a77c842-3d6b-42df-8ed0-7d1493a2c015',
      fileName: fileNameA,
      contentType: 'application/pdf',
      size: 123456789,
      createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800286',
      createdAt: '2023-12-01T13:51:42.995157Z',
      applicationId: 1,
      attachmentType: 'LIIKENNEJARJESTELY',
    },
    {
      id: '8a77c842-3d6b-42df-8ed0-7d1493a2c016',
      fileName: fileNameB,
      contentType: 'application/pdf',
      size: 123456789,
      createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800286',
      createdAt: new Date().toISOString(),
      applicationId: 1,
      attachmentType: 'VALTAKIRJA',
    },
    {
      id: '8a77c842-3d6b-42df-8ed0-7d1493a2c017',
      fileName: fileNameC,
      contentType: 'image/png',
      size: 123456,
      createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800286',
      createdAt: '2023-10-07T13:51:42.995157Z',
      applicationId: 1,
      attachmentType: 'MUU',
    },
  ]);
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(
    <KaivuilmoitusContainer
      hankeData={hankeData}
      application={applications[4] as Application<KaivuilmoitusData>}
    />,
  );
  await user.click(screen.getByRole('button', { name: /liitteet/i }));

  const fileUploadList = screen.getAllByTestId('file-upload-list');
  expect(fileUploadList.length).toBe(3);
  fileUploadList.forEach((list, index) => {
    const { getAllByRole } = within(list);
    const fileListItems = getAllByRole('listitem');
    expect(fileListItems.length).toBe(1);
    switch (index) {
      case 0: {
        // traffic arrangement plan attachments
        const fileItemA = fileListItems.find((i) => i.innerHTML.includes(fileNameA));
        const { getByText: getByTextInA } = within(fileItemA!);
        expect(getByTextInA('Lisätty 1.12.2023')).toBeInTheDocument();
        expect(getByTextInA('(117.7 MB)')).toBeInTheDocument();
        break;
      }
      case 1: {
        // mandate attachments
        const fileItemB = fileListItems.find((i) => i.innerHTML.includes(fileNameB));
        const { getByText: getByTextInB } = within(fileItemB!);
        expect(getByTextInB('Lisätty tänään')).toBeInTheDocument();
        expect(getByTextInB('(117.7 MB)')).toBeInTheDocument();
        break;
      }
      case 2: {
        // other attachments
        const fileItemC = fileListItems.find((i) => i.innerHTML.includes(fileNameC));
        const { getByText: getByTextInC } = within(fileItemC!);
        expect(getByTextInC('Lisätty 7.10.2023')).toBeInTheDocument();
        expect(getByTextInC('(121 KB)')).toBeInTheDocument();
        break;
      }
    }
  });
});

test('Should show filled information in summary page', async () => {
  initApplicationAttachmentGetResponse([
    {
      id: '8a77c842-3d6b-42df-8ed0-7d1493a2c015',
      fileName: 'liikennejärjestelyt.pdf',
      contentType: 'application/pdf',
      size: 123456789,
      createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800286',
      createdAt: '2023-12-01T13:51:42.995157Z',
      applicationId: 1,
      attachmentType: 'LIIKENNEJARJESTELY',
    },
    {
      id: '8a77c842-3d6b-42df-8ed0-7d1493a2c016',
      fileName: 'valtakirja.pdf',
      contentType: 'application/pdf',
      size: 123456789,
      createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800286',
      createdAt: new Date().toISOString(),
      applicationId: 1,
      attachmentType: 'VALTAKIRJA',
    },
    {
      id: '8a77c842-3d6b-42df-8ed0-7d1493a2c017',
      fileName: 'muu.png',
      contentType: 'image/png',
      size: 123456,
      createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800286',
      createdAt: '2023-10-07T13:51:42.995157Z',
      applicationId: 1,
      attachmentType: 'MUU',
    },
  ]);
  const name = 'Kaivuilmoitus testi';
  const description = 'Testataan yhteenvetosivua';
  const existingCableReport = 'JS2300001';
  const cableReports = ['JS2300002', 'JS2300003', 'JS2300004'];
  const placementContracts = ['SL0000001', 'SL0000002'];
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user, {
    name,
    description,
    existingCableReport,
    cableReports,
    placementContracts,
  });
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  await fillAttachments(user, {
    trafficArrangementPlanFiles: [
      new File(['liikennejärjestelyt'], 'liikennejärjestelyt.pdf', { type: 'application/pdf' }),
    ],
    mandateFiles: [new File(['valtakirja'], 'valtakirja.pdf', { type: 'application/pdf' })],
    otherFiles: [new File(['muu'], 'muu.png', { type: 'image/png' })],
    additionalInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  });
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.getByText('Vaihe 3/3: Yhteenveto')).toBeInTheDocument();

  // Basic information
  expect(screen.getByText(name)).toBeInTheDocument();
  expect(screen.getByText(description)).toBeInTheDocument();
  expect(
    screen.getByText(`${existingCableReport}, ${cableReports.join(', ')}`),
  ).toBeInTheDocument();
  expect(screen.getByText(placementContracts.join(', '))).toBeInTheDocument();
  expect(screen.getByText('Kyllä')).toBeInTheDocument();

  // Attachments and additional info
  expect(screen.getByText('liikennejärjestelyt.pdf')).toBeInTheDocument();
  expect(screen.getByText('valtakirja.pdf')).toBeInTheDocument();
  expect(screen.getByText('muu.png')).toBeInTheDocument();
  expect(
    screen.getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
  ).toBeInTheDocument();
});
