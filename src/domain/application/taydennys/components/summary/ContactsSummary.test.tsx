import { cloneDeep } from 'lodash';
import ContactsSummary from './ContactsSummary';
import { JohtoselvitysData, KaivuilmoitusData } from '../../../types/application';
import applications from '../../../../mocks/data/hakemukset-data';
import { render, screen } from '../../../../../testUtils/render';

const testApplication = cloneDeep(applications[10].applicationData as JohtoselvitysData);

const mockData: JohtoselvitysData = {
  ...testApplication,
  propertyDeveloperWithContacts: {
    customer: {
      type: 'COMPANY',
      name: 'Yritys 3 Oy',
      country: 'FI',
      email: 'yritys3@test.com',
      phone: '040123456',
      registryKey: null,
      registryKeyHidden: false,
      ovt: null,
      invoicingOperator: null,
      sapCustomerNumber: null,
    },
    contacts: [
      {
        hankekayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afb1',
        email: 'tauno@test.com',
        firstName: 'Tauno',
        lastName: 'Testinen',
        orderer: false,
        phone: '0401234567',
      },
    ],
  },
  representativeWithContacts: {
    customer: {
      type: 'COMPANY',
      name: 'Yritys 4 Oy',
      country: 'FI',
      email: 'yritys4@test.com',
      phone: '040123456',
      registryKey: null,
      registryKeyHidden: false,
      ovt: null,
      invoicingOperator: null,
      sapCustomerNumber: null,
    },
    contacts: [
      {
        hankekayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afb1',
        email: 'tauno@test.com',
        firstName: 'Tauno',
        lastName: 'Testinen',
        orderer: false,
        phone: '0401234567',
      },
    ],
  },
};

const kaivuilmoitusTestApplication = cloneDeep(
  applications[12].applicationData as KaivuilmoitusData,
);

