import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { http, HttpResponse } from 'msw';
import { cleanup, fireEvent, render, screen, waitFor, within } from '../../testUtils/render';
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import { HankeData } from '../types/hanke';
import hankkeet from '../mocks/data/hankkeet-data';
import { server } from '../mocks/test-server';
import {
  Application,
  ApplicationAttachmentMetadata,
  ContactType,
  Customer,
  InvoicingCustomer,
  JohtoselvitysData,
  KaivuilmoitusAlue,
  KaivuilmoitusData,
} from '../application/types/application';
import * as applicationAttachmentsApi from '../application/attachments';
import applications from '../mocks/data/hakemukset-data';
import {
  initApplicationAttachmentGetResponse,
  initHaittaindeksitPostResponse,
  uploadApplicationAttachmentMock,
} from '../../testUtils/helperFunctions';
import { cloneDeep } from 'lodash';
import { fillNewContactPersonForm } from '../forms/components/testUtils';
import { SignedInUser } from '../hanke/hankeUsers/hankeUser';
import * as applicationApi from '../application/utils';
import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../common/haittaIndexes/types';
import { HIDDEN_FIELD_VALUE } from '../application/constants';
import * as hakemuksetDB from '../mocks/data/hakemukset';

afterEach(cleanup);

async function fillBasicInformation(
  user: UserEvent,
  options: {
    name?: string;
    description?: string;
    cableReportDone?: boolean;
    rockExcavation?: boolean;
    existingCableReport?: string | null;
    cableReports?: string[];
    placementContracts?: string[];
    requiredCompetence?: boolean;
  } = {},
) {
  const {
    name = 'Kaivuilmoitus',
    description = 'Testataan kaivuilmoituslomaketta',
    cableReportDone = true,
    rockExcavation = null,
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

  if (!cableReportDone) {
    fireEvent.click(screen.getByLabelText(/hae uusi johtoselvitys/i));
    if (rockExcavation === true) {
      fireEvent.click(screen.getByLabelText(/kyllä/i));
    } else if (rockExcavation === false) {
      fireEvent.click(screen.getByLabelText(/ei/i));
    }
  } else {
    fireEvent.click(screen.getByLabelText(/käytä olemassa olevia/i));
    if (existingCableReport) {
      await screen.findAllByLabelText(/tehtyjen johtoselvitysten tunnukset/i);
      fireEvent.click(screen.getByRole('button', { name: /tehtyjen johtoselvitysten tunnukset/i }));
      fireEvent.click(screen.getByText(existingCableReport));
    } else {
      for (const cableReport of cableReports) {
        fireEvent.change(screen.getByLabelText('Johtoselvitystunnus'), {
          target: { value: cableReport },
        });
        fireEvent.click(
          within(
            screen.getByRole('group', {
              name: /käytä olemassa olevia johtoselvityksiä/i,
            }),
          ).getByRole('button', { name: /lisää/i }),
        );
      }
    }
  }

  for (const placementContract of placementContracts) {
    fireEvent.change(screen.getByLabelText('Sijoitussopimustunnus'), {
      target: { value: placementContract },
    });
    fireEvent.click(screen.getByTestId('placementContract-addButton'));
  }

  if (requiredCompetence) {
    // Check 'Työhön vaadittava pätevyys' checkbox
    fireEvent.click(screen.getByRole('checkbox', { name: /työstä vastaavana/i }));
  }
}

function fillAreasInformation(options: { start?: string; end?: string } = {}) {
  const { start = '1.4.2025', end = '1.6.2025' } = options;

  fireEvent.change(screen.getByLabelText(/työn alkupäivämäärä/i), {
    target: { value: start },
  });
  fireEvent.change(screen.getByLabelText(/työn loppupäivämäärä/i), {
    target: { value: end },
  });
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

function fillContactsInformation(
  options: {
    customer?: Customer;
    contractor?: Customer;
    invoicingCustomer?: InvoicingCustomer;
  } = {},
) {
  const {
    customer = {
      name: 'Yritys Oy',
      registryKey: '2182805-0',
      email: ' yritys@test.com',
      phone: '0000000000',
    },
    contractor = {
      name: 'Yritys 2 Oy',
      registryKey: '7126070-7',
      email: ' yritys2@test.com',
      phone: '0000000000',
    },
    invoicingCustomer = {
      name: 'Yritys 3 Oy',
      registryKey: '1234567-1',
      ovt: '123456789012',
      invoicingOperator: '12345',
      customerReference: '6789',
      postalAddress: {
        streetAddress: {
          streetName: 'Katu 1',
        },
        postalCode: '00100',
        city: 'Helsinki',
      },
      email: 'yritys3@test.com',
      phone: '0000000000',
    },
  } = options;

  // Fill customer info
  fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
  fireEvent.click(screen.getAllByText(/yritys/i)[0]);
  fireEvent.change(screen.getAllByRole('combobox', { name: /nimi/i })[0], {
    target: { value: customer.name },
  });
  fireEvent.change(
    screen.getByTestId('applicationData.customerWithContacts.customer.registryKey'),
    {
      target: { value: customer.registryKey },
    },
  );
  fireEvent.change(screen.getByTestId('applicationData.customerWithContacts.customer.email'), {
    target: { value: customer.email },
  });
  fireEvent.change(screen.getByTestId('applicationData.customerWithContacts.customer.phone'), {
    target: { value: customer.phone },
  });
  fireEvent.click(screen.getAllByRole('button', { name: /yhteyshenkilöt/i })[0]);
  fireEvent.click(screen.getAllByText(/tauno testinen/i)[0]);

  // Fill contractor info
  fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
  fireEvent.click(screen.getAllByText(/yritys/i)[1]);
  fireEvent.change(screen.getAllByRole('combobox', { name: /nimi/i })[1], {
    target: { value: contractor.name },
  });
  fireEvent.change(
    screen.getByTestId('applicationData.contractorWithContacts.customer.registryKey'),
    {
      target: { value: contractor.registryKey },
    },
  );
  fireEvent.change(screen.getByTestId('applicationData.contractorWithContacts.customer.email'), {
    target: { value: contractor.email },
  });
  fireEvent.change(screen.getByTestId('applicationData.contractorWithContacts.customer.phone'), {
    target: { value: contractor.phone },
  });
  fireEvent.click(screen.getAllByRole('button', { name: /yhteyshenkilöt/i })[1]);
  fireEvent.click(screen.getByText('Matti Meikäläinen (matti.meikalainen@test.com)'));

  // Fill invoicing customer info
  fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[2]);
  fireEvent.click(screen.getAllByText(/yritys/i)[2]);
  fireEvent.change(screen.getByTestId('applicationData.invoicingCustomer.name'), {
    target: { value: invoicingCustomer.name },
  });
  fireEvent.change(screen.getByTestId('applicationData.invoicingCustomer.registryKey'), {
    target: { value: invoicingCustomer.registryKey },
  });
  fireEvent.change(screen.getByTestId('applicationData.invoicingCustomer.ovt'), {
    target: { value: invoicingCustomer.ovt },
  });
  fireEvent.change(screen.getByTestId('applicationData.invoicingCustomer.invoicingOperator'), {
    target: { value: invoicingCustomer.invoicingOperator },
  });
  fireEvent.change(screen.getByTestId('applicationData.invoicingCustomer.customerReference'), {
    target: { value: invoicingCustomer.customerReference },
  });
  fireEvent.change(
    screen.getByTestId('applicationData.invoicingCustomer.postalAddress.streetAddress.streetName'),
    {
      target: { value: invoicingCustomer.postalAddress.streetAddress.streetName },
    },
  );
  fireEvent.change(
    screen.getByTestId('applicationData.invoicingCustomer.postalAddress.postalCode'),
    {
      target: { value: invoicingCustomer.postalAddress.postalCode },
    },
  );
  fireEvent.change(screen.getByTestId('applicationData.invoicingCustomer.postalAddress.city'), {
    target: { value: invoicingCustomer.postalAddress.city },
  });
  fireEvent.change(screen.getByTestId('applicationData.invoicingCustomer.email'), {
    target: { value: invoicingCustomer.email },
  });
  fireEvent.change(screen.getByTestId('applicationData.invoicingCustomer.phone'), {
    target: { value: invoicingCustomer.phone },
  });
}

test('Should be able fill perustiedot and save form', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user);
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.queryAllByText(/hakemus tallennettu/i).length).toBe(2);
  expect(window.location.pathname).toBe(`/fi/hakemus/${(await hakemuksetDB.readAll()).length}`);
});

