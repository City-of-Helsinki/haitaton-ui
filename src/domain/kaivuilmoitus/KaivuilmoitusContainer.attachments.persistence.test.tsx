import React from 'react';
import { render, act } from '@testing-library/react';
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import { HankeData } from '../types/hanke';
import { Application, KaivuilmoitusData } from '../application/types/application';
import '@testing-library/jest-dom';
import { GlobalNotificationProvider } from '../../common/components/globalNotification/GlobalNotificationContext';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock other pages except Attachments to keep scope small
vi.mock('./Contacts', () => ({ default: () => <div>Contacts</div> }));
vi.mock('./BasicInfo', () => ({ default: () => <div>BasicInfo</div> }));
vi.mock('./ReviewAndSend', () => ({ default: () => <div>ReviewAndSend</div> }));
vi.mock('./Areas', () => ({ default: () => <div>Areas</div> }));
vi.mock('./HaittojenHallinta', () => ({ default: () => <div>Haitat</div> }));
vi.mock('./components/FormErrorsNotification', () => ({ default: () => null }));
vi.mock('../application/components/ApplicationSendDialog', () => ({ default: () => <div /> }));

vi.mock('../../common/components/featureFlags/FeatureFlagsContext', () => ({
  useFeatureFlags: () => ({ flags: {}, isEnabled: () => false }),
  FeatureFlagsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

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
  hankeTunnus: 'HAI-ATTACH',
  nimi: 'Attachment Hanke',
  vaihe: 'OHJELMOINTI',
  alkuPvm: new Date('2025-01-01').toISOString(),
  loppuPvm: new Date('2025-12-31').toISOString(),
  alueet: [],
  tyomaaTyyppi: [],
  tyomaaKatuosoite: 'Testikatu 2',
} as unknown as HankeData;

const application: Application<KaivuilmoitusData> = {
  id: 1001,
  applicationType: 'EXCAVATION_NOTIFICATION',
  applicationIdentifier: 'KAIVU-1001',
  alluStatus: null,
  hankeTunnus: 'HAI-ATTACH',
  applicationData: {
    applicationType: 'EXCAVATION_NOTIFICATION',
    name: 'Testi',
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
    startTime: new Date('2025-05-01'),
    endTime: new Date('2025-05-10'),
    additionalInfo: null,
    customerWithContacts: null,
    contractorWithContacts: null,
    representativeWithContacts: null,
    propertyDeveloperWithContacts: null,
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

it('persists additionalInfo field across language change', () => {
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
    formCtx.setValue('applicationData.additionalInfo', 'Lisätieto jota ei saa kadota', {
      shouldDirty: true,
    });
  });

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

  expect(newFormCtx.getValues('applicationData.additionalInfo')).toBe(
    'Lisätieto jota ei saa kadota',
  );
});
