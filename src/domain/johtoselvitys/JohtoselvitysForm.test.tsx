import { http, HttpResponse } from 'msw';
import { render, cleanup, fireEvent, screen, waitFor, within } from '../../testUtils/render';
import Johtoselvitys from '../../pages/Johtoselvitys';
import JohtoselvitysContainer from './JohtoselvitysContainer';
import { waitForLoadingToFinish } from '../../testUtils/helperFunctions';
import { server } from '../mocks/test-server';
import { HankeData } from '../types/hanke';
import hankkeet from '../mocks/data/hankkeet-data';
import applications from '../mocks/data/hakemukset-data';
import * as hakemuksetDB from '../mocks/data/hakemukset';
import { JohtoselvitysFormValues } from './types';
import api from '../api/api';
import {
  Application,
  ApplicationArea,
  ApplicationAttachmentMetadata,
  AttachmentType,
  JohtoselvitysData,
} from '../application/types/application';
import * as applicationAttachmentsApi from '../application/attachments';
import { fillNewContactPersonForm } from '../forms/components/testUtils';
import { SignedInUser } from '../hanke/hankeUsers/hankeUser';
import { cloneDeep } from 'lodash';
import { waitForElementToBeRemoved } from '@testing-library/react';

afterEach(cleanup);

interface DateOptions {
  start?: string;
  end?: string;
}

const DUMMY_AREAS = applications[0].applicationData.areas;

const application: JohtoselvitysFormValues = {
  id: null,
  alluStatus: null,
  applicationType: 'CABLE_REPORT',
  hankeTunnus: 'HAI22-2',
  applicationData: {
    applicationType: 'CABLE_REPORT',
    name: '',
    customerWithContacts: null,
    areas: DUMMY_AREAS as ApplicationArea[],
    startTime: null,
    endTime: null,
    workDescription: '',
    contractorWithContacts: null,
    postalAddress: null,
    representativeWithContacts: null,
    propertyDeveloperWithContacts: null,
    constructionWork: false,
    maintenanceWork: false,
    emergencyWork: false,
    propertyConnectivity: false,
    rockExcavation: null,
  },
};

const ATTACHMENT_META: ApplicationAttachmentMetadata = {
  id: '808d3b46-d813-4b19-b437-2b3873e77cd9',
  fileName: 'testFile.pdf',
  contentType: 'application/pdf',
  size: 5678901,
  createdByUserId: 'testUser',
  createdAt: '2023-11-14 09:45:40.867232',
  applicationId: 1,
  attachmentType: 'LIIKENNEJARJESTELY',
};

function fillBasicInformation() {
  fireEvent.change(screen.getByLabelText(/työn nimi/i), {
    target: { value: 'Johtoselvitys' },
  });

  fireEvent.change(screen.getAllByLabelText(/katuosoite/i)[0], {
    target: { value: 'Mannerheimintie 5' },
  });

  fireEvent.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));

  fireEvent.click(screen.getByTestId('excavationYes'));

  fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
    target: { value: 'Testataan johtoselvityslomaketta' },
  });
}

function fillAreasInformation(options: DateOptions = {}) {
  const { start = '1.4.2024', end = '1.6.2024' } = options;

  fireEvent.change(screen.getByLabelText(/työn arvioitu alkupäivä/i), {
    target: { value: start },
  });
  fireEvent.change(screen.getByLabelText(/työn arvioitu loppupäivä/i), {
    target: { value: end },
  });
}