test('Should not be able to save form if work name is missing', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user, { name: '' });
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.getByText('Vaihe 1/6: Perustiedot')).toBeInTheDocument();
  expect(screen.queryAllByText('Kenttä on pakollinen').length).toBe(1);
});

test('Should show error message if saving fails', async () => {
  server.use(
    http.post('/api/hakemukset', async () => {
      return HttpResponse.json({ errorMessage: 'Failed for testing purposes' }, { status: 500 });
    }),
  );
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user);
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.getByText('Vaihe 1/6: Perustiedot')).toBeInTheDocument();
  expect(screen.getAllByText(/tallentaminen epäonnistui/i)[0]).toBeInTheDocument();
});

test('Should be able to fill form pages and show filled information in summary page', async () => {
  initHaittaindeksitPostResponse({
    autoliikenne: {
      indeksi: 1.4,
      haitanKesto: 5,
      katuluokka: 1,
      liikennemaara: 1,
      kaistahaitta: 1,
      kaistapituushaitta: 1,
    },
    pyoraliikenneindeksi: 0.0,
    linjaautoliikenneindeksi: 0.0,
    raitioliikenneindeksi: 0.0,
    liikennehaittaindeksi: {
      indeksi: 1.4,
      tyyppi: HAITTA_INDEX_TYPE.AUTOLIIKENNEINDEKSI,
    },
  });
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
  const cableReportDone = true;
  const existingCableReport = 'JS2300001';
  const placementContracts = ['SL0000001', 'SL0000002'];
  const hankeData = hankkeet[1] as HankeData;

  const startDate = '12.1.2023';
  const endDate = '12.11.2024';

  const customer = {
    type: ContactType.COMPANY,
    name: 'Yritys Oy',
    registryKey: '2182805-0',
    registryKeyHidden: false,
    email: 'yritys1@test.com',
    phone: '0000000000',
  };
  const contractor = {
    type: ContactType.COMPANY,
    name: 'Yritys 2 Oy',
    registryKey: '7126070-7',
    registryKeyHidden: false,
    email: 'yritys2@test.com',
    phone: '0000000001',
  };
  const invoicingCustomer = {
    type: ContactType.COMPANY,
    name: 'Yritys 3 Oy',
    registryKey: '1234567-1',
    registryKeyHidden: false,
    ovt: '123456789012',
    invoicingOperator: '12345',
    customerReference: '6789',
    postalAddress: {
      streetAddress: {
        streetName: 'Katu 1',
      },
      postalCode: '00100',
      city: 'Helsinki',
    },
    email: 'yritys3@test.com',
    phone: '0000000002',
  };

  const application: Application<KaivuilmoitusData> = {
    id: 1,
    hankeTunnus: 'HAI22-2',
    alluStatus: null,
    applicationType: 'EXCAVATION_NOTIFICATION',
    applicationData: {
      applicationType: 'EXCAVATION_NOTIFICATION',
      name: '',
      workDescription: '',
      constructionWork: false,
      maintenanceWork: false,
      emergencyWork: false,
      rockExcavation: false,
      cableReportDone: false,
      cableReports: [],
      placementContracts: [],
      requiredCompetence: false,
      areas: cloneDeep(applications[4].applicationData.areas) as KaivuilmoitusAlue[],
      startTime: null,
      endTime: null,
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
    },
  };

  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={application} />,
  );
  await fillBasicInformation(user, {
    name,
    description,
    cableReportDone,
    existingCableReport,
    placementContracts,
  });
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  // Should save form on page change and show notification
  expect(await screen.findByText(/hakemus tallennettu/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));

  expect(await screen.findByText('Vaihe 2/6: Alueiden piirto')).toBeInTheDocument();

  fillAreasInformation({ start: startDate, end: endDate });
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  expect(await screen.findByText('Vaihe 4/6: Yhteystiedot')).toBeInTheDocument();

  fillContactsInformation({ customer, contractor, invoicingCustomer });
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(await screen.findByText('Vaihe 5/6: Liitteet ja lisätiedot')).toBeInTheDocument();

  await fillAttachments(user, {
    trafficArrangementPlanFiles: [
      new File(['liikennejärjestelyt'], 'liikennejärjestelyt.pdf', { type: 'application/pdf' }),
    ],
    mandateFiles: [new File(['valtakirja'], 'valtakirja.pdf', { type: 'application/pdf' })],
    otherFiles: [new File(['muu'], 'muu.png', { type: 'image/png' })],
    additionalInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  });
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(await screen.findByText('Vaihe 6/6: Yhteenveto')).toBeInTheDocument();
  // Basic information
  expect(screen.getByText(name)).toBeInTheDocument();
  expect(screen.getByText(description)).toBeInTheDocument();
  expect(screen.getByText(existingCableReport)).toBeInTheDocument();
  expect(screen.getByText(placementContracts.join(', '))).toBeInTheDocument();
  expect(screen.getByText('Kyllä')).toBeInTheDocument();

  // Areas information
  expect(screen.getByText(startDate)).toBeInTheDocument();
  expect(screen.getByText(endDate)).toBeInTheDocument();
  expect(screen.getByText('Työalue 1 (159 m²)')).toBeInTheDocument();
  expect(screen.getByText('Työalue 2 (31 m²)')).toBeInTheDocument();
  expect(screen.getByText('Pinta-ala: 190 m²')).toBeInTheDocument();
  expect(screen.getByText('Katuosoite: Aidasmäentie 5')).toBeInTheDocument();
  expect(screen.getByText('Työn tarkoitus: Vesi, Viemäri')).toBeInTheDocument();
  expect(screen.getByText('Meluhaitta: Toistuva meluhaitta')).toBeInTheDocument();
  expect(screen.getByText('Pölyhaitta: Jatkuva pölyhaitta')).toBeInTheDocument();
  expect(screen.getByText('Tärinähaitta: Satunnainen tärinähaitta')).toBeInTheDocument();
  expect(
    screen.getByText(
      'Autoliikenteen kaistahaitta: Yksi autokaista vähenee - ajosuunta vielä käytössä',
    ),
  ).toBeInTheDocument();
  expect(screen.getByText('Kaistahaittojen pituus: 10-99 m')).toBeInTheDocument();
  expect(screen.getByText('Lisätietoja alueesta: -')).toBeInTheDocument();

  // Nuisance management
  expect(screen.getByText('Työalueen yleisten haittojen hallintasuunnitelma')).toBeInTheDocument();
  expect(
    screen.getByText('Raitioliikenteelle koituvien työalueen haittojen hallintasuunnitelma'),
  ).toBeInTheDocument();
  expect(
    screen.getByText('Pyöräliikenteelle koituvien työalueen haittojen hallintasuunnitelma'),
  ).toBeInTheDocument();
  expect(
    screen.getByText('Autoliikenteelle koituvien työalueen haittojen hallintasuunnitelma'),
  ).toBeInTheDocument();
  expect(screen.getByText('Muiden työalueen haittojen hallintasuunnitelma')).toBeInTheDocument();
  expect(screen.getByTestId('test-RAITIOLIIKENNE')).toHaveTextContent('1');
  expect(screen.getByTestId('test-PYORALIIKENNE')).toHaveTextContent('3');
  expect(screen.getByTestId('test-AUTOLIIKENNE')).toHaveTextContent('1.4');
  expect(screen.getByTestId('test-LINJAAUTOLIIKENNE')).toHaveTextContent('0');
  expect(screen.getByText('Yleisten haittojen hallintasuunnitelma')).not.toBeVisible();
  expect(
    screen.getByText('Raitioliikenteelle koituvien haittojen hallintasuunnitelma'),
  ).not.toBeVisible();
  expect(
    screen.getByText('Pyöräliikenteelle koituvien haittojen hallintasuunnitelma'),
  ).not.toBeVisible();
  expect(
    screen.getByText('Autoliikenteelle koituvien haittojen hallintasuunnitelma'),
  ).not.toBeVisible();
  expect(
    screen.getByText('Linja-autoliikenteelle koituvien haittojen hallintasuunnitelma'),
  ).not.toBeVisible();
  expect(screen.getByText('Muiden haittojen hallintasuunnitelma')).not.toBeVisible();
  // open "hankealueen haittojen hallinta" accordions
  await user.click(screen.getAllByText('Hankealueen haittojen hallinta')[0]);
  expect(screen.getByText('Yleisten haittojen hallintasuunnitelma')).toBeVisible();
  await user.click(screen.getAllByText('Hankealueen haittojen hallinta')[1]);
  expect(
    screen.getByText('Pyöräliikenteelle koituvien haittojen hallintasuunnitelma'),
  ).toBeVisible();
  await user.click(screen.getAllByText('Hankealueen haittojen hallinta')[2]);
  expect(
    screen.getByText('Autoliikenteelle koituvien haittojen hallintasuunnitelma'),
  ).toBeVisible();
  await user.click(screen.getAllByText('Hankealueen haittojen hallinta')[3]);
  expect(
    screen.getByText('Raitioliikenteelle koituvien haittojen hallintasuunnitelma'),
  ).toBeVisible();
  await user.click(screen.getAllByText('Hankealueen haittojen hallinta')[4]);
  expect(
    screen.getByText('Linja-autoliikenteelle koituvien haittojen hallintasuunnitelma'),
  ).toBeVisible();
  await user.click(screen.getAllByText('Hankealueen haittojen hallinta')[5]);
  expect(screen.getByText('Muiden haittojen hallintasuunnitelma')).toBeVisible();

  // Contacts information
  expect(screen.getByText(customer.name)).toBeInTheDocument();
  expect(screen.getByText(customer.registryKey)).toBeInTheDocument();
  expect(screen.getByText(customer.email)).toBeInTheDocument();
  expect(screen.getByText(customer.phone)).toBeInTheDocument();
  expect(screen.getByText(contractor.name)).toBeInTheDocument();
  expect(screen.getByText(contractor.registryKey)).toBeInTheDocument();
  expect(screen.getByText(contractor.email)).toBeInTheDocument();
  expect(screen.getByText(contractor.phone)).toBeInTheDocument();
  expect(screen.getByText(invoicingCustomer.name)).toBeInTheDocument();
  expect(screen.getByText(invoicingCustomer.registryKey)).toBeInTheDocument();
  expect(screen.getByText(invoicingCustomer.ovt)).toBeInTheDocument();
  expect(screen.getByText(invoicingCustomer.invoicingOperator)).toBeInTheDocument();
  expect(screen.getByText(invoicingCustomer.customerReference)).toBeInTheDocument();
  expect(
    screen.getByText(invoicingCustomer.postalAddress.streetAddress.streetName),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      `${invoicingCustomer.postalAddress.postalCode} ${invoicingCustomer.postalAddress.city}`,
    ),
  ).toBeInTheDocument();
  expect(screen.getByText(invoicingCustomer.email)).toBeInTheDocument();
  expect(screen.getByText(invoicingCustomer.phone)).toBeInTheDocument();

  // Attachments and additional info
  expect(await screen.findByText('liikennejärjestelyt.pdf')).toBeInTheDocument();
  expect(screen.getByText('valtakirja.pdf')).toBeInTheDocument();
  expect(screen.getByText('muu.png')).toBeInTheDocument();
  expect(
    screen.getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
  ).toBeInTheDocument();
});

