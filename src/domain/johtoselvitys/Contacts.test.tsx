import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent, render, screen } from '../../testUtils/render';
import { Contacts } from './Contacts';
import hankkeet from '../mocks/data/hankkeet-data';
import applications from '../mocks/data/hakemukset-data';
import { HankeContact, HankeDataDraft } from '../types/hanke';
import { JohtoselvitysFormValues } from './types';

jest.setTimeout(10000);

function Form({
  hanke,
  application,
}: {
  hanke?: HankeDataDraft;
  application?: JohtoselvitysFormValues;
}) {
  const methods = useForm({ defaultValues: application ?? { applicationData: {} } });

  const hankeContacts = [hanke?.omistajat, hanke?.rakennuttajat, hanke?.toteuttajat, hanke?.muut];

  return (
    <FormProvider {...methods}>
      <Contacts hankeContacts={hankeContacts} />
    </FormProvider>
  );
}

test('Contacts can be filled with hanke contact info', async () => {
  const hanke = hankkeet[1];
  const hankeOwner: HankeContact = hanke.omistajat![0];

  const { user } = render(<Form hanke={hanke} />);

  // Select applicant information to be filled with hanke owner information
  await user.click(screen.getAllByRole('button', { name: /esitäytetyt tiedot/i })[0]);
  await user.click(screen.getByText(hankeOwner.nimi));

  expect(screen.getAllByRole('button', { name: /tyyppi/i })[0]).toHaveTextContent('Yritys');
  expect(screen.getAllByRole('textbox', { name: /nimi/i })[0]).toHaveValue(hankeOwner.nimi);
  expect(screen.getAllByRole('textbox', { name: /Y-tunnus/i })[0]).toHaveValue(hankeOwner.ytunnus);
  expect(screen.getAllByRole('textbox', { name: /sähköposti/i })[0]).toHaveValue(hankeOwner.email);
  expect(screen.getAllByRole('textbox', { name: /puhelinnumero/i })[0]).toHaveValue(
    hankeOwner.puhelinnumero,
  );
});

test('Business id field is disabled if customer type is not company or association', () => {
  render(<Form />);

  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
  fireEvent.click(screen.getAllByText(/yksityishenkilö/i)[0]);

  expect(screen.getAllByLabelText(/y-tunnus/i)[0]).toBeDisabled();

  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
  fireEvent.click(screen.getAllByText(/muu/i)[0]);

  expect(screen.getAllByLabelText(/y-tunnus/i)[0]).toBeDisabled();
});

test('Business id field is not disabled if customer type is company or association', () => {
  render(<Form />);

  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
  fireEvent.click(screen.getAllByText(/yritys/i)[0]);

  expect(screen.getAllByLabelText(/y-tunnus/i)[0]).toBeEnabled();

  fireEvent.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
  fireEvent.click(screen.getAllByText(/yhdistys/i)[0]);

  expect(screen.getAllByLabelText(/y-tunnus/i)[0]).toBeEnabled();
});

test('Customer fields can be filled with orderer information', async () => {
  const application = applications[0];
  const orderer = application.applicationData.customerWithContacts.contacts[0];
  const { user } = render(<Form application={application} />);

  await user.click(
    screen.getByTestId('applicationData.customerWithContacts.customer.fillOwnInfoButton'),
  );

  expect(screen.getByTestId('applicationData.customerWithContacts.customer.name')).toHaveValue(
    `${orderer.firstName} ${orderer.lastName}`,
  );
  expect(screen.getByTestId('applicationData.customerWithContacts.customer.email')).toHaveValue(
    orderer.email,
  );
  expect(screen.getByTestId('applicationData.customerWithContacts.customer.phone')).toHaveValue(
    orderer.phone,
  );
});

test('Contact fields can be filled with orderer information', async () => {
  const application = applications[0];
  const orderer = application.applicationData.customerWithContacts.contacts[0];
  const { user } = render(<Form application={application} />);

  await user.click(
    screen.getByTestId('applicationData.contractorWithContacts.contacts.0.fillOwnInfoButton'),
  );

  expect(
    screen.getByTestId('applicationData.contractorWithContacts.contacts.0.firstName'),
  ).toHaveValue(orderer.firstName);
  expect(
    screen.getByTestId('applicationData.contractorWithContacts.contacts.0.lastName'),
  ).toHaveValue(orderer.lastName);
  expect(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.email')).toHaveValue(
    orderer.email,
  );
  expect(screen.getByTestId('applicationData.contractorWithContacts.contacts.0.phone')).toHaveValue(
    orderer.phone,
  );
});