async function fillContactsInformation() {
  // Fill customer info
  fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
  fireEvent.click(screen.getAllByText(/yksityishenkilö/i)[0]);
  fireEvent.change(screen.getAllByRole('combobox', { name: /nimi/i })[0], {
    target: { value: 'Veera Vastaava' },
  });
  fireEvent.change(screen.getByTestId('applicationData.customerWithContacts.customer.email'), {
    target: { value: 'veera.vastaava@test.com' },
  });
  fireEvent.change(screen.getByTestId('applicationData.customerWithContacts.customer.phone'), {
    target: { value: '0000000000' },
  });
  fireEvent.click(screen.getAllByRole('button', { name: /yhteyshenkilöt/i })[0]);
  fireEvent.click(screen.getAllByText(/tauno testinen/i)[0]);

  // Fill contractor info
  fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
  fireEvent.click(screen.getAllByText(/yritys/i)[1]);
  fireEvent.change(screen.getAllByRole('combobox', { name: /nimi/i })[1], {
    target: { value: 'Yritys 2 Oy' },
  });
  fireEvent.change(
    screen.getByTestId('applicationData.contractorWithContacts.customer.registryKey'),
    {
      target: { value: '7126070-7' },
    },
  );
  fireEvent.change(screen.getByTestId('applicationData.contractorWithContacts.customer.email'), {
    target: { value: 'yritys2@test.com' },
  });
  fireEvent.change(screen.getByTestId('applicationData.contractorWithContacts.customer.phone'), {
    target: { value: '0000000000' },
  });
  fireEvent.click(screen.getAllByRole('button', { name: /yhteyshenkilöt/i })[1]);
  fireEvent.click(screen.getByText('Matti Meikäläinen (matti.meikalainen@test.com)'));
}

test('Cable report application form can be filled', async () => {
  server.use(
    http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
      return HttpResponse.json<SignedInUser>({
        hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        kayttooikeustaso: 'KATSELUOIKEUS',
        kayttooikeudet: ['VIEW'],
      });
    }),
  );

  const hankeData = hankkeet[1] as HankeData;

  const { user } = render(
    <JohtoselvitysContainer hankeData={hankeData} application={application} />,
  );

  expect(
    await screen.findByText(
      'Aidasmäentien vesihuollon rakentaminen (HAI22-2)',
      {},
      { timeout: 5000 },
    ),
  ).toBeInTheDocument();

  // Fill basic information page
  fillBasicInformation();

  // Move to areas page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  expect(await screen.findByText('Vaihe 2/5: Alueiden piirto')).toBeInTheDocument();

  // Fill areas page
  fillAreasInformation();

  // Move to contacts page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  expect(await screen.findByText('Vaihe 3/5: Yhteystiedot')).toBeInTheDocument();

  // Fill contacts page
  await fillContactsInformation();

  // Move to attachments page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  expect(await screen.findByText('Vaihe 4/5: Liitteet')).toBeInTheDocument();

  // Move to summary page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  expect(await screen.findByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();
});

test('Should show error message when saving fails', async () => {
  server.use(
    http.post('/api/hakemukset', async () => {
      return HttpResponse.json({ errorMessage: 'Failed for testing purposes' }, { status: 500 });
    }),
  );

  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus?hanke=HAI22-2');

  await waitForLoadingToFinish();

  // Fill basic information page, so that form can be saved for the first time
  fillBasicInformation();

  // Move to next page to save form
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  await waitFor(
    () => expect(screen.queryAllByText(/tallentaminen epäonnistui/i)[0]).toBeInTheDocument(),
    { timeout: 5000 },
  );
});

test('Should be able to send application', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const hakemus = cloneDeep(applications[0] as Application<JohtoselvitysData>);
  const { user } = render(<JohtoselvitysContainer hankeData={hankeData} application={hakemus} />);
  await user.click(await screen.findByRole('button', { name: /yhteenveto/i }));
  await user.click(screen.getByRole('button', { name: /lähetä hakemus/i }));

  expect(await screen.findByText(/lähetä hakemus\?/i)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /vahvista/i }));

  expect(await screen.findByText(/hakemus lähetetty/i)).toBeInTheDocument();
});

