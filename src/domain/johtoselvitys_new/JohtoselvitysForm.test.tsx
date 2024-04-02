import React from 'react';
import { rest } from 'msw';
import { render, cleanup, fireEvent, screen, waitFor, act, within } from '../../testUtils/render';
import Johtoselvitys from '../../pages/Johtoselvitys';
import JohtoselvitysContainer from './JohtoselvitysContainer';
import { waitForLoadingToFinish } from '../../testUtils/helperFunctions';
import { server } from '../mocks/test-server';
import { HankeData } from '../types/hanke';
import hankkeet from '../mocks/data/hankkeet-data';
import applications from '../mocks/data/hakemukset-data';
import { JohtoselvitysFormValues } from './types';
import api from '../api/api';
import { ApplicationAttachmentMetadata, AttachmentType } from '../application/types/application';
import * as applicationAttachmentsApi from '../application/attachments';
import { fillNewContactPersonForm } from '../forms/components/testUtils';
import { SignedInUser } from '../hanke/hankeUsers/hankeUser';

afterEach(cleanup);

jest.setTimeout(40000);

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
    customerWithContacts: {
      customer: {
        type: 'COMPANY',
        name: 'Test Person',
        country: 'FI',
        email: 'test@test.com',
        phone: '0401234567',
        registryKey: null,
        ovt: null,
        invoicingOperator: null,
        sapCustomerNumber: null,
      },
      contacts: [
        {
          hankekayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          email: 'test@test.com',
          firstName: 'Test',
          lastName: 'Person',
          orderer: true,
          phone: '0401234567',
        },
      ],
    },
    areas: DUMMY_AREAS,
    startTime: null,
    endTime: null,
    workDescription: '',
    contractorWithContacts: {
      customer: {
        type: 'COMPANY',
        name: 'Test Person',
        country: 'FI',
        email: 'test@test.com',
        phone: '0401234567',
        registryKey: null,
        ovt: null,
        invoicingOperator: null,
        sapCustomerNumber: null,
      },
      contacts: [
        {
          hankekayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          email: 'test@test.com',
          firstName: 'Test',
          lastName: 'Person',
          orderer: false,
          phone: '0401234567',
        },
      ],
    },
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

function fillContactsInformation() {
  // Fill customer info
  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
  fireEvent.click(screen.getAllByText(/yritys/i)[0]);
  fireEvent.change(screen.getByTestId('applicationData.customerWithContacts.customer.name'), {
    target: { value: 'Yritys Oy' },
  });
  fireEvent.change(
    screen.getByTestId('applicationData.customerWithContacts.customer.registryKey'),
    {
      target: { value: '2182805-0' },
    },
  );
  fireEvent.change(screen.getByTestId('applicationData.customerWithContacts.customer.email'), {
    target: { value: 'yritys@test.com' },
  });
  fireEvent.change(screen.getByTestId('applicationData.customerWithContacts.customer.phone'), {
    target: { value: '0000000000' },
  });

  // Fill contractor info
  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
  fireEvent.click(screen.getAllByText(/yritys/i)[1]);
  fireEvent.change(screen.getByTestId('applicationData.contractorWithContacts.customer.name'), {
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
}

test('Cable report application form can be filled and saved and sent to Allu', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>({
          hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          kayttooikeustaso: 'KATSELUOIKEUS',
          kayttooikeudet: ['VIEW'],
        }),
      );
    }),
  );

  const hankeData = hankkeet[1] as HankeData;

  const { user } = render(
    <JohtoselvitysContainer hankeData={hankeData} application={application} />,
  );

  expect(
    screen.queryByText('Aidasmäentien vesihuollon rakentaminen (HAI22-2)'),
  ).toBeInTheDocument();

  // Fill basic information page
  fillBasicInformation();

  // Move to areas page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));

  expect(screen.queryByText('Vaihe 2/5: Alueet')).toBeInTheDocument();

  // Fill areas page
  fillAreasInformation();

  // Move to contacts page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));

  expect(screen.queryByText('Vaihe 3/5: Yhteystiedot')).toBeInTheDocument();

  // Fill contacts page
  fillContactsInformation();

  // Move to summary page
  await user.click(screen.getByTestId('hds-stepper-step-4'));

  expect(screen.queryByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /lähetä hakemus/i }));
  expect(screen.queryByText(/hakemus lähetetty/i)).toBeInTheDocument();
  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
});

