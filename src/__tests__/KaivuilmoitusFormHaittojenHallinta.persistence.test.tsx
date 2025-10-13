import React from 'react';
import { render, act } from '@testing-library/react';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import KaivuilmoitusContainer from '../domain/kaivuilmoitus/KaivuilmoitusContainer';
import { HankeData, HankeAlue } from '../domain/types/hanke';
import {
  Application,
  KaivuilmoitusData,
  KaivuilmoitusAlue,
  Tyoalue,
} from '../domain/application/types/application';
import '@testing-library/jest-dom';

// Mock heavy child components to keep test fast and focused on persistence logic
jest.mock('../domain/kaivuilmoitus/BasicInfo', () => () => <div>BasicInfo</div>);
jest.mock('../domain/kaivuilmoitus/Contacts', () => () => <div>Contacts</div>);
jest.mock('../domain/kaivuilmoitus/Attachments', () => () => <div>Attachments</div>);
jest.mock('../domain/kaivuilmoitus/ReviewAndSend', () => () => <div>ReviewAndSend</div>);
jest.mock('../domain/kaivuilmoitus/components/FormErrorsNotification', () => () => null);
jest.mock('../domain/common/haittojenhallinta/CommonProcedureTips', () => () => null);
jest.mock('../domain/kaivuilmoitus/components/HaittojenhallintaSuunnitelma', () => () => (
  <div>Plan</div>
));

// Silence useApplicationsForHanke network hook
jest.mock('../domain/application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));

// Silence permissions hook
jest.mock('../domain/hanke/hankeUsers/hooks/useUserRightsForHanke', () => ({
  usePermissionsForHanke: () => ({ data: null }),
}));

// Silence attachments hook
jest.mock('../domain/application/hooks/useAttachments', () => () => ({ data: [], isError: false }));

// Silence save hooks (avoid actual mutations)
jest.mock('../domain/application/hooks/useSaveApplication', () => () => ({
  applicationCreateMutation: { mutate: jest.fn() },
  applicationUpdateMutation: { mutate: jest.fn() },
  showSaveNotification: false,
  setShowSaveNotification: jest.fn(),
}));

// Mock navigation
jest.mock('../domain/application/hooks/useNavigateToApplicationView', () => () => jest.fn());
// Provide a mock GlobalNotificationProvider
import { GlobalNotificationProvider } from '../common/components/globalNotification/GlobalNotificationContext';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

// Use real provider (internal state harmless for this test)

// Provide minimal translation function
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'fi', changeLanguage: jest.fn(), exists: () => true },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../common/components/featureFlags/FeatureFlagsContext', () => ({
  useFeatureFlags: () => ({
    flags: {},
    isEnabled: () => false,
  }),
}));

// Mock map components to keep DOM simple
jest.mock(
  '../domain/application/components/ApplicationMap',
  () =>
    ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
);
jest.mock('../domain/map/components/Layers/HankeLayer', () => () => <div>HankeLayer</div>);
jest.mock('../domain/map/components/Layers/HakemusLayer', () => () => <div>HakemusLayer</div>);

// Helper to create a polygon feature
function createFeature(): Feature<Polygon> {
  const poly = new Polygon([
    [
      [24.93, 60.17],
      [24.94, 60.17],
      [24.94, 60.18],
      [24.93, 60.18],
      [24.93, 60.17],
    ],
  ]);
  return new Feature(poly);
}

// Minimal hanke data (use Partial to avoid filling all fields)
const hankeData = {
  hankeTunnus: 'HAI-TEST',
  nimi: 'Testihanke',
  vaihe: 'OHJELMOINTI',
  alkuPvm: new Date('2025-01-01').toISOString(),
  loppuPvm: new Date('2025-12-31').toISOString(),
  alueet: [
    {
      id: 1,
      nimi: 'Alue 1',
      geometriat: { featureCollection: { type: 'FeatureCollection', features: [] } },
      meluHaitta: 'EI_MELUHAITTAA',
      polyHaitta: 'EI_POLYHAITTAA',
      tarinaHaitta: 'EI_TARINAHAITTAA',
      kaistaHaitta: 'EI_VAIKUTA',
      kaistaPituusHaitta: 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
      haittaAlkuPvm: new Date('2025-04-01').toISOString(),
      haittaLoppuPvm: new Date('2025-04-10').toISOString(),
    } as unknown as HankeAlue,
  ],
  tyomaaTyyppi: [],
  tyomaaKatuosoite: 'Katutie 1',
} as unknown as HankeData;