test('Should show error message when sending fails', async () => {
  server.use(
    http.post('/api/hakemukset/:id/laheta', async () => {
      return HttpResponse.json({ errorMessage: 'Failed for testing purposes' }, { status: 500 });
    }),
  );

  const hankeData = hankkeet[1] as HankeData;
  const hakemus = cloneDeep(applications[0] as Application<JohtoselvitysData>);
  const { user } = render(<JohtoselvitysContainer hankeData={hankeData} application={hakemus} />);

  await user.click(await screen.findByRole('button', { name: /yhteenveto/i }));
  await user.click(screen.getByRole('button', { name: /lähetä hakemus/i }));

  expect(await screen.findByText(/lähetä hakemus\?/i)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /vahvista/i }));

  expect(await screen.findByText(/lähettäminen epäonnistui/i)).toBeInTheDocument();
});

test('Save and quit works', async () => {
  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus?hanke=HAI22-2');

  await waitForLoadingToFinish();

  // Fill basic information page
  fillBasicInformation();

  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(await screen.findAllByText(/hakemus tallennettu/i)).toHaveLength(2);
  expect(window.location.pathname).toBe(`/fi/hakemus/${(await hakemuksetDB.readAll()).length}`);
});

test('Should not save and quit if current form page is not valid', async () => {
  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus');

  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(window.location.pathname).toBe('/fi/johtoselvityshakemus');
  expect(await screen.findAllByText('Kenttä on pakollinen')).toHaveLength(5);
});

test('Should show error message and not navigate away when save and quit fails', async () => {
  server.use(
    http.post('/api/hakemukset', async () => {
      return HttpResponse.json({ errorMessage: 'Failed for testing purposes' }, { status: 500 });
    }),
  );

  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus?hanke=HAI22-2');
  await waitForLoadingToFinish();

  fillBasicInformation();
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(await screen.findAllByText(/tallentaminen epäonnistui/i)).toHaveLength(2);
  expect(window.location.pathname).toBe('/fi/johtoselvityshakemus');
});

test('Should not save application between page changes when nothing is changed', async () => {
  const { user } = render(
    <JohtoselvitysContainer application={applications[3] as Application<JohtoselvitysData>} />,
  );

  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).not.toBeInTheDocument();
});

test('Should save existing application between page changes when there are changes', async () => {
  const { user } = render(
    <JohtoselvitysContainer application={applications[3] as Application<JohtoselvitysData>} />,
  );

  fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
    target: { value: 'Muokataan johtoselvitystä' },
  });

  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(await screen.findByText(/hakemus tallennettu/i)).toBeInTheDocument();
});

test('Should not show send button when application has moved to pending state', async () => {
  server.use(
    http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
      return HttpResponse.json<SignedInUser>({
        hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        kayttooikeustaso: 'KATSELUOIKEUS',
        kayttooikeudet: ['VIEW'],
      });
    }),
  );

  const { user } = render(
    <JohtoselvitysContainer application={applications[1] as Application<JohtoselvitysData>} />,
  );

  await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

  expect(await screen.findByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /lähetä hakemus/i })).not.toBeInTheDocument();
  expect(
    screen.queryByText(
      'Hakemuksen voi lähettää ainoastaan hakemuksen yhteyshenkilönä oleva henkilö',
    ),
  ).not.toBeInTheDocument();
});

test('Should show and disable send button and show notification when user is not a contact person', async () => {
  server.use(
    http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
      return HttpResponse.json<SignedInUser>({
        hankeKayttajaId: 'not-a-contact-person-id',
        kayttooikeustaso: 'KATSELUOIKEUS',
        kayttooikeudet: ['VIEW'],
      });
    }),
  );

  const { user } = render(
    <JohtoselvitysContainer
      hankeData={hankkeet[1] as HankeData}
      application={applications[0] as Application<JohtoselvitysData>}
    />,
  );

  await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

  expect(await screen.findByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /lähetä hakemus/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /lähetä hakemus/i })).toBeDisabled();
  expect(
    screen.queryAllByText(
      'Hakemuksen voi lähettää ainoastaan hakemuksen yhteyshenkilönä oleva henkilö.',
    ),
  ).toHaveLength(2);
});