describe('ContactsSummary', () => {
  test('renders nothing if no changes are detected', () => {
    const { container } = render(
      <ContactsSummary data={mockData} originalData={mockData} muutokset={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders customer with contacts change correctly', () => {
    render(
      <ContactsSummary
        data={{
          ...mockData,
          customerWithContacts: {
            customer: { ...mockData.customerWithContacts!.customer, phone: '040555123' },
            contacts: mockData.customerWithContacts!.contacts,
          },
        }}
        originalData={mockData}
        muutokset={['customerWithContacts']}
      />,
    );

    expect(screen.getByText('Työstä vastaava')).toBeInTheDocument();
    expect(screen.getByText('040555123')).toBeInTheDocument();
    expect(screen.getByText(mockData.customerWithContacts!.customer.name)).toBeInTheDocument();
    expect(screen.getByText(mockData.customerWithContacts!.customer.email)).toBeInTheDocument();
    mockData.customerWithContacts!.contacts.forEach((contact) => {
      expect(screen.getByText(`${contact.firstName} ${contact.lastName}`)).toBeInTheDocument();
      expect(screen.getByText(contact.email)).toBeInTheDocument();
      expect(screen.getByText(contact.phone)).toBeInTheDocument();
    });
  });

  test('renders contractor with contacts change correctly', () => {
    render(
      <ContactsSummary
        data={{
          ...mockData,
          contractorWithContacts: {
            customer: { ...mockData.contractorWithContacts!.customer, name: 'New Contractor' },
            contacts: mockData.contractorWithContacts!.contacts,
          },
        }}
        originalData={mockData}
        muutokset={['contractorWithContacts']}
      />,
    );

    expect(screen.getByText('Työn suorittaja')).toBeInTheDocument();
    expect(screen.getByText('New Contractor')).toBeInTheDocument();
    expect(screen.getByText(mockData.contractorWithContacts!.customer.email)).toBeInTheDocument();
    expect(screen.getByText(mockData.contractorWithContacts!.customer.phone)).toBeInTheDocument();
    mockData.contractorWithContacts!.contacts.forEach((contact) => {
      expect(screen.getByText(`${contact.firstName} ${contact.lastName}`)).toBeInTheDocument();
      expect(screen.getByText(contact.email)).toBeInTheDocument();
      expect(screen.getByText(contact.phone)).toBeInTheDocument();
    });
  });

  test('renders property developer with contacts change correctly', () => {
    render(
      <ContactsSummary
        data={{
          ...mockData,
          propertyDeveloperWithContacts: {
            customer: {
              ...mockData.propertyDeveloperWithContacts!.customer,
              email: 'developer@test.com',
            },
            contacts: mockData.propertyDeveloperWithContacts!.contacts,
          },
        }}
        originalData={mockData}
        muutokset={['propertyDeveloperWithContacts']}
      />,
    );

    expect(screen.getByText('Rakennuttaja')).toBeInTheDocument();
    expect(screen.getByText('developer@test.com')).toBeInTheDocument();
    expect(
      screen.getByText(mockData.propertyDeveloperWithContacts!.customer.name),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockData.propertyDeveloperWithContacts!.customer.phone),
    ).toBeInTheDocument();
    mockData.propertyDeveloperWithContacts!.contacts.forEach((contact) => {
      expect(screen.getByText(`${contact.firstName} ${contact.lastName}`)).toBeInTheDocument();
      expect(screen.getByText(contact.email)).toBeInTheDocument();
      expect(screen.getByText(contact.phone)).toBeInTheDocument();
    });
  });

  test('renders representative with contacts change correctly', () => {
    render(
      <ContactsSummary
        data={{
          ...mockData,
          representativeWithContacts: {
            customer: {
              ...mockData.representativeWithContacts!.customer,
              name: 'New representative',
            },
            contacts: mockData.representativeWithContacts!.contacts,
          },
        }}
        originalData={mockData}
        muutokset={['representativeWithContacts']}
      />,
    );

    expect(screen.getByText('Asianhoitaja')).toBeInTheDocument();
    expect(screen.getByText('New representative')).toBeInTheDocument();
    expect(
      screen.getByText(mockData.representativeWithContacts!.customer.email),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockData.representativeWithContacts!.customer.phone),
    ).toBeInTheDocument();
    mockData.representativeWithContacts!.contacts.forEach((contact) => {
      expect(screen.getByText(`${contact.firstName} ${contact.lastName}`)).toBeInTheDocument();
      expect(screen.getByText(contact.email)).toBeInTheDocument();
      expect(screen.getByText(contact.phone)).toBeInTheDocument();
    });
  });

  test('renders removed property developer with contacts correctly', () => {
    render(
      <ContactsSummary
        data={{ ...mockData, propertyDeveloperWithContacts: null }}
        originalData={mockData}
        muutokset={['propertyDeveloperWithContacts']}
      />,
    );

    expect(screen.getByText('Rakennuttaja')).toBeInTheDocument();
    expect(screen.getByText(/poistettu/i)).toBeInTheDocument();
    expect(
      screen.getByText(mockData.propertyDeveloperWithContacts!.customer.name),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockData.propertyDeveloperWithContacts!.customer.email),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockData.propertyDeveloperWithContacts!.customer.phone),
    ).toBeInTheDocument();
    mockData.propertyDeveloperWithContacts!.contacts.forEach((contact) => {
      expect(screen.getByText(`${contact.firstName} ${contact.lastName}`)).toBeInTheDocument();
      expect(screen.getByText(contact.email)).toBeInTheDocument();
      expect(screen.getByText(contact.phone)).toBeInTheDocument();
    });
  });

  test('renders removed representative with contacts correctly', () => {
    render(
      <ContactsSummary
        data={{ ...mockData, representativeWithContacts: null }}
        originalData={mockData}
        muutokset={['representativeWithContacts']}
      />,
    );

    expect(screen.getByText('Asianhoitaja')).toBeInTheDocument();
    expect(screen.getByText(/poistettu/i)).toBeInTheDocument();
    expect(
      screen.getByText(mockData.representativeWithContacts!.customer.name),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockData.representativeWithContacts!.customer.email),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockData.representativeWithContacts!.customer.phone),
    ).toBeInTheDocument();
    mockData.representativeWithContacts!.contacts.forEach((contact) => {
      expect(screen.getByText(`${contact.firstName} ${contact.lastName}`)).toBeInTheDocument();
      expect(screen.getByText(contact.email)).toBeInTheDocument();
      expect(screen.getByText(contact.phone)).toBeInTheDocument();
    });
  });

  test('renders invoicing customer change correctly', () => {
    render(
      <ContactsSummary
        data={{
          ...kaivuilmoitusTestApplication,
          invoicingCustomer: {
            ...kaivuilmoitusTestApplication.invoicingCustomer!,
            name: 'New invoicing customer',
          },
        }}
        originalData={kaivuilmoitusTestApplication}
        muutokset={['invoicingCustomer']}
      />,
    );

    expect(screen.getByText('Laskutustiedot')).toBeInTheDocument();
    expect(screen.getByText('New invoicing customer')).toBeInTheDocument();
    expect(
      screen.getByText(kaivuilmoitusTestApplication.invoicingCustomer!.registryKey!),
    ).toBeInTheDocument();
  });
});
