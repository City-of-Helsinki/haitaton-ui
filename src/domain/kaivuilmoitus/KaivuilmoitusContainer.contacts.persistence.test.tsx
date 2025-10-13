import React from 'react';
import { render, act } from '@testing-library/react';
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import { HankeData } from '../types/hanke';
import { Application, KaivuilmoitusData, ContactType } from '../application/types/application';
import '@testing-library/jest-dom';
import { GlobalNotificationProvider } from '../../common/components/globalNotification/GlobalNotificationContext';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock other pages except Contacts to keep test lightweight
jest.mock('./BasicInfo', () => () => <div>BasicInfo</div>);
jest.mock('./Attachments', () => () => <div>Attachments</div>);
jest.mock('./ReviewAndSend', () => () => <div>ReviewAndSend</div>);
jest.mock('./Areas', () => () => <div>Areas</div>);
jest.mock('./HaittojenHallinta', () => () => <div>Haitat</div>);
jest.mock('./components/FormErrorsNotification', () => () => null);
jest.mock('../application/components/ApplicationSendDialog', () => () => <div />);

jest.mock('../../common/components/featureFlags/FeatureFlagsContext', () => ({
  useFeatureFlags: () => ({ flags: {}, isEnabled: () => false }),
  FeatureFlagsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Silence hooks network calls
jest.mock('../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));
jest.mock('../hanke/hankeUsers/hooks/useUserRightsForHanke', () => ({
  usePermissionsForHanke: () => ({ data: null }),
}));
jest.mock('../application/hooks/useAttachments', () => () => ({ data: [], isError: false }));
jest.mock('../application/hooks/useSaveApplication', () => () => ({
  applicationCreateMutation: { mutate: jest.fn() },
  applicationUpdateMutation: { mutate: jest.fn() },
  showSaveNotification: false,
  setShowSaveNotification: jest.fn(),
}));
jest.mock('../application/hooks/useNavigateToApplicationView', () => () => jest.fn());

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'fi', changeLanguage: jest.fn(), exists: () => true },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const hankeData: HankeData = {
  hankeTunnus: 'HAI-PERSIST',
  nimi: 'Persist Hanke',
  vaihe: 'OHJELMOINTI',
  alkuPvm: new Date('2025-01-01').toISOString(),
  loppuPvm: new Date('2025-12-31').toISOString(),
  alueet: [],
  tyomaaTyyppi: [],
  tyomaaKatuosoite: 'Testikatu 1',
} as unknown as HankeData;

// Start with empty contacts so we simulate user entry
const application: Application<KaivuilmoitusData> = {
  id: 999,
  applicationType: 'EXCAVATION_NOTIFICATION',
  applicationIdentifier: 'KAIVU-999',
  alluStatus: null,
  hankeTunnus: 'HAI-PERSIST',
  applicationData: {
    applicationType: 'EXCAVATION_NOTIFICATION',
    name: 'Nimi',
    workDescription: 'Desc',
    constructionWork: true,
    maintenanceWork: false,
    emergencyWork: false,
    rockExcavation: null,
    cableReportDone: null,
    cableReports: [],
    placementContracts: [],
    requiredCompetence: false,
    areas: [],
    startTime: new Date('2025-04-01'),
    endTime: new Date('2025-04-10'),
    representativeWithContacts: null,
    propertyDeveloperWithContacts: null,
    customerWithContacts: null,
    contractorWithContacts: null,
    invoicingCustomer: null,
  },
};

function mount() {
  const qc = new QueryClient();
  return render(
    <MemoryRouter>
      <GlobalNotificationProvider>
        <QueryClientProvider client={qc}>
          <KaivuilmoitusContainer hankeData={hankeData} application={application} />
        </QueryClientProvider>
      </GlobalNotificationProvider>
    </MemoryRouter>,
  );
}

/**
 * This test verifies that user-entered contact person data for all contact groups and invoicing customer
 * persist across a simulated language change (component unmount + remount). Regression: previously only
 * the customerWithContacts group state was persisted leading to loss of contractor/propertyDeveloper/representative
 * contacts and invoicing customer fields.
 */
it('persists all contact person groups & invoicing customer across language change', () => {
  const utils = mount();
  const formCtx = (
    window as unknown as {
      kaivuFormContext: import('react-hook-form').UseFormReturn<
        import('./types').KaivuilmoitusFormValues
      >;
    }
  ).kaivuFormContext;
  expect(formCtx).toBeTruthy();

  act(() => {
    // Add työstä vastaava (customerWithContacts)
    formCtx.setValue('applicationData.customerWithContacts', {
      customer: {
        yhteystietoId: null,
        type: ContactType.COMPANY,
        name: 'Yritys Oy',
        email: 'yritys@example.com',
        phone: '0100100',
        registryKey: '1234567-8',
        registryKeyHidden: false,
      },
      contacts: [
        {
          firstName: 'Eta',
          lastName: 'Beta',
          email: 'eta.beta@example.com',
          phone: '0401234567',
        },
      ],
    });

    // Add contractor
    formCtx.setValue('applicationData.contractorWithContacts', {
      customer: {
        yhteystietoId: null,
        type: ContactType.COMPANY,
        name: 'Urakoitsija Oy',
        email: 'urakoitsija@example.com',
        phone: '0200200',
        registryKey: '7654321-0',
        registryKeyHidden: false,
      },
      contacts: [
        {
          firstName: 'Con',
          lastName: 'Tractor',
          email: 'contractor.person@example.com',
          phone: '0507654321',
        },
      ],
    });

    // Add representative
    formCtx.setValue('applicationData.representativeWithContacts', {
      customer: {
        yhteystietoId: null,
        type: ContactType.COMPANY,
        name: 'Asianhoitaja Oy',
        email: 'rep@example.com',
        phone: '0300300',
        registryKey: '2345678-9',
        registryKeyHidden: false,
      },
      contacts: [
        {
          firstName: 'A',
          lastName: 'Rep',
          email: 'a.rep@example.com',
          phone: '0400000000',
        },
      ],
    });

    // Add property developer
    formCtx.setValue('applicationData.propertyDeveloperWithContacts', {
      customer: {
        yhteystietoId: null,
        type: ContactType.COMPANY,
        name: 'Rakennuttaja Oy',
        email: 'rakennuttaja@example.com',
        phone: '0400400',
        registryKey: '3456789-1',
        registryKeyHidden: false,
      },
      contacts: [
        {
          firstName: 'Pro',
          lastName: 'Dev',
          email: 'prop.dev@example.com',
          phone: '0401111111',
        },
      ],
    });

    // Add invoicing customer
    formCtx.setValue('applicationData.invoicingCustomer', {
      type: ContactType.COMPANY,
      name: 'Laskutus Oy',
      registryKey: '1111111-1',
      registryKeyHidden: false,
      ovt: 'OVT123',
      invoicingOperator: 'OPR',
      customerReference: 'REF-123',
      postalAddress: {
        streetAddress: { streetName: 'Laskukatu 5' },
        postalCode: '00100',
        city: 'Helsinki',
      },
      email: 'laskutus@example.com',
      phone: '0402222222',
    });
  });

  // Force snapshot immediately before unmount simulating language change
  act(() => {
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
  });

  utils.unmount();
  mount();
  const newFormCtx = (
    window as unknown as {
      kaivuFormContext: import('react-hook-form').UseFormReturn<
        import('./types').KaivuilmoitusFormValues
      >;
    }
  ).kaivuFormContext;

  // Assert persisted contact groups
  expect(newFormCtx.getValues('applicationData.contractorWithContacts.customer.name')).toBe(
    'Urakoitsija Oy',
  );
  expect(newFormCtx.getValues('applicationData.representativeWithContacts.customer.name')).toBe(
    'Asianhoitaja Oy',
  );
  expect(newFormCtx.getValues('applicationData.propertyDeveloperWithContacts.customer.name')).toBe(
    'Rakennuttaja Oy',
  );
  expect(newFormCtx.getValues('applicationData.invoicingCustomer.name')).toBe('Laskutus Oy');
  expect(
    newFormCtx.getValues(
      'applicationData.invoicingCustomer.postalAddress.streetAddress.streetName',
    ),
  ).toBe('Laskukatu 5');
  expect(newFormCtx.getValues('applicationData.invoicingCustomer.ovt')).toBe('OVT123');
});
