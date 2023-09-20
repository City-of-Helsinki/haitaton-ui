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
import * as applicationApi from '../application/utils';

afterEach(cleanup);

jest.setTimeout(40000);

interface DateOptions {
  start?: string;
  end?: string;
}

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
          email: 'test@test.com',
          firstName: 'Test',
          lastName: 'Person',
          orderer: true,
          phone: '0401234567',
        },
      ],
    },
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

  fireEvent.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));

  fireEvent.click(screen.getByTestId('excavationYes'));

  fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
    target: { value: 'Testataan johtoselvityslomaketta' },
  });

  fireEvent.change(screen.getByLabelText(/etunimi/i), {
    target: { value: 'Matti' },
  });
  fireEvent.change(screen.getByLabelText(/sukunimi/i), {
    target: { value: 'Meikäläinen' },
  });
  fireEvent.change(screen.getByLabelText(/sähköposti/i), {
    target: { value: 'matti.meikalainen@test.com' },
  });
  fireEvent.change(screen.getByLabelText(/puhelinnumero/i), {
    target: { value: '0000000000' },
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

  // Fill contact of contractor
  fireEvent.change(
    screen.getByTestId('applicationData.contractorWithContacts.contacts.0.firstName'),
    {
      target: { value: 'Alli' },
    },
  );
  fireEvent.change(
    screen.getByTestId('applicationData.contractorWithContacts.contacts.0.lastName'),
    {
      target: { value: 'Asiakas' },
    },
  );
  fireEvent.change(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.email'), {
    target: { value: 'alli.asiakas@test.com' },
  });
  fireEvent.change(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.phone'), {
    target: { value: '0000000000' },
  });
}

test('Cable report application form can be filled and saved and sent to Allu', async () => {
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
    rest.post('/api/hakemukset/:id/send-application', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const hankeData = hankkeet[1] as HankeData;

  const { user } = render(
    <JohtoselvitysContainer hankeData={hankeData} application={application} />,
  );

  fillBasicInformation();
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  fillAreasInformation();
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  fillContactsInformation();
  await user.click(screen.getByTestId('hds-stepper-step-4'));
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
  await screen.findByText('Johtoselvitys (HAI22-12)');
  expect(screen.queryByText('Vaihe 2/5: Alueet')).toBeInTheDocument();
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

test('Save and quit works without hanke existing first', async () => {
  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus');

  // Fill basic information page
  fillBasicInformation();

  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.queryAllByText(/hakemus tallennettu/i).length).toBe(2);
  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-13');
});

test('Should not save and quit if current form page is not valid', async () => {
  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus');

  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(window.location.pathname).toBe('/fi/johtoselvityshakemus');
  expect(screen.queryAllByText('Kenttä on pakollinen').length).toBeGreaterThan(1);
});

test('Should show error message and not navigate away when save and quit fails', async () => {
  server.use(
    rest.post('/api/hakemukset/:id', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const { user } = render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus');

  fillBasicInformation();
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

test('Should change users own role and its fields correctly', async () => {
  const { user } = render(<JohtoselvitysContainer application={application} />);

  const firstName = 'Tauno';
  const lastName = 'Työmies';
  const email = 'tauno@test.com';
  const phone = '0401234567';

  fillBasicInformation();

  fireEvent.click(screen.getByRole('button', { name: /rooli/i }));
  fireEvent.click(screen.getByText(/työn suorittaja/i));
  fireEvent.change(
    screen.getByTestId('applicationData.contractorWithContacts.contacts.0.firstName'),
    {
      target: { value: firstName },
    },
  );
  fireEvent.change(
    screen.getByTestId('applicationData.contractorWithContacts.contacts.0.lastName'),
    {
      target: { value: lastName },
    },
  );
  fireEvent.change(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.email'), {
    target: { value: email },
  });
  fireEvent.change(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.phone'), {
    target: { value: phone },
  });

  // Move to areas page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  fillAreasInformation();

  // Move to contacts page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));
  await user.click(screen.getByTestId('contractorWithContacts-0'));

  expect(
    screen.getByTestId('applicationData.customerWithContacts.contacts.0.firstName'),
  ).toHaveValue('');
  expect(
    screen.getByTestId('applicationData.customerWithContacts.contacts.0.lastName'),
  ).toHaveValue('');
  expect(screen.getByTestId('applicationData.customerWithContacts.contacts.0.email')).toHaveValue(
    '',
  );
  expect(screen.getByTestId('applicationData.customerWithContacts.contacts.0.phone')).toHaveValue(
    '',
  );
  expect(
    screen.getByTestId('applicationData.contractorWithContacts.contacts.0.firstName'),
  ).toHaveValue(firstName);
  expect(
    screen.getByTestId('applicationData.contractorWithContacts.contacts.0.lastName'),
  ).toHaveValue(lastName);
  expect(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.email')).toHaveValue(
    email,
  );
  expect(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.phone')).toHaveValue(
    phone,
  );
});

test('Should not change anything if selecting the same role again', async () => {
  const { user } = render(<JohtoselvitysContainer application={applications[0]} />);

  fireEvent.click(screen.getByRole('button', { name: /rooli/i }));
  // Select the role to be Hakija again
  await user.click(screen.getAllByText(/hakija/i)[1]);
  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

  // Check that there isn't another contact added
  expect(screen.queryByTestId('customerWithContacts-1')).not.toBeInTheDocument();
});

test('Should not show send button when application has moved to pending state', async () => {
  const { user } = render(<JohtoselvitysContainer application={applications[1]} />);

  await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

  expect(screen.queryByText('Vaihe 5/5: Yhteenveto')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /lähetä hakemus/i })).not.toBeInTheDocument();
});

test('Should show send button when application is edited in draft state', async () => {
  const { user } = render(<JohtoselvitysContainer application={applications[0]} />);

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

test('Should not allow to edit own info when application has been sent to Allu', () => {
  render(<JohtoselvitysContainer application={applications[1]} />);

  expect(screen.getByRole('button', { name: /rooli/i })).toBeDisabled();
  expect(
    screen.getByTestId('applicationData.customerWithContacts.contacts.0.firstName'),
  ).toBeDisabled();
  expect(
    screen.getByTestId('applicationData.customerWithContacts.contacts.0.lastName'),
  ).toBeDisabled();
  expect(
    screen.getByTestId('applicationData.customerWithContacts.contacts.0.email'),
  ).toBeDisabled();
  expect(
    screen.getByTestId('applicationData.customerWithContacts.contacts.0.phone'),
  ).toBeDisabled();
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

test('Form is saved when contacts are filled with orderer information', async () => {
  const saveApplication = jest.spyOn(applicationApi, 'saveApplication');
  const { user } = render(<JohtoselvitysContainer application={applications[0]} />);

  await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));
  await user.click(
    screen.getByTestId('applicationData.customerWithContacts.customer.fillOwnInfoButton'),
  );
  await user.click(screen.getByRole('button', { name: /edellinen/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
  expect(saveApplication).toHaveBeenCalledTimes(1);
});