test('If user selects "Hae uusi johtoselvitys" option, should show "Louhitaanko työn yhteydessä, esimerkiksi kallioperää" selection', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user, {
    cableReportDone: false,
    existingCableReport: null,
    rockExcavation: true,
  });
  await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

  expect(
    screen.getByText('Louhitaanko työn yhteydessä, esimerkiksi kallioperää?: Kyllä'),
  ).toBeInTheDocument();
});

test('If there are no previous cable reports in hanke, user can enter cable report application identifiers using tag input', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user, {
    cableReportDone: true,
    existingCableReport: null,
    cableReports: ['JS2300003'],
  });
  await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

  expect(screen.getByText('JS2300003')).toBeInTheDocument();
});

test('Should show notifications if work areas overlap with johtoselvitys work areas', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[6] as Application<KaivuilmoitusData>);
  const testApplication: Application<KaivuilmoitusData> = {
    ...application,
    applicationData: {
      ...application.applicationData,
      areas: [
        {
          name: 'Hankealue 1',
          hankealueId: 56,
          tyoalueet: [
            {
              geometry: {
                type: 'Polygon',
                crs: {
                  type: 'name',
                  properties: {
                    name: 'urn:ogc:def:crs:EPSG::3879',
                  },
                },
                coordinates: [
                  [
                    [25494635.230971202, 6683913.733669287],
                    [25494643.36179799, 6683920.780385833],
                    [25494636.31508144, 6683928.9112126175],
                    [25494628.184254654, 6683921.864496071],
                    [25494635.230971202, 6683913.733669287],
                  ],
                ],
              },
              area: 115.11530422209897,
              tormaystarkasteluTulos: {
                autoliikenne: {
                  indeksi: 0,
                  haitanKesto: 5,
                  katuluokka: 0,
                  liikennemaara: 0,
                  kaistahaitta: 1,
                  kaistapituushaitta: 1,
                },
                pyoraliikenneindeksi: 0,
                linjaautoliikenneindeksi: 0,
                raitioliikenneindeksi: 0,
                liikennehaittaindeksi: {
                  indeksi: 0,
                  tyyppi: HAITTA_INDEX_TYPE.LINJAAUTOLIIKENNEINDEKSI,
                },
              },
            },
            {
              geometry: {
                type: 'Polygon',
                crs: {
                  type: 'name',
                  properties: {
                    name: 'urn:ogc:def:crs:EPSG::3879',
                  },
                },
                coordinates: [
                  [
                    [25494618.945962217, 6683947.45562766],
                    [25494607.62978715, 6683938.090536971],
                    [25494612.70259224, 6683927.164585924],
                    [25494625.969780233, 6683933.407991625],
                    [25494618.945962217, 6683947.45562766],
                  ],
                ],
              },
              area: 199.55716052596907,
              tormaystarkasteluTulos: {
                autoliikenne: {
                  indeksi: 0,
                  haitanKesto: 5,
                  katuluokka: 0,
                  liikennemaara: 0,
                  kaistahaitta: 1,
                  kaistapituushaitta: 1,
                },
                pyoraliikenneindeksi: 0,
                linjaautoliikenneindeksi: 0,
                raitioliikenneindeksi: 0,
                liikennehaittaindeksi: {
                  indeksi: 0,
                  tyyppi: HAITTA_INDEX_TYPE.LINJAAUTOLIIKENNEINDEKSI,
                },
              },
            },
          ],
          katuosoite: 'Kotikatu 12',
          tyonTarkoitukset: ['VIEMARI', 'SADEVESI'],
          meluhaitta: 'SATUNNAINEN_MELUHAITTA',
          polyhaitta: 'SATUNNAINEN_POLYHAITTA',
          tarinahaitta: 'TOISTUVA_TARINAHAITTA',
          kaistahaitta: 'EI_VAIKUTA',
          kaistahaittojenPituus: 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
          lisatiedot: '',
        },
      ],
    },
  };
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
  );

  await user.click(screen.getByRole('button', { name: /alueiden/i }));

  expect(
    await screen.findByText(
      /työalue ylittää usean johtoselvityksen rajauksen, tee muutosilmoitus./i,
    ),
  ).toBeInTheDocument();
  expect(screen.getByText(/Työalue ylittää johtoselvityksen/i)).toBeInTheDocument();
  const link = screen.getByRole('link', { name: /JS2300001/i });
  expect(link).toHaveAttribute('href', '/fi/hakemus/2');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener');
});

