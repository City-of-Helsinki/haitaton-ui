import React from 'react';
import { render, act } from '@testing-library/react';
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { HankeData, HankeAlue } from '../types/hanke';
import {
  Application,
  KaivuilmoitusData,
  KaivuilmoitusAlue,
  Tyoalue,
} from '../application/types/application';
import '@testing-library/jest-dom';
import { GlobalNotificationProvider } from '../../common/components/globalNotification/GlobalNotificationContext';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock non-area pages
jest.mock('./BasicInfo', () => () => <div>BasicInfo</div>);
jest.mock('./Contacts', () => () => <div>Contacts</div>);
jest.mock('./Attachments', () => () => <div>Attachments</div>);
jest.mock('./ReviewAndSend', () => () => <div>ReviewAndSend</div>);
jest.mock('./HaittojenHallinta', () => () => <div>Haitat</div>);
jest.mock('./components/FormErrorsNotification', () => () => null);
jest.mock('../application/components/ApplicationSendDialog', () => () => <div />);

jest.mock('../../common/components/featureFlags/FeatureFlagsContext', () => ({
  useFeatureFlags: () => ({ flags: {}, isEnabled: () => false }),
  FeatureFlagsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'fi', changeLanguage: jest.fn(), exists: () => true },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

// Helper
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

const hankeData: HankeData = {
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

const application: Application<KaivuilmoitusData> = {
  id: 999,
  applicationType: 'EXCAVATION_NOTIFICATION',
  applicationIdentifier: 'KAIVU-999',
  alluStatus: null,
  hankeTunnus: 'HAI-TEST',
  applicationData: {
    applicationType: 'EXCAVATION_NOTIFICATION',
    name: 'Test Kaivu Areas',
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

it('keeps työalue geometry visible across language change on Areas page', async () => {
  const utils = mount();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formCtx = (window as any).kaivuFormContext as import('react-hook-form').UseFormReturn<any>;
  expect(formCtx).toBeTruthy();

  // Add area with a työalue
  const feature = createFeature();
  const tyoalue = new Tyoalue(feature);
  const area: KaivuilmoitusAlue = {
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

  act(() => {
    formCtx.setValue('applicationData.areas', [area], { shouldDirty: true });
  });

  // Trigger snapshot then remount (simulated language change)
  act(() => {
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
  });
  utils.unmount();
  mount();

  const newFormCtx = // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).kaivuFormContext as import('react-hook-form').UseFormReturn<any>;
  // Allow queued hydration + repair pass (which runs inside afterHydrate) to complete
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
  const areas = newFormCtx.getValues('applicationData.areas');
  expect(Array.isArray(areas)).toBe(true);
  const first = areas[0];
  expect(first).toBeDefined();
  // Geometry should hydrate into nested tyoalueet.openlayersFeature
  const hydratedTyoalue = first.tyoalueet[0];
  expect(hydratedTyoalue.openlayersFeature).toBeTruthy();
  expect(hydratedTyoalue.openlayersFeature.getGeometry()).toBeTruthy();
});