test('Should show and enable button when application is edited in draft state and user is a contact person', async () => {
  server.use(
    http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
      return HttpResponse.json<SignedInUser>({
        hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        kayttooikeustaso: 'KATSELUOIKEUS',
        kayttooikeudet: ['VIEW'],
      });
    }),
  );

  const { user } = render(
    <JohtoselvitysContainer
      hankeData={hankkeet[1] as HankeData}
      application={applications[0] as Application<JohtoselvitysData>}
    />,
  );

  await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

  expect(await screen.findByRole('button', { name: /lähetä hakemus/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /lähetä hakemus/i })).toBeEnabled();
  expect(
    screen.queryByText(
      'Hakemuksen voi lähettää ainoastaan hakemuksen yhteyshenkilönä oleva henkilö',
    ),
  ).not.toBeInTheDocument();
});

test('Should not allow start date be after end date', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(
    <JohtoselvitysContainer hankeData={hankeData} application={application} />,
  );

  // Fill basic information page
  fillBasicInformation();

  // Move to areas page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  expect(await screen.findByText('Vaihe 2/5: Alueiden piirto')).toBeInTheDocument();

  // Fill areas page with start time after end time
  fillAreasInformation({ start: '1.6.2024', end: '1.4.2024' });

  // Should not be able to move to next page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  expect(await screen.findByText('Vaihe 2/5: Alueiden piirto')).toBeInTheDocument();
});

test('Should not allow step change when current step is invalid', async () => {
  const { user } = render(
    <JohtoselvitysContainer application={applications[0] as Application<JohtoselvitysData>} />,
  );

  // Move to contacts page
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  // Change registry key to be invalid
  fireEvent.change(
    await screen.findByTestId('applicationData.customerWithContacts.customer.registryKey'),
    {
      target: { value: '1234567-8' },
    },
  );

  // Try to move previous, next and basic information page
  await user.click(screen.getByRole('button', { name: /edellinen/i }));
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  await user.click(screen.getByRole('button', { name: /perustiedot/i }));

  // Expect to still be in the same page
  expect(await screen.findByText('Vaihe 3/5: Yhteystiedot')).toBeInTheDocument();
  expect(screen.queryByText('Kentän arvo on virheellinen')).toBeInTheDocument();
});

test('Validation error is shown if no work is about checkbox is selected', async () => {
  const { user } = render(<JohtoselvitysContainer />);

  await user.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));
  await user.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));
  expect(screen.queryByText('Kenttä on pakollinen')).toBeInTheDocument();

  await user.click(screen.getByLabelText(/olemassaolevan rakenteen kunnossapitotyöstä/i));
  expect(screen.queryByText('Kenttä on pakollinen')).not.toBeInTheDocument();
  await user.click(screen.getByLabelText(/olemassaolevan rakenteen kunnossapitotyöstä/i));
  expect(await screen.findByText('Kenttä on pakollinen')).toBeInTheDocument();

  await user.click(screen.getByLabelText(/kiinteistöliittymien rakentamisesta/i));
  expect(screen.queryByText('Kenttä on pakollinen')).not.toBeInTheDocument();
  await user.click(screen.getByLabelText(/kiinteistöliittymien rakentamisesta/i));
  expect(await screen.findByText('Kenttä on pakollinen')).toBeInTheDocument();

  await user.click(
    screen.getByLabelText(
      /kaivutyö on aloitettu ennen johtoselvityksen tilaamista merkittävien vahinkojen välttämiseksi/i,
    ),
  );
  expect(screen.queryByText('Kenttä on pakollinen')).not.toBeInTheDocument();
  await user.click(
    screen.getByLabelText(
      /kaivutyö on aloitettu ennen johtoselvityksen tilaamista merkittävien vahinkojen välttämiseksi/i,
    ),
  );
  expect(screen.queryByText('Kenttä on pakollinen')).toBeInTheDocument();
});