test('Should not show notification if work area is within johtoselvitys work areas union', async () => {
  const newJohtoselvitys = cloneDeep(applications[1] as Application<JohtoselvitysData>);
  const testJohtoselvitys: Application<JohtoselvitysData> = {
    ...newJohtoselvitys,
    applicationData: {
      ...newJohtoselvitys.applicationData,
      areas: [
        {
          geometry: {
            type: 'Polygon',
            crs: {
              type: 'name',
              properties: {
                name: 'urn:ogc:def:crs:EPSG::3879',
              },
            },
            coordinates: [
              [
                [25498574.68585571, 6679312.984220641],
                [25498575.341154203, 6679304.136547383],
                [25498582.939986356, 6679303.918114552],
                [25498582.476817265, 6679313.077998086],
                [25498574.68585571, 6679312.984220641],
              ],
            ],
          },
        },
      ],
    },
  };

  server.use(
    http.get(`/api/hankkeet/:hankeTunnus/hakemukset`, async () => {
      return HttpResponse.json({ applications: [testJohtoselvitys, applications[10]] });
    }),
  );

  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[6] as Application<KaivuilmoitusData>);
  const testApplication: Application<KaivuilmoitusData> = {
    ...application,
    applicationData: {
      ...application.applicationData,
      cableReports: ['JS2300001', 'JS2400005'],
      areas: [
        {
          name: 'Hankealue 1',
          hankealueId: 56,
          tyoalueet: [
            {
              geometry: {
                type: 'Polygon',
                crs: {
                  type: 'name',
                  properties: {
                    name: 'urn:ogc:def:crs:EPSG::3879',
                  },
                },
                coordinates: [
                  [
                    [25498576.5562583, 6679311.2533405945],
                    [25498576.031333327, 6679285.029964675],
                    [25498582.364741784, 6679285.035682811],
                    [25498581.625386678, 6679311.506082247],
                    [25498576.5562583, 6679311.2533405945],
                  ],
                ],
              },
              area: 115.11530422209897,
              tormaystarkasteluTulos: {
                autoliikenne: {
                  indeksi: 0,
                  haitanKesto: 5,
                  katuluokka: 0,
                  liikennemaara: 0,
                  kaistahaitta: 1,
                  kaistapituushaitta: 1,
                },
                pyoraliikenneindeksi: 0,
                linjaautoliikenneindeksi: 0,
                raitioliikenneindeksi: 0,
                liikennehaittaindeksi: {
                  indeksi: 0,
                  tyyppi: HAITTA_INDEX_TYPE.LINJAAUTOLIIKENNEINDEKSI,
                },
              },
            },
          ],
          katuosoite: 'Kotikatu 12',
          tyonTarkoitukset: ['VIEMARI', 'SADEVESI'],
          meluhaitta: 'SATUNNAINEN_MELUHAITTA',
          polyhaitta: 'SATUNNAINEN_POLYHAITTA',
          tarinahaitta: 'TOISTUVA_TARINAHAITTA',
          kaistahaitta: 'EI_VAIKUTA',
          kaistahaittojenPituus: 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
          lisatiedot: '',
        },
      ],
    },
  };
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
  );
  await user.click(screen.getByRole('button', { name: /alueiden/i }));

  expect(
    screen.queryByText(/työalue ylittää usean johtoselvityksen rajauksen, tee muutosilmoitus./i),
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/Työalue ylittää johtoselvityksen/i)).not.toBeInTheDocument();
});

test('Should show validation error if the new user has an existing email address', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const newUser = {
    etunimi: 'Marja',
    sukunimi: 'Meikäkäinen',
    sahkoposti: 'marja.meikalainen@test.com',
    puhelinnumero: '0000000000',
  };
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user);
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  await user.click(screen.getAllByRole('button', { name: /lisää uusi yhteyshenkilö/i })[0]);
  fillNewContactPersonForm(newUser);
  await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));
  await user.click(screen.getAllByRole('button', { name: /lisää uusi yhteyshenkilö/i })[0]);
  fillNewContactPersonForm(newUser);
  await user.click(screen.getByRole('button', { name: /tallenna ja lisää yhteyshenkilö/i }));
  expect(
    await screen.findByText(
      /valitsemasi sähköpostiosoite löytyy jo hankkeen käyttäjähallinnasta. lisää yhteyshenkilö pudotusvalikosta./i,
    ),
  ).toBeInTheDocument();
});

test('Should disable OVT fields if invoicing customer type is not COMPANY or ASSOCIATION', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user);
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[2]);
  fireEvent.click(screen.getByText(/yksityishenkilö/i));

  expect(screen.getByTestId('applicationData.invoicingCustomer.ovt')).toBeDisabled();
  expect(screen.getByTestId('applicationData.invoicingCustomer.invoicingOperator')).toBeDisabled();
});

test('Postal address fields should be required if OVT fields are empty', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user);
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  expect(
    screen.getByTestId('applicationData.invoicingCustomer.postalAddress.streetAddress.streetName'),
  ).toBeRequired();
  expect(
    screen.getByTestId('applicationData.invoicingCustomer.postalAddress.postalCode'),
  ).toBeRequired();
  expect(screen.getByTestId('applicationData.invoicingCustomer.postalAddress.city')).toBeRequired();

  fireEvent.change(screen.getByTestId('applicationData.invoicingCustomer.ovt'), {
    target: { value: '123456789012' },
  });
  fireEvent.change(screen.getByTestId('applicationData.invoicingCustomer.invoicingOperator'), {
    target: { value: '12345' },
  });

  expect(
    screen.getByTestId('applicationData.invoicingCustomer.postalAddress.streetAddress.streetName'),
  ).not.toBeRequired();
  expect(
    screen.getByTestId('applicationData.invoicingCustomer.postalAddress.postalCode'),
  ).not.toBeRequired();
  expect(
    screen.getByTestId('applicationData.invoicingCustomer.postalAddress.city'),
  ).not.toBeRequired();
});

