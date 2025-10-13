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
jest.mock('./Contacts', () => () => <div>Contacts</div>);
jest.mock('./BasicInfo', () => () => <div>BasicInfo</div>);
jest.mock('./ReviewAndSend', () => () => <div>ReviewAndSend</div>);
jest.mock('./Areas', () => () => <div>Areas</div>);
jest.mock('./HaittojenHallinta', () => () => <div>Haitat</div>);
jest.mock('./components/FormErrorsNotification', () => () => null);
jest.mock('../application/components/ApplicationSendDialog', () => () => <div />);

jest.mock('../../common/components/featureFlags/FeatureFlagsContext', () => ({
  useFeatureFlags: () => ({ flags: {}, isEnabled: () => false }),
  FeatureFlagsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

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
    <MemoryRouter>
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
