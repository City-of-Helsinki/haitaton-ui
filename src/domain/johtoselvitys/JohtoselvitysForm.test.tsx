import React from 'react';
import { rest } from 'msw';
import { render, cleanup, fireEvent, screen } from '../../testUtils/render';
import Johtoselvitys from '../../pages/Johtoselvitys';
import JohtoselvitysContainer from './JohtoselvitysContainer';
import { waitForLoadingToFinish } from '../../testUtils/helperFunctions';
import { server } from '../mocks/test-server';
import { HankeData } from '../types/hanke';
import hankkeet from '../mocks/data/hankkeet-data';
import applications from '../mocks/data/hakemukset-data';
import { JohtoselvitysFormValues } from './types';

afterEach(cleanup);

jest.setTimeout(40000);

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
        type: null,
        name: '',
        country: '',
        email: '',
        phone: '',
        registryKey: null,
        ovt: null,
        invoicingOperator: null,
        sapCustomerNumber: null,
      },
      contacts: [
        {
          email: '',
          name: '',
          orderer: true,
          phone: '',
        },
      ],
    },
    areas: [
      {
        name: '',
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
              [25498583.87, 6679281.28],
              [25498584.13, 6679314.07],
              [25498573.17, 6679313.38],
              [25498571.91, 6679281.46],
              [25498583.87, 6679281.28],
            ],
          ],
        },
      },
    ],
    startTime: null,
    endTime: null,
    identificationNumber: 'HAI-123',
    clientApplicationKind: 'HAITATON',
    workDescription: '',
    contractorWithContacts: {
      customer: {
        type: null,
        name: '',
        country: 'FI',
        email: '',
        phone: '',
        registryKey: null,
        ovt: null,
        invoicingOperator: null,
        sapCustomerNumber: null,
      },
      contacts: [
        {
          email: '',
          name: '',
          orderer: false,
          phone: '',
        },
      ],
    },
    postalAddress: null,
    representativeWithContacts: null,
    invoicingCustomer: null,
    customerReference: null,
    area: null,
    propertyDeveloperWithContacts: null,
    constructionWork: false,
    maintenanceWork: false,
    emergencyWork: false,
    propertyConnectivity: false,
    rockExcavation: null,
  },
};

function fillBasicInformation() {
  fireEvent.change(screen.getByLabelText(/työn nimi/i), {
    target: { value: 'Johtoselvitys' },
  });

  fireEvent.change(screen.getAllByLabelText(/katuosoite/i)[0], {
    target: { value: 'Mannerheimintie 5' },
  });
  fireEvent.change(screen.getAllByLabelText(/postinumero/i)[0], {
    target: { value: '00100' },
  });
  fireEvent.change(screen.getAllByLabelText(/postitoimipaikka/i)[0], {
    target: { value: 'Helsinki' },
  });

  fireEvent.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));

  fireEvent.click(screen.getByTestId('excavationYes'));

  fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
    target: { value: 'Testataan johtoselvityslomaketta' },
  });

  fireEvent.change(screen.getByLabelText(/Nimi/), {
    target: { value: 'Matti Meikäläinen' },
  });
  fireEvent.change(screen.getByLabelText(/sähköposti/i), {
    target: { value: 'matti.meikalainen@test.com' },
  });
  fireEvent.change(screen.getByLabelText(/puhelinnumero/i), {
    target: { value: '0000000000' },
  });
}

function fillAreasInformation() {
  fireEvent.change(screen.getByLabelText(/työn arvioitu alkupäivä/i), {
    target: { value: '1.4.2024' },
  });
  fireEvent.change(screen.getByLabelText(/työn arvioitu loppupäivä/i), {
    target: { value: '1.6.2024' },
  });
}

function fillContactsInformation() {
  // Fill customer info
  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
  fireEvent.click(screen.getAllByText(/yritys/i)[0]);
  fireEvent.change(screen.getAllByLabelText(/Nimi/)[0], {
    target: { value: 'Yritys Oy' },
  });
  fireEvent.change(screen.getAllByLabelText(/y-tunnus/i)[0], {
    target: { value: '2182805-0' },
  });
  fireEvent.change(screen.getAllByLabelText(/sähköposti/i)[0], {
    target: { value: 'yritys@test.com' },
  });
  fireEvent.change(screen.getAllByLabelText(/puhelinnumero/i)[0], {
    target: { value: '0000000000' },
  });

  // Fill contractor info
  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
  fireEvent.click(screen.getAllByText(/yritys/i)[1]);
  fireEvent.change(screen.getAllByLabelText(/Nimi/)[2], {
    target: { value: 'Yritys 2 Oy' },
  });
  fireEvent.change(screen.getAllByLabelText(/y-tunnus/i)[1], {
    target: { value: '7126070-7' },
  });
  fireEvent.change(screen.getAllByLabelText(/sähköposti/i)[2], {
    target: { value: 'yritys2@test.com' },
  });
  fireEvent.change(screen.getAllByLabelText(/puhelinnumero/i)[2], {
    target: { value: '0000000000' },
  });

  // Fill contact of contractor
  fireEvent.change(screen.getAllByLabelText(/Nimi/)[3], {
    target: { value: 'Alli Asiakas' },
  });
  fireEvent.change(screen.getAllByLabelText(/sähköposti/i)[3], {
    target: { value: 'alli.asiakas@test.com' },
  });
  fireEvent.change(screen.getAllByLabelText(/puhelinnumero/i)[3], {
    target: { value: '0000000000' },
  });
}