test('OVT fields should be required if postal address fields are empty', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user);
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  expect(screen.getByTestId('applicationData.invoicingCustomer.ovt')).toBeRequired();
  expect(screen.getByTestId('applicationData.invoicingCustomer.invoicingOperator')).toBeRequired();

  fireEvent.change(
    screen.getByTestId('applicationData.invoicingCustomer.postalAddress.streetAddress.streetName'),
    {
      target: { value: 'Katu 1' },
    },
  );
  fireEvent.change(
    screen.getByTestId('applicationData.invoicingCustomer.postalAddress.postalCode'),
    {
      target: { value: '00100' },
    },
  );
  fireEvent.change(screen.getByTestId('applicationData.invoicingCustomer.postalAddress.city'), {
    target: { value: 'Helsinki' },
  });

  expect(screen.getByTestId('applicationData.invoicingCustomer.ovt')).not.toBeRequired();
  expect(
    screen.getByTestId('applicationData.invoicingCustomer.invoicingOperator'),
  ).not.toBeRequired();
});

test('OVT and registryKey fields should be send as null if they are left empty', async () => {
  const applicationUpdateSpy = jest.spyOn(applicationApi, 'updateApplication');
  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[5] as Application<KaivuilmoitusData>);
  const testApplication: Application<KaivuilmoitusData> = {
    ...application,
    applicationData: {
      ...application.applicationData,
      customerWithContacts: null,
      contractorWithContacts: null,
      invoicingCustomer: {
        type: 'COMPANY',
        name: '',
        registryKey: '1234567-1',
        registryKeyHidden: false,
        ovt: '123456789012',
        postalAddress: {
          streetAddress: { streetName: 'Laskutuskuja 1' },
          postalCode: '00100',
          city: 'Helsinki',
        },
      },
    },
  };
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
  );
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));
  // Clear ovt, invoicingOperator and registryKey fields of invoicingCustomer, which should set them to null
  await user.clear(screen.getByTestId('applicationData.invoicingCustomer.ovt'));
  await user.clear(screen.getByTestId('applicationData.invoicingCustomer.invoicingOperator'));
  await user.clear(screen.getByTestId('applicationData.invoicingCustomer.registryKey'));
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  const data = applicationUpdateSpy.mock.lastCall?.[0].data as KaivuilmoitusData;
  expect(data?.customerWithContacts?.customer).toEqual(
    expect.objectContaining({ registryKey: null }),
  );
  expect(data?.contractorWithContacts?.customer).toEqual(
    expect.objectContaining({ registryKey: null }),
  );
  expect(data?.invoicingCustomer).toEqual(
    expect.objectContaining({ invoicingOperator: null, ovt: null, registryKey: null }),
  );

  applicationUpdateSpy.mockClear();
});

test('OVT and registryKey fields should be send as null if they are left empty by changing customer type', async () => {
  const applicationUpdateSpy = jest.spyOn(applicationApi, 'updateApplication');
  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[5] as Application<KaivuilmoitusData>);
  const testApplication: Application<KaivuilmoitusData> = {
    ...application,
    applicationData: {
      ...application.applicationData,
      customerWithContacts: null,
      contractorWithContacts: null,
      invoicingCustomer: {
        type: 'COMPANY',
        name: '',
        registryKey: '1234567-1',
        registryKeyHidden: false,
        ovt: '123456789012',
        postalAddress: {
          streetAddress: { streetName: 'Laskutuskuja 1' },
          postalCode: '00100',
          city: 'Helsinki',
        },
      },
    },
  };
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
  );
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  // Change customer type to PERSON
  await user.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[2]);
  await user.click(screen.getAllByText(/yksityishenkilö/i)[0]);

  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  const data = applicationUpdateSpy.mock.lastCall?.[0].data as KaivuilmoitusData;
  expect(data?.customerWithContacts?.customer).toEqual(
    expect.objectContaining({ registryKey: null }),
  );
  expect(data?.contractorWithContacts?.customer).toEqual(
    expect.objectContaining({ registryKey: null }),
  );
  expect(data?.invoicingCustomer).toEqual(
    expect.objectContaining({ invoicingOperator: null, ovt: null, registryKey: null }),
  );

  applicationUpdateSpy.mockClear();
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
      application={cloneDeep(applications[4]) as Application<KaivuilmoitusData>}
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
      application={cloneDeep(applications[4]) as Application<KaivuilmoitusData>}
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
      application={cloneDeep(applications[4]) as Application<KaivuilmoitusData>}
    />,
  );
  const button = await screen.findByRole('button', { name: /liitteet/i });
  await user.click(button);

  const fileUploadList = await screen.findAllByTestId('file-upload-list');
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

test('Should be able to remove work areas', async () => {
  initHaittaindeksitPostResponse({
    autoliikenne: {
      indeksi: 1.4,
      haitanKesto: 5,
      katuluokka: 1,
      liikennemaara: 1,
      kaistahaitta: 1,
      kaistapituushaitta: 1,
    },
    pyoraliikenneindeksi: 0.0,
    linjaautoliikenneindeksi: 0.0,
    raitioliikenneindeksi: 0.0,
    liikennehaittaindeksi: {
      indeksi: 1.4,
      tyyppi: HAITTA_INDEX_TYPE.AUTOLIIKENNEINDEKSI,
    },
  });
  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[4] as Application<KaivuilmoitusData>);
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={application} />,
  );
  await user.click(await screen.findByRole('button', { name: /alueiden/i }));

  await user.click(await screen.findByRole('button', { name: /poista työalue 1/i }));

  const { getByRole, getByText } = within(await screen.findByRole('dialog', {}, { timeout: 5000 }));
  expect(getByText('Haluatko varmasti poistaa työalueen Työalue 1?')).toBeInTheDocument();
  await user.click(getByRole('button', { name: /vahvista/i }));

  expect(screen.queryByText('Työalue 1')).not.toBeInTheDocument();

  await user.click(await screen.findByRole('button', { name: /poista työalue/i }));
  const { getByRole: getByRoleInDialogTwo, getByText: getByTextInDialogTwo } = within(
    await screen.findByRole('dialog', {}, { timeout: 5000 }),
  );
  expect(getByTextInDialogTwo('Haluatko varmasti poistaa työalueen Työalue?')).toBeInTheDocument();
  await user.click(getByRoleInDialogTwo('button', { name: /vahvista/i }));

  expect(screen.queryByText('Työalue')).not.toBeInTheDocument();
  // Whole hanke area tab should be removed if all areas are removed
  expect(screen.queryByText('Hankealue 2')).not.toBeInTheDocument();
});

test('Should highlight selected work area', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[4] as Application<KaivuilmoitusData>);
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={application} />,
  );
  await user.click(await screen.findByRole('button', { name: /alueiden/i }));

  const workAreaOne = await screen.findByRole('button', { name: 'Työalue 1' });
  const workAreaTwo = await screen.findByRole('button', { name: 'Työalue 2' });

  await user.click(workAreaTwo);
  expect(workAreaOne).not.toHaveClass('selected');
  await waitFor(
    () => {
      expect(screen.queryByRole('button', { name: 'Työalue 2' })).toHaveClass('selected');
    },
    { timeout: 5000 },
  );
});

