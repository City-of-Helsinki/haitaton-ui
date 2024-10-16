import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { http, HttpResponse } from 'msw';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '../../testUtils/render';
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
import { HAITTA_INDEX_TYPE } from '../common/haittaIndexes/types';
import { HIDDEN_FIELD_VALUE } from '../application/constants';

afterEach(cleanup);

async function fillBasicInformation(
  user: UserEvent,
  options: {
    name?: string;
    description?: string;
    cableReportDone?: boolean;
    rockExcavation?: boolean;
    existingCableReport?: string;
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

  if (cableReportDone) {
    fireEvent.click(screen.getByLabelText(/hae uusi johtoselvitys/i));
    if (rockExcavation === true) {
      fireEvent.click(screen.getByLabelText(/kyllä/i));
    } else if (rockExcavation === false) {
      fireEvent.click(screen.getByLabelText(/ei/i));
    }
  }

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
  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
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

  // Fill contractor info
  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
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

  // Fill invoicing customer info
  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[2]);
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
  expect(window.location.pathname).toBe('/fi/hakemus/10');
});

test('Should not be able to save form if work name is missing', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user, { name: '' });
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.getByText('Vaihe 1/5: Perustiedot')).toBeInTheDocument();
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

  expect(screen.getByText('Vaihe 1/5: Perustiedot')).toBeInTheDocument();
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
  const cableReportDone = false;
  const rockExcavation = true;
  const existingCableReport = 'JS2300001';
  const cableReports = ['JS2300002', 'JS2300003', 'JS2300004'];
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
      areas: applications[4].applicationData.areas as KaivuilmoitusAlue[],
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
    rockExcavation,
    existingCableReport,
    cableReports,
    placementContracts,
  });
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  // Should save form on page change and show notification
  expect(await screen.findByText(/hakemus tallennettu/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));

  expect(await screen.findByText('Vaihe 2/5: Alueet')).toBeInTheDocument();

  fillAreasInformation({ start: startDate, end: endDate });
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(await screen.findByText('Vaihe 3/5: Yhteystiedot')).toBeInTheDocument();

  fillContactsInformation({ customer, contractor, invoicingCustomer });
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(await screen.findByText('Vaihe 4/5: Liitteet ja lisätiedot')).toBeInTheDocument();

  await fillAttachments(user, {
    trafficArrangementPlanFiles: [
      new File(['liikennejärjestelyt'], 'liikennejärjestelyt.pdf', { type: 'application/pdf' }),
    ],
    mandateFiles: [new File(['valtakirja'], 'valtakirja.pdf', { type: 'application/pdf' })],
    otherFiles: [new File(['muu'], 'muu.png', { type: 'image/png' })],
    additionalInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  });
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(await screen.findByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();
  // Basic information
  expect(screen.getByText(name)).toBeInTheDocument();
  expect(screen.getByText(description)).toBeInTheDocument();
  expect(
    screen.getByText('Louhitaanko työn yhteydessä, esimerkiksi kallioperää?: Ei'),
  ).toBeInTheDocument();
  expect(
    screen.getByText(`${existingCableReport}, ${cableReports.join(', ')}`),
  ).toBeInTheDocument();
  expect(screen.getByText(placementContracts.join(', '))).toBeInTheDocument();
  expect(screen.getByText('Kyllä')).toBeInTheDocument();

  // Areas information
  expect(screen.getByText(startDate)).toBeInTheDocument();
  expect(screen.getByText(endDate)).toBeInTheDocument();
  expect(screen.getByText('Työalue 1 (158 m²)')).toBeInTheDocument();
  expect(screen.getByText('Työalue 2 (30 m²)')).toBeInTheDocument();
  expect(screen.getByText('Pinta-ala: 188 m²')).toBeInTheDocument();
  expect(screen.getByText('Katuosoite: Aidasmäentie 5')).toBeInTheDocument();
  expect(screen.getByText('Työn tarkoitus: Vesi, Viemäri')).toBeInTheDocument();
  expect(screen.getByText('Meluhaitta: Toistuva meluhaitta')).toBeInTheDocument();
  expect(screen.getByText('Pölyhaitta: Jatkuva pölyhaitta')).toBeInTheDocument();
  expect(screen.getByText('Tärinähaitta: Satunnainen tärinähaitta')).toBeInTheDocument();
  expect(
    screen.getByText('Autoliikenteen kaistahaitta: Vähentää kaistan yhdellä ajosuunnalla'),
  ).toBeInTheDocument();
  expect(screen.getByText('Kaistahaittojen pituus: 10-99 m')).toBeInTheDocument();
  expect(screen.getByText('Lisätietoja alueesta: -')).toBeInTheDocument();

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

  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[2]);
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
  await user.click(screen.getAllByRole('button', { name: /tyyppi/i })[2]);
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
  await user.click(await screen.findByRole('button', { name: /alueet/i }));

  await user.click(await screen.findByRole('button', { name: /poista työalue 1/i }));

  const { getByRole, getByText } = within(await screen.findByRole('dialog'));
  expect(getByText('Haluatko varmasti poistaa työalueen Työalue 1?')).toBeInTheDocument();
  await user.click(getByRole('button', { name: /vahvista/i }));

  expect(screen.queryByText('Työalue 1')).not.toBeInTheDocument();

  await user.click(await screen.findByRole('button', { name: /poista työalue/i }));
  const { getByRole: getByRoleInDialogTwo, getByText: getByTextInDialogTwo } = within(
    await screen.findByRole('dialog'),
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
  await user.click(await screen.findByRole('button', { name: /alueet/i }));

  const workAreaOne = await screen.findByRole('button', { name: 'Työalue 1' });
  const workAreaTwo = await screen.findByRole('button', { name: 'Työalue 2' });

  await user.click(workAreaTwo);
  expect(workAreaOne).not.toHaveClass('selected');
  expect(workAreaTwo).toHaveClass('selected');
});

