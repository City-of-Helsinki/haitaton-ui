import { useApplication } from './useApplication';
import { server } from '../../mocks/test-server';
import { http, HttpResponse } from 'msw';
import { render, screen } from '../../../testUtils/render';

function TestComponent() {
  const { data: application, isLoading, error } = useApplication(1);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error...</div>;

  return (
    <div>
      <div data-testid="customer">
        {application?.applicationData.customerWithContacts?.customer.registryKey}
      </div>
      <div data-testid="contractor">
        {application?.applicationData.contractorWithContacts?.customer.registryKey}
      </div>
      <div data-testid="developer">
        {application?.applicationData.propertyDeveloperWithContacts?.customer.registryKey}
      </div>
      <div data-testid="representative">
        {application?.applicationData.representativeWithContacts?.customer.registryKey}
      </div>
    </div>
  );
}

test.each([['PERSON'], ['OTHER']])(
  'masks registry keys for kaivuilmoitus customer if its a person or other',
  async (customerType) => {
    server.use(
      http.get('/api/hakemukset/:id', async () => {
        return HttpResponse.json({
          applicationData: {
            applicationType: 'EXCAVATION_NOTIFICATION',
            customerWithContacts: {
              customer: {
                type: customerType,
                registryKeyHidden: true,
                registryKey: null,
              },
            },
          },
        });
      }),
    );

    render(<TestComponent />);

    const div = await screen.findByTestId('customer');

    expect(div).toHaveTextContent('********');
  },
);

test.each([['COMPANY'], ['ASSOCIATION']])(
  'does not mask registry keys for kaivuilmoitus customer if its a company or an association',
  async (customerType) => {
    server.use(
      http.get('/api/hakemukset/:id', async () => {
        return HttpResponse.json({
          applicationData: {
            applicationType: 'EXCAVATION_NOTIFICATION',
            customerWithContacts: {
              customer: {
                type: customerType,
                registryKeyHidden: false,
                registryKey: '1234567-8',
              },
            },
          },
        });
      }),
    );

    render(<TestComponent />);

    const div = await screen.findByTestId('customer');

    expect(div).toHaveTextContent('1234567-8');
  },
);

test.each([['PERSON'], ['OTHER'], ['COMPANY'], ['ASSOCIATION']])(
  'does not mask registry keys for kaivuilmoitus contractor, developer or representative',
  async (customerType) => {
    const registryKey =
      customerType === 'COMPANY' || customerType === 'ASSOCIATION' ? '1234567-8' : null;
    server.use(
      http.get('/api/hakemukset/:id', async () => {
        return HttpResponse.json({
          applicationData: {
            applicationType: 'EXCAVATION_NOTIFICATION',
            contractorWithContacts: {
              customer: {
                type: customerType,
                registryKeyHidden: false,
                registryKey: registryKey,
              },
            },
            propertyDeveloperWithContacts: {
              customer: {
                type: customerType,
                registryKeyHidden: false,
                registryKey: registryKey,
              },
            },
            representativeWithContacts: {
              customer: {
                type: customerType,
                registryKeyHidden: false,
                registryKey: registryKey,
              },
            },
          },
        });
      }),
    );

    render(<TestComponent />);

    const contractorDiv = await screen.findByTestId('contractor');
    const developerDiv = await screen.findByTestId('developer');
    const representativeDiv = await screen.findByTestId('representative');

    switch (customerType) {
      case 'COMPANY':
      case 'ASSOCIATION':
        {
          expect(contractorDiv).toHaveTextContent(registryKey!);
          expect(developerDiv).toHaveTextContent(registryKey!);
          expect(representativeDiv).toHaveTextContent(registryKey!);
        }
        break;
      case 'PERSON':
      case 'OTHER': {
        expect(contractorDiv).toHaveTextContent('');
        expect(developerDiv).toHaveTextContent('');
        expect(representativeDiv).toHaveTextContent('');
      }
    }
  },
);

test.each([['PERSON'], ['OTHER'], ['COMPANY'], ['ASSOCIATION']])(
  'does not mask registry keys for johtoselvityshakemus',
  async (customerType) => {
    const registryKey =
      customerType === 'COMPANY' || customerType === 'ASSOCIATION' ? '1234567-8' : null;
    server.use(
      http.get('/api/hakemukset/:id', async () => {
        return HttpResponse.json({
          applicationData: {
            applicationType: 'CABLE_REPORT',
            customerWithContacts: {
              customer: {
                type: customerType,
                registryKeyHidden: false,
                registryKey: registryKey,
              },
            },
            contractorWithContacts: {
              customer: {
                type: customerType,
                registryKeyHidden: false,
                registryKey: registryKey,
              },
            },
            propertyDeveloperWithContacts: {
              customer: {
                type: customerType,
                registryKeyHidden: false,
                registryKey: registryKey,
              },
            },
            representativeWithContacts: {
              customer: {
                type: customerType,
                registryKeyHidden: false,
                registryKey: registryKey,
              },
            },
          },
        });
      }),
    );

    render(<TestComponent />);

    const customerDiv = await screen.findByTestId('customer');
    const contractorDiv = screen.getByTestId('contractor');
    const developerDiv = screen.getByTestId('developer');
    const representativeDiv = screen.getByTestId('representative');

    switch (customerType) {
      case 'COMPANY':
      case 'ASSOCIATION':
        {
          expect(customerDiv).toHaveTextContent(registryKey!);
          expect(contractorDiv).toHaveTextContent(registryKey!);
          expect(developerDiv).toHaveTextContent(registryKey!);
          expect(representativeDiv).toHaveTextContent(registryKey!);
        }
        break;
      case 'PERSON':
      case 'OTHER': {
        expect(customerDiv).toHaveTextContent('');
        expect(contractorDiv).toHaveTextContent('');
        expect(developerDiv).toHaveTextContent('');
        expect(representativeDiv).toHaveTextContent('');
      }
    }
  },
);