test('Should show initial traffic nuisance index summary', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[4] as Application<KaivuilmoitusData>);
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={application} />,
  );
  await user.click(await screen.findByRole('button', { name: /alueiden/i }));

  const accordionHeader = await screen.findByRole('button', {
    name: 'Työalueiden liikennehaittaindeksien yhteenveto (0-5)',
  });
  await user.click(accordionHeader);
  expect(await screen.findByTestId('test-pyoraliikenneindeksi')).toHaveTextContent('3');
  expect(await screen.findByTestId('test-autoliikenneindeksi')).toHaveTextContent('3');
  expect(await screen.findByTestId('test-linjaautoliikenneindeksi')).toHaveTextContent('0');
  expect(await screen.findByTestId('test-raitioliikenneindeksi')).toHaveTextContent('5');

  const carTrafficAccordion = await screen.findByText('Autoliikenteen ruuhkautuminen');
  await user.click(carTrafficAccordion);
  expect(await screen.findByTestId('test-katuluokka')).toHaveTextContent('3');
  expect(await screen.findByTestId('test-liikennemaara')).toHaveTextContent('3');
  expect(await screen.findByTestId('test-kaistahaitta')).toHaveTextContent('3');
  expect(await screen.findByTestId('test-kaistapituushaitta')).toHaveTextContent('3');
  expect(await screen.findByTestId('test-haitanKesto')).toHaveTextContent('3');
});

test('Should show changed traffic nuisance index summary when kaistahaitta changes', async () => {
  initHaittaindeksitPostResponse({
    autoliikenne: {
      indeksi: 3.0,
      haitanKesto: 3,
      katuluokka: 3,
      liikennemaara: 3,
      kaistahaitta: 1,
      kaistapituushaitta: 3,
    },
    pyoraliikenneindeksi: 3.0,
    linjaautoliikenneindeksi: 4.0,
    raitioliikenneindeksi: 5.0,
    liikennehaittaindeksi: {
      indeksi: 5.0,
      tyyppi: HAITTA_INDEX_TYPE.RAITIOLIIKENNEINDEKSI,
    },
  });
  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[4] as Application<KaivuilmoitusData>);
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={application} />,
  );
  await user.click(await screen.findByRole('button', { name: /alueiden/i }));

  const kaistahaittaSelection = await screen.findByText(
    'Yksi autokaista vähenee - ajosuunta vielä käytössä',
  );
  await user.click(kaistahaittaSelection);
  await user.click(await screen.findByText('Ei vaikuta'));

  const accordionHeader = await screen.findByRole('button', {
    name: 'Työalueiden liikennehaittaindeksien yhteenveto (0-5)',
  });
  await user.click(accordionHeader);
  expect(await screen.findByTestId('test-pyoraliikenneindeksi')).toHaveTextContent('3');
  expect(await screen.findByTestId('test-autoliikenneindeksi')).toHaveTextContent('3');
  expect(await screen.findByTestId('test-linjaautoliikenneindeksi')).toHaveTextContent('4');
  expect(await screen.findByTestId('test-raitioliikenneindeksi')).toHaveTextContent('5');

  const carTrafficAccordion = await screen.findByText('Autoliikenteen ruuhkautuminen');
  await user.click(carTrafficAccordion);
  expect(await screen.findByTestId('test-katuluokka')).toHaveTextContent('3');
  expect(await screen.findByTestId('test-liikennemaara')).toHaveTextContent('3');
  expect(await screen.findByTestId('test-kaistahaitta')).toHaveTextContent('1');
  expect(await screen.findByTestId('test-kaistapituushaitta')).toHaveTextContent('3');
  expect(await screen.findByTestId('test-haitanKesto')).toHaveTextContent('3');
});

test('Should be able to send application', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[6] as Application<KaivuilmoitusData>);
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={application} />,
  );
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
  const application = cloneDeep(applications[6] as Application<KaivuilmoitusData>);
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={application} />,
  );
  await user.click(await screen.findByRole('button', { name: /yhteenveto/i }));
  await user.click(screen.getByRole('button', { name: /lähetä hakemus/i }));

  expect(await screen.findByText(/lähetä hakemus\?/i)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /vahvista/i }));

  expect(await screen.findByText(/lähettäminen epäonnistui/i)).toBeInTheDocument();
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

  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[6] as Application<KaivuilmoitusData>);
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={application} />,
  );
  await user.click(await screen.findByRole('button', { name: /yhteenveto/i }));

  expect(screen.queryByRole('button', { name: /lähetä hakemus/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /lähetä hakemus/i })).toBeDisabled();
  expect(
    screen.queryAllByText(
      'Hakemuksen voi lähettää ainoastaan hakemuksen yhteyshenkilönä oleva henkilö.',
    ),
  ).toHaveLength(2);
});

test('Should be able to fill user email and phone by selecting existing user in user name search input', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[4]) as Application<KaivuilmoitusData>;
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={application} />,
  );
  await user.click(await screen.findByRole('button', { name: /yhteystiedot/i }));
  await user.type(screen.getAllByRole('combobox', { name: /nimi/i })[0], 'matti');
  await screen.findByText('Matti Meikäläinen');
  await user.click(screen.getByText('Matti Meikäläinen'));

  expect(screen.getByTestId('applicationData.customerWithContacts.customer.email')).toHaveValue(
    'matti.meikalainen@test.com',
  );
  expect(screen.getByTestId('applicationData.customerWithContacts.customer.phone')).toHaveValue(
    '0401234567',
  );
});