test('Should show error message when saving fails', async () => {
  server.use(
    rest.post('/api/hakemukset', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus?hanke=HAI22-2');

  await waitForLoadingToFinish();

  // Fill basic information page, so that form can be saved for the first time
  fillBasicInformation();

  // Move to next page to save form
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryAllByText(/tallentaminen epäonnistui/i)[0]).toBeInTheDocument();
});

test('Should show error message when sending fails', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>({
          hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          kayttooikeustaso: 'KATSELUOIKEUS',
          kayttooikeudet: ['VIEW'],
        }),
      );
    }),
    rest.post('/api/hakemukset/:id/laheta', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const hankeData = hankkeet[1] as HankeData;

  const { user } = render(
    <JohtoselvitysContainer hankeData={hankeData} application={application} />,
  );

  // Fill basic information page
  fillBasicInformation();

  // Move to areas page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  expect(screen.queryByText('Vaihe 2/5: Alueet')).toBeInTheDocument();

  // Fill areas page
  fillAreasInformation();

  // Move to contacts page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  expect(screen.queryByText('Vaihe 3/5: Yhteystiedot')).toBeInTheDocument();

  // Fill contacts page
  fillContactsInformation();

  // Move to summary page
  await user.click(screen.getByTestId('hds-stepper-step-4'));
  expect(screen.queryByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /lähetä hakemus/i }));

  expect(screen.queryByText(/lähettäminen epäonnistui/i)).toBeInTheDocument();
});

test('Save and quit works', async () => {
  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus?hanke=HAI22-2');

  await waitForLoadingToFinish();

  // Fill basic information page
  fillBasicInformation();

  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.queryAllByText(/hakemus tallennettu/i).length).toBe(2);
  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
});

test('Should not save and quit if current form page is not valid', async () => {
  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus');

  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(window.location.pathname).toBe('/fi/johtoselvityshakemus');
  expect(screen.queryAllByText('Kenttä on pakollinen').length).toBeGreaterThan(1);
});

test('Should show error message and not navigate away when save and quit fails', async () => {
  server.use(
    rest.post('/api/hakemukset', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus?hanke=HAI22-2');
  await waitForLoadingToFinish();

  fillBasicInformation();
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.getAllByText(/tallentaminen epäonnistui/i).length).toBe(2);
  expect(window.location.pathname).toBe('/fi/johtoselvityshakemus');
});

test('Should not save application between page changes when nothing is changed', async () => {
  const { user } = render(<JohtoselvitysContainer application={applications[3]} />);

  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).not.toBeInTheDocument();

  await user.click(screen.getByTestId('hds-stepper-step-4'));

  expect(screen.queryByText(/hakemus tallennettu/i)).not.toBeInTheDocument();
});

test('Should save existing application between page changes when there are changes', async () => {
  const { user } = render(<JohtoselvitysContainer application={applications[3]} />);

  fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
    target: { value: 'Muokataan johtoselvitystä' },
  });

  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
});

test('Should not show send button when application has moved to pending state', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>({
          hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          kayttooikeustaso: 'KATSELUOIKEUS',
          kayttooikeudet: ['VIEW'],
        }),
      );
    }),
  );

  const { user } = render(<JohtoselvitysContainer application={applications[1]} />);

  await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

  expect(screen.queryByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /lähetä hakemus/i })).not.toBeInTheDocument();
});

test('Should not show send button when user is not a contact person', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>({
          hankeKayttajaId: 'not-a-contact-person-id',
          kayttooikeustaso: 'KATSELUOIKEUS',
          kayttooikeudet: ['VIEW'],
        }),
      );
    }),
  );

  const { user } = render(<JohtoselvitysContainer application={applications[1]} />);

  await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

  expect(screen.queryByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /lähetä hakemus/i })).not.toBeInTheDocument();
});

test('Should show send button when application is edited in draft state and user is a contact person', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>({
          hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          kayttooikeustaso: 'KATSELUOIKEUS',
          kayttooikeudet: ['VIEW'],
        }),
      );
    }),
  );

  const { user } = render(
    <JohtoselvitysContainer hankeData={hankkeet[1] as HankeData} application={applications[0]} />,
  );

  await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

  expect(screen.queryByRole('button', { name: /lähetä hakemus/i })).toBeInTheDocument();
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
  expect(screen.queryByText('Vaihe 2/5: Alueet')).toBeInTheDocument();

  // Fill areas page with start time after end time
  fillAreasInformation({ start: '1.6.2024', end: '1.4.2024' });

  // Should not be able to move to next page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  expect(screen.queryByText('Vaihe 2/5: Alueet')).toBeInTheDocument();
});

test('Should not allow step change when current step is invalid', async () => {
  const { user } = render(<JohtoselvitysContainer application={applications[0]} />);

  // Move to contacts page
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  // Change registry key to be invalid
  fireEvent.change(
    screen.getByTestId('applicationData.customerWithContacts.customer.registryKey'),
    {
      target: { value: '1234567-8' },
    },
  );

  // Try to move previous, next and basic information page
  await user.click(screen.getByRole('button', { name: /edellinen/i }));
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  await user.click(screen.getByRole('button', { name: /perustiedot/i }));

  // Expect to still be in the same page
  expect(screen.queryByText('Vaihe 3/5: Yhteystiedot')).toBeInTheDocument();
  expect(screen.queryByText('Kentän arvo on virheellinen')).toBeInTheDocument();
});

test('Should not show inline notification by default', () => {
  render(<JohtoselvitysContainer application={applications[0]} />);

  expect(screen.queryByTestId('form-notification')).not.toBeInTheDocument();
});

