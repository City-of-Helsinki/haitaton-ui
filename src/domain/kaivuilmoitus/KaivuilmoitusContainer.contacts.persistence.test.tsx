import React from 'react';
import { render, act, waitFor, fireEvent, screen } from '@testing-library/react';
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import { HankeData } from '../types/hanke';
import { Application, KaivuilmoitusData, ContactType } from '../application/types/application';
import '@testing-library/jest-dom';
import { GlobalNotificationProvider } from '../../common/components/globalNotification/GlobalNotificationContext';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock other pages except Contacts to keep test lightweight
vi.mock('./BasicInfo', () => ({ default: () => <div>BasicInfo</div> }));
vi.mock('./Attachments', () => ({ default: () => <div>Attachments</div> }));
vi.mock('./ReviewAndSend', () => ({ default: () => <div>ReviewAndSend</div> }));
vi.mock('./Areas', () => ({ default: () => <div>Areas</div> }));
vi.mock('./HaittojenHallinta', () => ({ default: () => <div>Haitat</div> }));
vi.mock('./components/FormErrorsNotification', () => ({ default: () => null }));
vi.mock('../application/components/ApplicationSendDialog', () => ({ default: () => <div /> }));

vi.mock('../../common/components/featureFlags/FeatureFlagsContext', () => ({
  useFeatureFlags: () => ({ flags: {}, isEnabled: () => false }),
  FeatureFlagsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Silence hooks network calls
vi.mock('../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));
vi.mock('../hanke/hankeUsers/hooks/useUserRightsForHanke', () => ({
  usePermissionsForHanke: () => ({ data: null }),
}));
vi.mock('../application/hooks/useAttachments', () => ({
  default: () => ({ data: [], isError: false }),
}));
vi.mock('../application/hooks/useSaveApplication', () => ({
  default: () => ({
    applicationCreateMutation: { mutate: vi.fn() },
    applicationUpdateMutation: { mutate: vi.fn() },
    showSaveNotification: false,
    setShowSaveNotification: vi.fn(),
  }),
}));
vi.mock('../application/hooks/useNavigateToApplicationView', () => ({ default: () => vi.fn() }));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'fi', changeLanguage: vi.fn(), exists: () => true },
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
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
          hankekayttajaId: 'contact-eta-beta',
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
          hankekayttajaId: 'contact-con-tractor',
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
          hankekayttajaId: 'contact-a-rep',
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
          hankekayttajaId: 'contact-pro-dev',
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
  // Verify first contact person of each group persisted (name & email)
  expect(newFormCtx.getValues('applicationData.customerWithContacts.contacts.0.firstName')).toBe(
    'Eta',
  );
  expect(newFormCtx.getValues('applicationData.customerWithContacts.contacts.0.email')).toBe(
    'eta.beta@example.com',
  );
  expect(newFormCtx.getValues('applicationData.contractorWithContacts.contacts.0.firstName')).toBe(
    'Con',
  );
  expect(
    newFormCtx.getValues('applicationData.representativeWithContacts.contacts.0.firstName'),
  ).toBe('A');
  expect(
    newFormCtx.getValues('applicationData.propertyDeveloperWithContacts.contacts.0.firstName'),
  ).toBe('Pro');
});

describe('invoicing customer registryKey language change persistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  function mountEmpty() {
    const qc = new QueryClient();
    return render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <GlobalNotificationProvider>
          <QueryClientProvider client={qc}>
            <KaivuilmoitusContainer hankeData={hankeData} application={application} />
          </QueryClientProvider>
        </GlobalNotificationProvider>
      </MemoryRouter>,
    );
  }

  test('keeps company Business ID after language change', () => {
    const utils = mountEmpty();
    const formCtx = (
      window as unknown as {
        kaivuFormContext: import('react-hook-form').UseFormReturn<
          import('./types').KaivuilmoitusFormValues
        >;
      }
    ).kaivuFormContext;
    act(() => {
      formCtx.setValue('applicationData.invoicingCustomer', {
        type: ContactType.COMPANY,
        name: 'Company Oy',
        registryKey: '1234567-8',
        registryKeyHidden: false,
        ovt: null,
        invoicingOperator: null,
        customerReference: null,
        postalAddress: {
          streetAddress: { streetName: 'Testikatu 1' },
          postalCode: '00100',
          city: 'Helsinki',
        },
        email: 'comp@example.com',
        phone: '0401231234',
      });
    });
    act(() => {
      window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    });
    utils.unmount();
    mountEmpty();
    const newCtx = (
      window as unknown as {
        kaivuFormContext: import('react-hook-form').UseFormReturn<
          import('./types').KaivuilmoitusFormValues
        >;
      }
    ).kaivuFormContext;
    expect(newCtx.getValues('applicationData.invoicingCustomer.registryKey')).toBe('1234567-8');
  });

  test('keeps person hetu after language change', () => {
    const utils = mountEmpty();
    const formCtx = (
      window as unknown as {
        kaivuFormContext: import('react-hook-form').UseFormReturn<
          import('./types').KaivuilmoitusFormValues
        >;
      }
    ).kaivuFormContext;
    act(() => {
      formCtx.setValue('applicationData.invoicingCustomer', {
        type: ContactType.PERSON,
        name: 'Henkilö Henkinen',
        registryKey: '010101-123A',
        registryKeyHidden: false,
        ovt: null,
        invoicingOperator: null,
        customerReference: null,
        postalAddress: {
          streetAddress: { streetName: 'Testipolku 2' },
          postalCode: '00200',
          city: 'Helsinki',
        },
        email: 'person@example.com',
        phone: '0409876543',
      });
    });
    act(() => {
      window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    });
    utils.unmount();
    mountEmpty();
    const newCtx = (
      window as unknown as {
        kaivuFormContext: import('react-hook-form').UseFormReturn<
          import('./types').KaivuilmoitusFormValues
        >;
      }
    ).kaivuFormContext;
    expect(newCtx.getValues('applicationData.invoicingCustomer.registryKey')).toBe('010101-123A');
  });

  test('clears registryKey only when switching type PERSON -> COMPANY (semantic change) but persists across subsequent language change', async () => {
    const utils = mountEmpty();
    const formCtx = (
      window as unknown as {
        kaivuFormContext: import('react-hook-form').UseFormReturn<
          import('./types').KaivuilmoitusFormValues
        >;
      }
    ).kaivuFormContext;
    act(() => {
      formCtx.setValue('applicationData.invoicingCustomer', {
        type: ContactType.PERSON,
        name: 'Henkilö Henkinen',
        registryKey: '010101-123A',
        registryKeyHidden: false,
        ovt: null,
        invoicingOperator: null,
        customerReference: null,
        postalAddress: {
          streetAddress: { streetName: 'Testipolku 2' },
          postalCode: '00200',
          city: 'Helsinki',
        },
        email: 'person@example.com',
        phone: '0409876543',
      });
    });
    // Switch type to COMPANY -> should clear registryKey according to new logic when value existed
    // Navigate to Contacts step so fields are registered and type change logic runs
    const contactsStepButton = screen.getByRole('button', { name: /form:headers:yhteystiedot/i });
    act(() => {
      fireEvent.click(contactsStepButton);
    });
    act(() => {
      formCtx.setValue('applicationData.invoicingCustomer.type', ContactType.COMPANY);
    });
    // Wait for effect cycle to process resetField
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    await waitFor(() => {
      expect(formCtx.getValues('applicationData.invoicingCustomer.registryKey')).toBeNull();
    });
    // Enter new business id
    act(() => {
      formCtx.setValue('applicationData.invoicingCustomer.registryKey', '2222222-2');
    });
    await act(async () => {
      window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    });
    utils.unmount();
    // Clear step persistence so remount starts at BasicInfo (step 0), not Contacts (step 3).
    // Without this, Contacts renders during hydration and its normalization effect converts
    // the initially-undefined registryKey to null, overriding the hydrated '2222222-2' value.
    sessionStorage.removeItem('functional-application-form-step-999-KAIVU-activeStep');
    mountEmpty();
    const newCtx = (
      window as unknown as {
        kaivuFormContext: import('react-hook-form').UseFormReturn<
          import('./types').KaivuilmoitusFormValues
        >;
      }
    ).kaivuFormContext;
    expect(newCtx.getValues('applicationData.invoicingCustomer.registryKey')).toBe('2222222-2');
  });
});