test('Cable report application form can be filled and saved and sent to Allu', async () => {
  const hankeData = hankkeet[1] as HankeData;

  const { user } = render(
    <JohtoselvitysContainer hankeData={hankeData} application={application} />
  );

  expect(
    screen.queryByText('Aidasmäentien vesihuollon rakentaminen (HAI22-2)')
  ).toBeInTheDocument();

  // Fill basic information page
  fillBasicInformation();

  // Move to areas page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));

  expect(screen.queryByText('Vaihe 2/4: Alueet')).toBeInTheDocument();

  // Fill areas page
  fillAreasInformation();

  // Move to contacts page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));

  expect(screen.queryByText('Vaihe 3/4: Yhteystiedot')).toBeInTheDocument();

  // Fill contacts page
  fillContactsInformation();

  // Move to summary page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));

  expect(screen.queryByText('Vaihe 4/4: Yhteenveto')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /lähetä hakemus/i }));
  expect(screen.queryByText(/hakemus lähetetty/i)).toBeInTheDocument();
  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
});

test('Should show error message when saving fails', async () => {
  server.use(
    rest.post('/api/hakemukset', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    })
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
    rest.post('/api/hakemukset/:id/send-application', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    })
  );

  const hankeData = hankkeet[1] as HankeData;

  const { user } = render(
    <JohtoselvitysContainer hankeData={hankeData} application={application} />
  );

  fillBasicInformation();
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  fillAreasInformation();
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  fillContactsInformation();
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  await user.click(screen.getByRole('button', { name: /lähetä hakemus/i }));

  expect(screen.queryByText(/lähettäminen epäonnistui/i)).toBeInTheDocument();
});

test('Form can be saved without hanke existing first', async () => {
  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus');

  // Fill basic information page
  fillBasicInformation();

  // Move to areas page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
  expect(screen.queryByText('Johtoselvitys (HAI22-12)')).toBeInTheDocument();
  expect(screen.queryByText('Vaihe 2/4: Alueet')).toBeInTheDocument();
});

test('Save and quit works', async () => {
  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus?hanke=HAI22-2');

  await waitForLoadingToFinish();

  // Fill basic information page
  fillBasicInformation();

  // Move to areas page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.queryAllByText(/hakemus tallennettu/i).length).toBe(2);
  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
});

test('Save and quit works without hanke existing first', async () => {
  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus');

  // Fill basic information page
  fillBasicInformation();

  // Move to areas page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.queryAllByText(/hakemus tallennettu/i).length).toBe(2);
  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-13');
});

test('Should show error message and not navigate away when save and quit fails', async () => {
  server.use(
    rest.put('/api/hakemukset/:id', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    })
  );

  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus');

  fillBasicInformation();
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.queryAllByText(/tallentaminen epäonnistui/i)[0]).toBeInTheDocument();
  expect(window.location.pathname).toBe('/fi/johtoselvityshakemus');
});

test('Should not save application between page changes when nothing is changed', async () => {
  const { user } = render(<JohtoselvitysContainer application={applications[3]} />);

  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).not.toBeInTheDocument();
});

test('Should save existing application between page changes when there is changes', async () => {
  const { user } = render(<JohtoselvitysContainer application={applications[3]} />);

  fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
    target: { value: 'Muokataan johtoselvitystä' },
  });

  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
});

test('Should change users own role and its fields correctly', async () => {
  const { user } = render(<JohtoselvitysContainer application={applications[3]} />);

  const name = 'Tauno Työmies';
  const email = 'tauno@test.com';
  const phone = '0401234567';

  fireEvent.click(screen.getByRole('button', { name: /rooli/i }));
  fireEvent.click(screen.getByText(/työn suorittaja/i));
  fireEvent.change(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.name'), {
    target: { value: name },
  });
  fireEvent.change(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.email'), {
    target: { value: email },
  });
  fireEvent.change(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.phone'), {
    target: { value: phone },
  });
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  expect(screen.getByTestId('applicationData.customerWithContacts.contacts.0.name')).toHaveValue(
    ''
  );
  expect(screen.getByTestId('applicationData.customerWithContacts.contacts.0.email')).toHaveValue(
    ''
  );
  expect(screen.getByTestId('applicationData.customerWithContacts.contacts.0.phone')).toHaveValue(
    ''
  );
  expect(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.name')).toHaveValue(
    name
  );
  expect(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.email')).toHaveValue(
    email
  );
  expect(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.phone')).toHaveValue(
    phone
  );
});