async function uploadAttachmentMock({
  applicationId,
  attachmentType,
  file,
  abortSignal,
}: {
  applicationId: number;
  attachmentType: AttachmentType;
  file: File;
  abortSignal?: AbortSignal;
}) {
  const { data } = await api.post<ApplicationAttachmentMetadata>(
    `/hakemukset/${applicationId}/liitteet?tyyppi=${attachmentType}`,
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
    .spyOn(applicationAttachmentsApi, 'uploadAttachment')
    .mockImplementation(uploadAttachmentMock);
  initFileGetResponse([]);
  const { user } = render(
    <JohtoselvitysContainer application={applications[0] as Application<JohtoselvitysData>} />,
  );
  await user.click(screen.getByRole('button', { name: /liitteet/i }));
  const fileUpload = await screen.findByLabelText('Raahaa tiedostot tänne');
  await user.upload(fileUpload, [
    new File(['test-a'], 'test-file-a.pdf', { type: 'application/pdf' }),
    new File(['test-b'], 'test-file-b.pdf', { type: 'application/pdf' }),
  ]);

  await waitForElementToBeRemoved(() => screen.queryAllByText(/Tallennetaan tiedostoja/i), {
    timeout: 10000,
  });
  await waitFor(
    () => {
      expect(screen.queryByText('2/2 tiedosto(a) tallennettu')).toBeInTheDocument();
    },
    { timeout: 5000 },
  );
  expect(uploadSpy).toHaveBeenCalledTimes(2);
});

test('Should be able to delete attachments', async () => {
  const fileName = 'test-file-a.png';
  initFileGetResponse([
    {
      id: '8a77c842-3d6b-42df-8ed0-7d1493a2c012',
      fileName,
      contentType: 'image/png',
      size: 7654321,
      createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800286',
      createdAt: '2023-10-05T13:51:42.995157Z',
      applicationId: 1,
      attachmentType: 'MUU',
    },
  ]);
  const { user } = render(
    <JohtoselvitysContainer application={applications[0] as Application<JohtoselvitysData>} />,
  );
  await user.click(screen.getByRole('button', { name: /liitteet/i }));

  const { getAllByRole } = within(await screen.findByTestId('file-upload-list'));
  const fileListItems = getAllByRole('listitem');
  const fileItem = fileListItems.find((i) => i.innerHTML.includes(fileName));
  const { getByRole } = within(fileItem!);
  await user.click(getByRole('button', { name: 'Poista' }));
  const { getByRole: getByRoleInDialog, getByText: getByTextInDialog } = within(
    await screen.findByRole('dialog'),
  );

  expect(
    getByTextInDialog(`Haluatko varmasti poistaa liitetiedoston ${fileName}`),
  ).toBeInTheDocument();
  await user.click(getByRoleInDialog('button', { name: 'Poista' }));
  expect(screen.getByText(`Liitetiedosto ${fileName} poistettu`)).toBeInTheDocument();
});