test('Should show inline notification when editing a form that is in pending state', () => {
  render(<JohtoselvitysContainer application={applications[1]} />);

  expect(screen.queryByTestId('form-notification')).toBeInTheDocument();
  expect(screen.queryByText('Olet muokkaamassa jo lähetettyä hakemusta.')).toBeInTheDocument();
  expect(
    screen.queryByText(
      'Hakemusta voit muokata niin kauan, kun sitä ei vielä ole otettu käsittelyyn. Uusi versio hakemuksesta lähtee viranomaiselle automaattisesti lomakkeen tallennuksen yhteydessä.',
    ),
  ).toBeInTheDocument();
});

test('Validation error is shown if no work is about checkbox is selected', async () => {
  const { user } = render(<JohtoselvitysContainer />);

  await user.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));
  await user.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));
  expect(screen.queryByText('Kenttä on pakollinen')).toBeInTheDocument();

  await user.click(screen.getByLabelText(/olemassaolevan rakenteen kunnossapitotyöstä/i));
  expect(screen.queryByText('Kenttä on pakollinen')).not.toBeInTheDocument();
  await user.click(screen.getByLabelText(/olemassaolevan rakenteen kunnossapitotyöstä/i));
  expect(screen.queryByText('Kenttä on pakollinen')).toBeInTheDocument();

  await user.click(screen.getByLabelText(/kiinteistöliittymien rakentamisesta/i));
  expect(screen.queryByText('Kenttä on pakollinen')).not.toBeInTheDocument();
  await user.click(screen.getByLabelText(/kiinteistöliittymien rakentamisesta/i));
  expect(screen.queryByText('Kenttä on pakollinen')).toBeInTheDocument();

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
    rest.get('/api/hakemukset/:id/liitteet', async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(response));
    }),
  );
}

test('Should be able to upload attachments', async () => {
  const uploadSpy = jest
    .spyOn(applicationAttachmentsApi, 'uploadAttachment')
    .mockImplementation(uploadAttachmentMock);
  initFileGetResponse([]);
  const { user } = render(<JohtoselvitysContainer application={applications[0]} />);
  await user.click(screen.getByRole('button', { name: /liitteet/i }));
  const fileUpload = screen.getByLabelText('Raahaa tiedostot tänne');
  user.upload(fileUpload, [
    new File(['test-a'], 'test-file-a.pdf', { type: 'application/pdf' }),
    new File(['test-b'], 'test-file-b.pdf', { type: 'application/pdf' }),
  ]);

  await screen.findAllByText('Tallennetaan tiedostoja', undefined, { timeout: 5000 });
  await act(async () => {
    waitFor(() => expect(screen.queryAllByText('Tallennetaan tiedostoja')).toHaveLength(0));
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
  const { user } = render(<JohtoselvitysContainer application={applications[0]} />);
  await user.click(screen.getByRole('button', { name: /liitteet/i }));

  const { getAllByRole } = within(screen.getByTestId('file-upload-list'));
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
  const { user } = render(<JohtoselvitysContainer application={applications[0]} />);
  await user.click(screen.getByRole('button', { name: /liitteet/i }));

  const { getAllByRole } = within(screen.getByTestId('file-upload-list'));
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

  expect(screen.getByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();
  expect(screen.getByText(fileNameA)).toBeInTheDocument();
  expect(screen.getByText(fileNameB)).toBeInTheDocument();
});

test('Summary should show attachments and they are downloadable', async () => {
  const fetchContentMock = jest
    .spyOn(applicationAttachmentsApi, 'getAttachmentFile')
    .mockImplementation(jest.fn());

  const testApplication = applications[0];
  initFileGetResponse([ATTACHMENT_META]);

  const { user } = render(<JohtoselvitysContainer application={testApplication} />);

  await user.click(screen.getByRole('button', { name: /yhteenveto/i }));
  expect(screen.queryByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();

  await user.click(screen.getByText(ATTACHMENT_META.fileName));

  expect(fetchContentMock).toHaveBeenCalledWith(testApplication.id, ATTACHMENT_META.id);
});

test('Should be able to create new user and new user is added to dropdown', async () => {
  const newUser = {
    etunimi: 'Marja',
    sukunimi: 'Meikäkäinen',
    sahkoposti: 'marja@test.com',
    puhelinnumero: '0000000000',
  };
  const testApplication = applications[0];
  const { user } = render(<JohtoselvitysContainer application={testApplication} />);
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));
  expect(screen.queryByText('Vaihe 3/5: Yhteystiedot')).toBeInTheDocument();
  await user.click(screen.getAllByRole('button', { name: /lisää uusi yhteyshenkilö/i })[0]);
  fillNewContactPersonForm(newUser);
  await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));

  expect(screen.getByText('Yhteyshenkilö tallennettu')).toBeInTheDocument();
  expect(
    screen.getByText(`${newUser.etunimi} ${newUser.sukunimi} (${newUser.sahkoposti})`),
  ).toBeInTheDocument();
});
