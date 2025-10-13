import React from 'react';
import { render, act } from '@testing-library/react';
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import { HankeData } from '../types/hanke';
import { Application, KaivuilmoitusData } from '../application/types/application';
import '@testing-library/jest-dom';
import { GlobalNotificationProvider } from '../../common/components/globalNotification/GlobalNotificationContext';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock other pages except BasicInfo
jest.mock('./Contacts', () => () => <div>Contacts</div>);
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

// Silence hooks
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
  hankeTunnus: 'HAI-TEST',
  nimi: 'Testihanke',
  vaihe: 'OHJELMOINTI',
  alkuPvm: new Date('2025-01-01').toISOString(),
  loppuPvm: new Date('2025-12-31').toISOString(),
  alueet: [],
  tyomaaTyyppi: [],
  tyomaaKatuosoite: 'Katutie 1',
} as unknown as HankeData;

const application: Application<KaivuilmoitusData> = {
  id: 321,
  applicationType: 'EXCAVATION_NOTIFICATION',
  applicationIdentifier: 'KAIVU-321',
  alluStatus: null,
  hankeTunnus: 'HAI-TEST',
  applicationData: {
    applicationType: 'EXCAVATION_NOTIFICATION',
    name: 'Alkuperäinen Nimi',
    workDescription: 'Kuvaus',
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

it('persists basic info fields across language change even when they were dirty initially', async () => {
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
    formCtx.setValue('applicationData.name', 'Muokattu Nimi', { shouldDirty: true });
    formCtx.setValue('applicationData.workDescription', 'Muokattu Kuvaus', { shouldDirty: true });
    formCtx.setValue('applicationData.constructionWork', true, { shouldDirty: true });
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
  expect(newFormCtx.getValues('applicationData.name')).toBe('Muokattu Nimi');
  expect(newFormCtx.getValues('applicationData.workDescription')).toBe('Muokattu Kuvaus');
  expect(newFormCtx.getValues('applicationData.constructionWork')).toBe(true);
});