test('Should list existing attachments in the attachments page and in summary page', async () => {
  const fileNameA = 'test-file-a.png';
  const fileNameB = 'test-file-b.pdf';
  initFileGetResponse([
    {
      id: '8a77c842-3d6b-42df-8ed0-7d1493a2c016',
      fileName: fileNameA,
      contentType: 'image/png',
      size: 123456,
      createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800286',
      createdAt: new Date().toISOString(),
      applicationId: 1,
      attachmentType: 'MUU',
    },
    {
      id: '8a77c842-3d6b-42df-8ed0-7d1493a2c017',
      fileName: fileNameB,
      contentType: 'application/pdf',
      size: 123456789,
      createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800286',
      createdAt: '2023-10-07T13:51:42.995157Z',
      applicationId: 1,
      attachmentType: 'MUU',
    },
  ]);
  const { user } = render(
    <JohtoselvitysContainer application={applications[0] as Application<JohtoselvitysData>} />,
  );
  await user.click(screen.getByRole('button', { name: /liitteet/i }));

  const { getAllByRole } = within(await screen.findByTestId('file-upload-list'));
  const fileListItems = getAllByRole('listitem');
  expect(fileListItems.length).toBe(2);

  const fileItemA = fileListItems.find((i) => i.innerHTML.includes(fileNameA));
  const { getByText: getByTextInA } = within(fileItemA!);
  expect(getByTextInA('Lisätty tänään')).toBeInTheDocument();
  expect(getByTextInA('(121 KB)')).toBeInTheDocument();

  const fileItemB = fileListItems.find((i) => i.innerHTML.includes(fileNameB));
  const { getByText: getByTextInB } = within(fileItemB!);
  expect(getByTextInB('Lisätty 7.10.2023')).toBeInTheDocument();
  expect(getByTextInB('(117.7 MB)')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

  expect(await screen.findByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();
  expect(screen.getByText(fileNameA)).toBeInTheDocument();
  expect(screen.getByText(fileNameB)).toBeInTheDocument();
});

test('Summary should show attachments and they are downloadable', async () => {
  const fetchContentMock = jest
    .spyOn(applicationAttachmentsApi, 'getAttachmentFile')
    .mockImplementation(jest.fn());

  const testApplication = applications[0] as Application<JohtoselvitysData>;
  initFileGetResponse([ATTACHMENT_META]);

  const { user } = render(<JohtoselvitysContainer application={testApplication} />);

  await user.click(screen.getByRole('button', { name: /yhteenveto/i }));
  expect(await screen.findByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();

  await user.click(screen.getByText(ATTACHMENT_META.fileName));

  expect(fetchContentMock).toHaveBeenCalledWith(testApplication.id, ATTACHMENT_META.id);
});

test('Should be able to create new user and new user is added to dropdown', async () => {
  const newUser = {
    etunimi: 'Marja',
    sukunimi: 'Meikäkäinen',
    sahkoposti: 'marja.meikalainen@test.com',
    puhelinnumero: '0000000000',
  };
  const testApplication = applications[0] as Application<JohtoselvitysData>;
  const { user } = render(<JohtoselvitysContainer application={testApplication} />);
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));
  expect(await screen.findByText('Vaihe 3/5: Yhteystiedot')).toBeInTheDocument();
  await user.click(screen.getAllByRole('button', { name: /lisää uusi yhteyshenkilö/i })[0]);
  fillNewContactPersonForm(newUser);
  await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));

  expect(await screen.findByText('Yhteyshenkilö tallennettu')).toBeInTheDocument();
  expect(
    screen.getAllByText(`${newUser.etunimi} ${newUser.sukunimi} (${newUser.sahkoposti})`),
  ).toHaveLength(2);
});

test('Should show validation error if the new user has an existing email address', async () => {
  const newUser = {
    etunimi: 'Marja',
    sukunimi: 'Meikäkäinen',
    sahkoposti: 'matti.meikalainen@test.com',
    puhelinnumero: '0000000000',
  };
  const testApplication = applications[0] as Application<JohtoselvitysData>;
  const { user } = render(<JohtoselvitysContainer application={testApplication} />);
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));
  expect(await screen.findByText('Vaihe 3/5: Yhteystiedot')).toBeInTheDocument();
  await user.click(screen.getAllByRole('button', { name: /lisää uusi yhteyshenkilö/i })[0]);
  fillNewContactPersonForm(newUser);
  await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));
  expect(
    await screen.findByText(
      /valitsemasi sähköpostiosoite löytyy jo hankkeen käyttäjähallinnasta. lisää yhteyshenkilö pudotusvalikosta./i,
    ),
  ).toBeInTheDocument();
});

test('Should show validation error if there are no yhteyshenkilo set for yhteystieto', async () => {
  const testApplication = cloneDeep(applications[0]) as Application<JohtoselvitysData>;
  testApplication.applicationData.customerWithContacts = null;
  const { user } = render(<JohtoselvitysContainer application={testApplication} />);

  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(await screen.findByText('Vaihe 3/5: Yhteystiedot')).toBeInTheDocument();
  expect(
    await screen.findAllByText(/vähintään yksi yhteyshenkilö tulee olla asetettuna/i),
  ).toHaveLength(2);

  await user.click(screen.getAllByRole('button', { name: /yhteyshenkilöt/i })[0]);
  await user.click(screen.getByText('Matti Meikäläinen (matti.meikalainen@test.com)'));
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(
    screen.queryByText(/vähintään yksi yhteyshenkilö tulee olla asetettuna/i),
  ).not.toBeInTheDocument();
});