describe('Registry key', () => {
  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[6] as Application<KaivuilmoitusData>);
  const testApplication: Application<KaivuilmoitusData> = {
    ...application,
    applicationData: {
      ...application.applicationData,
      customerWithContacts: null,
      contractorWithContacts: null,
      propertyDeveloperWithContacts: null,
      representativeWithContacts: null,
      invoicingCustomer: null,
    },
  };

  describe('Customer', () => {
    test('Should show henkilotunnus label when type is private person', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(screen.getByText('Henkilötunnus')).toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is company', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yritys')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is association', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show general label when type is other', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(
        screen.getByText('Y-tunnus, henkilötunnus tai muu yksilöivä tunnus'),
      ).toBeInTheDocument();
    });

    test('Registry key is required for private, company and association types', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      // private person
      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(
        await screen.findByTestId('applicationData.customerWithContacts.customer.registryKey'),
      ).toBeRequired();

      // company
      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yritys')[0]);

      expect(
        await screen.findByTestId('applicationData.customerWithContacts.customer.registryKey'),
      ).toBeRequired();

      // association
      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(
        await screen.findByTestId('applicationData.customerWithContacts.customer.registryKey'),
      ).toBeRequired();
    });

    test('Registry key is required for other contact type', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(
        await screen.findByTestId('applicationData.customerWithContacts.customer.registryKey'),
      ).toBeRequired();
    });

    test('Should show info text for hidden registry key', async () => {
      const { user } = render(
        <KaivuilmoitusContainer
          hankeData={hankeData}
          application={{
            ...testApplication,
            applicationData: {
              ...testApplication.applicationData,
              customerWithContacts: {
                customer: {
                  type: 'PERSON',
                  name: 'Testi Testinen',
                  registryKey: HIDDEN_FIELD_VALUE,
                  registryKeyHidden: true,
                  email: 'testi@testi.fi',
                  phone: '0401234567',
                },
                contacts: [],
              },
            },
          }}
        />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      expect(
        await screen.findByText(
          'Tunnus on piilotettu tietosuojasyistä. Voit halutessasi tallentaa uuden tunnuksen korvaamalla ******** tekstin uudella tunnuksella.',
        ),
      ).toBeInTheDocument();
    });

    test('Should be able to revert back to hidden registry key', async () => {
      const { user } = render(
        <KaivuilmoitusContainer
          hankeData={hankeData}
          application={{
            ...testApplication,
            applicationData: {
              ...testApplication.applicationData,
              customerWithContacts: {
                customer: {
                  type: 'PERSON',
                  name: 'Testi Testinen',
                  registryKey: HIDDEN_FIELD_VALUE,
                  registryKeyHidden: true,
                  email: 'testi@testi.fi',
                  phone: '0401234567',
                },
                contacts: [],
              },
            },
          }}
        />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      await user.type(screen.getAllByRole('textbox', { name: /henkilötunnus/i })[0], 'invalid');
      await user.click(document.body);

      expect(await screen.findByText('Kentän arvo on virheellinen')).toBeInTheDocument();

      await user.clear(screen.getAllByRole('textbox', { name: /henkilötunnus/i })[0]);
      await user.type(
        screen.getAllByRole('textbox', { name: /henkilötunnus/i })[0],
        HIDDEN_FIELD_VALUE,
      );
      await user.click(document.body);

      expect(screen.queryByText('Kentän arvo on virheellinen')).not.toBeInTheDocument();
    });
  });

  describe('Contractor', () => {
    test('Should show y-tunnus label when type is private person', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is company', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yritys')[1]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is association', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is other', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(
        screen.queryByText('Y-tunnus, henkilötunnus tai muu yksilöivä tunnus'),
      ).not.toBeInTheDocument();
    });

    test('Registry key is required for company and association customer types', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      // company
      await user.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      await user.click(screen.getAllByText('Yritys')[1]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).toBeRequired();

      // association
      await user.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      await user.click(screen.getAllByText('Yhdistys')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).toBeRequired();
    });

    test('Registry key is disabled for private customer type', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).toBeDisabled();
    });

    test('Registry key is disabled for other customer type', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).toBeDisabled();
    });
  });

  describe('Invoicing customer', () => {
    test('Should show henkilotunnus label when type is private person', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(screen.getByText('Henkilötunnus')).toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is company', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Yritys')[2]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is association', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show general label when type is other', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(
        screen.getByText('Y-tunnus, henkilötunnus tai muu yksilöivä tunnus'),
      ).toBeInTheDocument();
    });

    test('Registry key is required for private, company and association types', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      // private person
      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(
        await screen.findByTestId('applicationData.invoicingCustomer.registryKey'),
      ).toBeRequired();

      // company
      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Yritys')[0]);

      expect(
        await screen.findByTestId('applicationData.invoicingCustomer.registryKey'),
      ).toBeRequired();

      // association
      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(
        await screen.findByTestId('applicationData.invoicingCustomer.registryKey'),
      ).toBeRequired();
    });

    test('Registry key is required for other contact type', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('combobox', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(
        await screen.findByTestId('applicationData.invoicingCustomer.registryKey'),
      ).toBeRequired();
    });
  });
});