test('Should show initial traffic nuisance index summary', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const application = cloneDeep(applications[4] as Application<KaivuilmoitusData>);
  const { user } = render(
    <KaivuilmoitusContainer hankeData={hankeData} application={application} />,
  );
  await user.click(await screen.findByRole('button', { name: /alueet/i }));

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
  await user.click(await screen.findByRole('button', { name: /alueet/i }));

  const kaistahaittaSelection = await screen.findByText('Vähentää kaistan yhdellä ajosuunnalla');
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
  const application = applications[4] as Application<KaivuilmoitusData>;
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

      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(screen.getByText('Henkilötunnus')).toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is company', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yritys')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is association', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show general label when type is other', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(
        screen.getByText('Y-tunnus, henkilötunnus tai muu yksilöivä tunnus'),
      ).toBeInTheDocument();
    });

    test('Registry key is required for all customer types', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      // private person
      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(
        await screen.findByTestId('applicationData.customerWithContacts.customer.registryKey'),
      ).toBeRequired();

      // company
      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yritys')[0]);

      expect(
        await screen.findByTestId('applicationData.customerWithContacts.customer.registryKey'),
      ).toBeRequired();

      // association
      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(
        await screen.findByTestId('applicationData.customerWithContacts.customer.registryKey'),
      ).toBeRequired();

      // other
      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
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

      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is company', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yritys')[1]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is association', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is other', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(
        screen.queryByText('Y-tunnus, henkilötunnus tai muu yksilöivä tunnus'),
      ).not.toBeInTheDocument();
    });

    test('Registry key is required for company and association customer types and disabled for others', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      // private person
      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).toBeDisabled();

      // company
      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yritys')[1]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).toBeRequired();

      // association
      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(
        await screen.findByTestId('applicationData.contractorWithContacts.customer.registryKey'),
      ).toBeRequired();

      // other
      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
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

      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(screen.getByText('Henkilötunnus')).toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is company', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Yritys')[2]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show y-tunnus label when type is association', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(3);
      expect(screen.queryByText('Henkilötunnus')).not.toBeInTheDocument();
    });

    test('Should show general label when type is other', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(await screen.findAllByText('Y-tunnus')).toHaveLength(2);
      expect(
        screen.getByText('Y-tunnus, henkilötunnus tai muu yksilöivä tunnus'),
      ).toBeInTheDocument();
    });

    test('Registry key is required for all customer types', async () => {
      const { user } = render(
        <KaivuilmoitusContainer hankeData={hankeData} application={testApplication} />,
      );
      await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

      // private person
      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Yksityishenkilö')[0]);

      expect(
        await screen.findByTestId('applicationData.invoicingCustomer.registryKey'),
      ).toBeRequired();

      // company
      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Yritys')[2]);

      expect(
        await screen.findByTestId('applicationData.invoicingCustomer.registryKey'),
      ).toBeRequired();

      // association
      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Yhdistys')[0]);

      expect(
        await screen.findByTestId('applicationData.invoicingCustomer.registryKey'),
      ).toBeRequired();

      // other
      fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[2]);
      fireEvent.click(screen.getAllByText('Muu')[0]);

      expect(
        await screen.findByTestId('applicationData.invoicingCustomer.registryKey'),
      ).toBeRequired();
    });
  });
});