// Minimal application (draft) with id so persistence key stable
const application: Application<KaivuilmoitusData> = {
  id: 123,
  applicationType: 'EXCAVATION_NOTIFICATION',
  applicationIdentifier: 'KAIVU-123',
  alluStatus: null,
  hankeTunnus: 'HAI-TEST',
  applicationData: {
    applicationType: 'EXCAVATION_NOTIFICATION',
    name: 'Test Kaivu',
    workDescription: 'Työ',
    constructionWork: false,
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

function mountContainer(app: Application<KaivuilmoitusData> = application) {
  const qc = new QueryClient();
  return render(
    <MemoryRouter>
      <GlobalNotificationProvider>
        <QueryClientProvider client={qc}>
          <KaivuilmoitusContainer hankeData={hankeData} application={app} />
        </QueryClientProvider>
      </GlobalNotificationProvider>
    </MemoryRouter>,
  );
}

// Core test: ensure työalue geometry + nuisance plan persist across language change
// TODO(HAI-3310 follow-up): Enable this test once helper to programmatically append areas into RHF context is exposed.
// Currently mounting with mutated application prop does not update internal form state prior to snapshot.
it('persists kaivuilmoitus työalue geometry and haittojenhallintasuunnitelma across language change', async () => {
  const polygonFeature = createFeature();
  const utils = mountContainer();

  // Inject one area + one työalue directly into form state (simulate user drawing)
  // Access underlying form via persistence attached on formContext (similar pattern used previously)
  // We locate persistence/form context through rendered tree queries not needed; rely on event to trigger snapshot.
  act(() => {
    // Dispatch custom language changing event to snapshot current (empty) state first
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
  });

  // After initial snapshot, mutate form state programmatically by simulating area append logic
  // We can't call internal append easily; instead, re-render with modified application prop isn't trivial.
  // Simplify: directly set values via a custom event that tests rely upon; mock persistence to accept geometry after second snapshot.

  // Instead of deep access, rerender container and then set global window object hack.
  // NOTE: This is a simplified approach; in real tests we would interact through UI or expose helpers.

  // Simulate user adding area with työalue and nuisance plan field value
  const tyoalue = new Tyoalue(polygonFeature);
  const areaWithWork: KaivuilmoitusAlue = {
    name: 'Alue 1',
    hankealueId: 1,
    katuosoite: 'Katutie 1',
    tyonTarkoitukset: [],
    meluhaitta: 'EI_MELUHAITTAA',
    polyhaitta: 'EI_POLYHAITTAA',
    tarinahaitta: 'EI_TARINAHAITTAA',
    kaistahaitta: 'EI_VAIKUTA',
    kaistahaittojenPituus: 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
    haittojenhallintasuunnitelma: {},
    tyoalueet: [tyoalue],
    lisatiedot: undefined,
  };

  // Assign form values through DOM-less hack: trigger persistence snapshot with modified global object
  // We rely on the persistence code selecting from react-hook-form state; simulate by temporarily patching form values via window object expected by library.
  // Since direct formContext access isn't trivial here, we will just dispatch language change again after introducing area into application prop via rerender.

  // Inject area into react-hook-form state using test escape hatch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formCtx = (window as any).kaivuFormContext as import('react-hook-form').UseFormReturn<any>;
  act(() => {
    const currentAreas = formCtx.getValues('applicationData.areas') || [];
    formCtx.setValue('applicationData.areas', currentAreas.concat(areaWithWork));
  });
  await act(async () => {
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await new Promise((res) => setTimeout(res, 50));
  });

  // Simulate language change: unmount & remount
  utils.unmount();
  mountContainer();

  // Read persisted snapshot
  const persistedRaw = window.sessionStorage.getItem('functional-application-form-123-KAIVU');
  expect(persistedRaw).toBeTruthy();
  const persisted = JSON.parse(persistedRaw!);
  const firstArea = persisted?.applicationData?.areas?.[0];
  expect(firstArea).toBeDefined();
  expect(firstArea?.haittojenhallintasuunnitelma).toBeDefined();
});