describe('Haittojenhallintasuunnitelma', () => {
  async function setupHaittojenHallintaPage(
    hankeData: HankeData = hankkeet[1] as HankeData,
    application: Application<KaivuilmoitusData> = cloneDeep(
      applications[4] as Application<KaivuilmoitusData>,
    ),
  ) {
    const renderResult = render(
      <KaivuilmoitusContainer hankeData={hankeData} application={application} />,
    );
    await renderResult.user.click(screen.getByRole('button', { name: /haittojen hallinta/i }));
    expect(await screen.findByText('Vaihe 3/6: Haittojen hallinta')).toBeInTheDocument();
    return renderResult;
  }

  test('Hanke nuisance control plans are shown', async () => {
    await setupHaittojenHallintaPage();
    expect(screen.queryByTestId('test-hanke-YLEINEN')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-hanke-PYORALIIKENNE')).toHaveTextContent('2');
    expect(screen.getByTestId('test-hanke-nuisance-control-PYORALIIKENNE')).toHaveTextContent(
      'Pyöräliikenteelle koituvien haittojen hallintasuunnitelma',
    );
    expect(screen.getByTestId('test-hanke-AUTOLIIKENNE')).toHaveTextContent('1.1');
    expect(screen.getByTestId('test-hanke-nuisance-control-AUTOLIIKENNE')).toHaveTextContent(
      'Autoliikenteelle koituvien haittojen hallintasuunnitelma',
    );
    expect(screen.getByTestId('test-hanke-LINJAAUTOLIIKENNE')).toHaveTextContent('3');
    expect(screen.getByTestId('test-hanke-nuisance-control-LINJAAUTOLIIKENNE')).toHaveTextContent(
      'Linja-autoliikenteelle koituvien haittojen hallintasuunnitelma',
    );
    expect(screen.getByTestId('test-hanke-RAITIOLIIKENNE')).toHaveTextContent('2');
    expect(screen.getByTestId('test-hanke-nuisance-control-RAITIOLIIKENNE')).toHaveTextContent(
      'Raitioliikenteelle koituvien haittojen hallintasuunnitelma',
    );
    expect(screen.queryByTestId('test-hanke-MUUT')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-hanke-nuisance-control-MUUT')).toHaveTextContent(
      'Muiden haittojen hallintasuunnitelma',
    );
  });

  test('Nuisance control plan is shown correctly', async () => {
    await setupHaittojenHallintaPage();

    expect(screen.getByTestId('test-common-nuisances')).toBeInTheDocument();
    expect(
      screen.getByText('Työalueen yleisten haittojen hallintasuunnitelma'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.YLEINEN'),
    ).toBeRequired();
    expect(
      screen.getByText('Pyöräliikenteelle koituvien työalueen haittojen hallintasuunnitelma'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('test-PYORALIIKENNE')).toHaveTextContent('3');
    expect(screen.getByTestId('show-tips-button-PYORALIIKENNE')).toBeInTheDocument();
    expect(
      screen.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.PYORALIIKENNE'),
    ).toBeRequired();
    expect(
      screen.getByText('Autoliikenteelle koituvien työalueen haittojen hallintasuunnitelma'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('test-AUTOLIIKENNE')).toHaveTextContent('3');
    expect(screen.getByTestId('show-tips-button-AUTOLIIKENNE')).toBeInTheDocument();
    expect(
      screen.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.AUTOLIIKENNE'),
    ).toBeRequired();
    expect(screen.getByText('Linja-autojen paikallisliikenne')).toBeInTheDocument();
    expect(screen.queryByTestId('test-LINJAAUTOLIIKENNE')).toHaveTextContent('0');
    expect(screen.queryByTestId('show-tips-button-LINJAAUTOLIIKENNE')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'Haitaton ei löytänyt tätä kohderyhmää alueelta. Voit tarvittaessa lisätä toimet haittojen hallintaan.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Lisää toimet haittojen hallintaan' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Raitioliikenteelle koituvien työalueen haittojen hallintasuunnitelma'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('test-RAITIOLIIKENNE')).toHaveTextContent('5');
    expect(screen.getByTestId('show-tips-button-RAITIOLIIKENNE')).toBeInTheDocument();
    expect(screen.getByText('Muiden työalueen haittojen hallintasuunnitelma')).toBeInTheDocument();
    expect(screen.getByTestId('test-meluHaitta')).toHaveTextContent('3');
    expect(screen.getByTestId('test-polyHaitta')).toHaveTextContent('5');
    expect(screen.getByTestId('test-tarinaHaitta')).toHaveTextContent('5');
    expect(screen.getByTestId('show-tips-button-MUUT')).toBeInTheDocument();
    expect(screen.getByTestId('show-tips-button-MELU')).toBeInTheDocument();
    expect(screen.getByTestId('show-tips-button-POLY')).toBeInTheDocument();
    expect(screen.getByTestId('show-tips-button-TARINA')).toBeInTheDocument();
  });

  test('Nuisance control plan can be filled', async () => {
    const updatedHaittojenhallintasuunnitelma = ', johon on lisätty tekstiä.';
    const applicationUpdateSpy = jest.spyOn(applicationApi, 'updateApplication');
    const { user } = await setupHaittojenHallintaPage();
    await user.type(
      screen.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.YLEINEN'),
      updatedHaittojenhallintasuunnitelma,
    );
    await user.type(
      screen.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.PYORALIIKENNE'),
      updatedHaittojenhallintasuunnitelma,
    );
    await user.type(
      screen.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.AUTOLIIKENNE'),
      updatedHaittojenhallintasuunnitelma,
    );
    await user.type(
      screen.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE'),
      updatedHaittojenhallintasuunnitelma,
    );
    await user.type(
      screen.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.MUUT'),
      updatedHaittojenhallintasuunnitelma,
    );
    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    const data = applicationUpdateSpy.mock.lastCall?.[0].data as KaivuilmoitusData;

    expect(data?.areas[0].haittojenhallintasuunnitelma?.YLEINEN).toBe(
      'Työalueen yleisten haittojen hallintasuunnitelma, johon on lisätty tekstiä.',
    );
    expect(data?.areas[0].haittojenhallintasuunnitelma?.PYORALIIKENNE).toBe(
      'Pyöräliikenteelle koituvien työalueen haittojen hallintasuunnitelma, johon on lisätty tekstiä.',
    );
    expect(data?.areas[0].haittojenhallintasuunnitelma?.AUTOLIIKENNE).toBe(
      'Autoliikenteelle koituvien työalueen haittojen hallintasuunnitelma, johon on lisätty tekstiä.',
    );
    expect(data?.areas[0].haittojenhallintasuunnitelma?.LINJAAUTOLIIKENNE).toBe('');
    expect(data?.areas[0].haittojenhallintasuunnitelma?.RAITIOLIIKENNE).toBe(
      'Raitioliikenteelle koituvien työalueen haittojen hallintasuunnitelma, johon on lisätty tekstiä.',
    );
    expect(data?.areas[0].haittojenhallintasuunnitelma?.MUUT).toBe(
      'Muiden työalueen haittojen hallintasuunnitelma, johon on lisätty tekstiä.',
    );

    applicationUpdateSpy.mockClear();
  });

  test('Non-detected nuisance field is shown correctly on nuisance control plan page', async () => {
    const { user } = await setupHaittojenHallintaPage();

    await user.click(screen.getByRole('button', { name: /lisää toimet haittojen hallintaan/i }));

    expect(screen.getByTestId('test-LINJAAUTOLIIKENNE')).toBeInTheDocument();
    expect(
      screen.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE'),
    ).not.toBeRequired();
  });
});

describe('Error notification', () => {
  function setup(
    application: Application<KaivuilmoitusData> = cloneDeep(
      applications[6],
    ) as Application<KaivuilmoitusData>,
  ) {
    const hankeData = hankkeet[1] as HankeData;
    server.use(
      http.post('/api/haittaindeksit', async () => {
        return HttpResponse.json<HaittaIndexData>({
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
        });
      }),
    );
    return render(<KaivuilmoitusContainer hankeData={hankeData} application={application} />);
  }

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
    await user.click(screen.getByRole('button', { name: /alueiden/i }));

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

    expect(
      await screen.findByText(
        'Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Työalueet (Hankealue 2): Yleiset toimet työalueiden haittojen hallintaan',
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

  test('Should show pages that have missing information for hanke to be public in summary page', async () => {
    const application = cloneDeep(applications[6]) as Application<KaivuilmoitusData>;
    application.applicationData = {
      ...application.applicationData,
      workDescription: '',
      startTime: null,
      customerWithContacts: null,
    };
    const { user } = setup(application);

    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

    await screen.findByText(
      'Seuraavissa vaiheissa on puuttuvia tietoja hakemuksen lähettämiseksi:',
    );
    expect(screen.getByRole('listitem', { name: /perustiedot/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /alueiden/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /yhteystiedot/i })).toBeInTheDocument();
  });

  test('Should not show validation errors in haittojenhallinta page for liikennemuodot that have no detected nuisances', async () => {
    const application = cloneDeep(applications[4]) as Application<KaivuilmoitusData>;
    application.applicationData.areas = [
      ...application.applicationData.areas,
      {
        name: 'Hankealue 1',
        hankealueId: 1,
        tyoalueet: [
          {
            geometry: {
              type: 'Polygon',
              crs: {
                type: 'name',
                properties: {
                  name: 'urn:ogc:def:crs:EPSG::3879',
                },
              },
              coordinates: [
                [
                  [25498583.867247857, 6679281.28058593],
                  [25498584.13087749, 6679314.065289769],
                  [25498573.17171292, 6679313.3807182815],
                  [25498571.913494226, 6679281.456795131],
                  [25498583.867247857, 6679281.28058593],
                ],
              ],
            },
            area: 159.32433261766946,
            tormaystarkasteluTulos: {
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
          },
        ],
        katuosoite: 'Aidasmäentie 5',
        tyonTarkoitukset: ['VESI', 'VIEMARI'],
        meluhaitta: 'TOISTUVA_MELUHAITTA',
        polyhaitta: 'JATKUVA_POLYHAITTA',
        tarinahaitta: 'SATUNNAINEN_TARINAHAITTA',
        kaistahaitta: 'EI_VAIKUTA',
        kaistahaittojenPituus: 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
        lisatiedot: '',
        haittojenhallintasuunnitelma: {
          YLEINEN: 'Työalueen yleisten haittojen hallintasuunnitelma',
          PYORALIIKENNE: '',
          AUTOLIIKENNE: '',
          LINJAAUTOLIIKENNE: '',
          RAITIOLIIKENNE: '',
          MUUT: 'Muiden työalueen haittojen hallintasuunnitelma',
        },
      },
    ];
    const { user } = setup(application);
    await user.click(screen.getByRole('button', { name: /haittojen hallinta/i }));

    expect(
      screen.queryByRole('link', {
        name: 'Työalueet (Hankealue 1) Pyöräliikenteen merkittävyys: Toimet työalueiden haittojen hallintaan',
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', {
        name: 'Työalueet (Hankealue 1) Autoliikenteen ruuhkautuminen: Toimet työalueiden haittojen hallintaan',
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', {
        name: 'Työalueet (Hankealue 1) Raitioliikenne: Toimet työalueiden haittojen hallintaan',
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', {
        name: 'Työalueet (Hankealue 1) Linja-autojen paikallisliikenne: Toimet työalueiden haittojen hallintaan',
      }),
    ).not.toBeInTheDocument();
  });
});