test('Should remove validation error if yhteyshenkilo is created for yhteystieto', async () => {
  const testApplication = cloneDeep(applications[0]) as Application<JohtoselvitysData>;
  testApplication.applicationData.customerWithContacts = null;
  const { user } = render(<JohtoselvitysContainer application={testApplication} />);

  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));
  const contactButtons = await screen.findAllByLabelText(/yhteyshenkilöt/i);
  await user.click(contactButtons[0]);
  await user.tab();
  await user.tab();

  expect(
    await screen.findAllByText(/vähintään yksi yhteyshenkilö tulee olla asetettuna/i),
  ).toHaveLength(2);

  await user.click(screen.getAllByRole('button', { name: /lisää uusi yhteyshenkilö/i })[0]);
  fillNewContactPersonForm({
    etunimi: 'Matti',
    sukunimi: 'Kymäläinen',
    sahkoposti: 'matti.kymalainen@test.com',
    puhelinnumero: '0000000000',
  });
  await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));

  expect(
    screen.queryByText(/vähintään yksi yhteyshenkilö tulee olla asetettuna/i),
  ).not.toBeInTheDocument();
});

test('Work name should be limited to 100 characters', async () => {
  const { user } = render(<JohtoselvitysContainer />);
  const initialName = 'a'.repeat(99);

  fireEvent.change(screen.getByLabelText(/työn nimi/i), {
    target: {
      value: initialName,
    },
  });
  await user.type(screen.getByLabelText(/työn nimi/i), 'bbb');

  expect(screen.getByLabelText(/työn nimi/i)).toHaveValue(initialName.concat('b'));
});

test('Work description should be limited to 2000 characters', async () => {
  const { user } = render(<JohtoselvitysContainer />);
  const initialDescription = 'a'.repeat(1999);

  fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
    target: {
      value: initialDescription,
    },
  });
  await user.type(screen.getByLabelText(/työn kuvaus/i), 'bbb');

  expect(screen.getByLabelText(/työn kuvaus/i)).toHaveValue(initialDescription.concat('b'));
});

describe('Show correct registry key label', () => {
  const hankeData = hankkeet[1] as HankeData;
  const johtoselvitysApplication = cloneDeep(applications[0] as Application<JohtoselvitysData>);
  const testApplication: Application<JohtoselvitysData> = {
    ...johtoselvitysApplication,
    applicationData: {
      ...johtoselvitysApplication.applicationData,
      customerWithContacts: null,
      contractorWithContacts: null,
      propertyDeveloperWithContacts: null,
      representativeWithContacts: null,
    },
  };

  describe('Customer', () => {
    test('Should show y-tunnus label when type is private person', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is company', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yritys')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is association', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is other', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(
        screen.queryByText('Y-tunnus, henkilötunnus tai muu yksilöivä tunnus'),
      ).not.toBeInTheDocument();
    });

    test('Registry key is not required for company', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yritys')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).not.toBeRequired();
    });

    test('Registry key is not required for association', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).not.toBeRequired();
    });

    test('Registry key is disabled for private person', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).toBeDisabled();
    });

    test('Registry key is disabled for other', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).toBeDisabled();
    });
  });

  describe('Contractor', () => {
    test('Should show y-tunnus label when type is private person', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is company', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yritys')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is association', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is other', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(
        screen.queryByText('Y-tunnus, henkilötunnus tai muu yksilöivä tunnus'),
      ).not.toBeInTheDocument();
    });

    test('Registry key is not required for company', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yritys')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).not.toBeRequired();
    });

    test('Registry key is not required for association', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).not.toBeRequired();
    });

    test('Registry key is disabled for private person', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).toBeDisabled();
    });

    test('Registry key is disabled for other', async () => {
      const { user } = render(
        <JohtoselvitysContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).toBeDisabled();
    });
  });
});
