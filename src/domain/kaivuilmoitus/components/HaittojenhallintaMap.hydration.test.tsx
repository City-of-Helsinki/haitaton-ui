import React from 'react';
import { render, act } from '@testing-library/react';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import KaivuilmoitusContainer from '../KaivuilmoitusContainer';
import { HankeData, HankeAlue } from '../../types/hanke';
import { Application, KaivuilmoitusData, Tyoalue } from '../../application/types/application';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router';
import { GlobalNotificationProvider } from '../../../common/components/globalNotification/GlobalNotificationContext';
import '@testing-library/jest-dom';

// Lightweight translation mock
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'fi', changeLanguage: vi.fn(), exists: () => true },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Silence network/permission hooks
vi.mock('../../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));
vi.mock('../../hanke/hankeUsers/hooks/useUserRightsForHanke', () => ({
  usePermissionsForHanke: () => ({ data: null }),
}));
vi.mock('../../application/hooks/useAttachments', () => () => ({ data: [], isError: false }));
vi.mock('../../application/hooks/useSaveApplication', () => () => ({
  applicationCreateMutation: { mutate: vi.fn() },
  applicationUpdateMutation: { mutate: vi.fn() },
  showSaveNotification: false,
  setShowSaveNotification: vi.fn(),
}));
vi.mock('../../application/hooks/useNavigateToApplicationView', () => () => vi.fn());
vi.mock('../../../common/components/featureFlags/FeatureFlagsContext', () => ({
  useFeatureFlags: () => ({ flags: {}, isEnabled: () => false }),
}));

// Mock heavy sub pages from container so mounting faster
vi.mock('../BasicInfo', () => () => <div>BasicInfo</div>);
vi.mock('../Contacts', () => () => <div>Contacts</div>);
vi.mock('../Attachments', () => () => <div>Attachments</div>);
vi.mock('../ReviewAndSend', () => () => <div>ReviewAndSend</div>);
vi.mock('../components/FormErrorsNotification', () => () => null);
vi.mock('../components/TyoalueTable', () => () => <div>TyoalueTable</div>);
vi.mock('../components/AreaSelectDialog', () => () => null);
vi.mock('../../common/haittaIndexes/HaittaIndexes', () => () => <div>HaittaIndexes</div>);
vi.mock('../components/HaittojenhallintaSuunnitelma.module.scss', () => ({}));
vi.mock('../Kaivuilmoitus.module.scss', () => ({}));

// Reduce map complexity: mock map & layers (we only test feature cloning logic, not OL rendering)
vi.mock(
  '../../application/components/ApplicationMap',
  () =>
    ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
);
vi.mock('../../map/components/Layers/Kantakartta', () => () => <div />);
vi.mock('../../map/components/Layers/HankeLayer', () => () => <div />);
vi.mock('../../map/components/Layers/HakemusLayer', () => () => <div />);
vi.mock('../../map/components/AddressSearch/AddressSearchContainer', () => () => <div />);
vi.mock('../../../common/components/map/controls/OverviewMapControl', () => () => <div />);
vi.mock(
  '../../../common/components/map/layers/VectorLayer',
  () => (props: { children?: React.ReactNode }) => <div>{props.children}</div>,
);
vi.mock(
  '../../../common/components/map/Map',
  () =>
    ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
);
vi.mock('../../map/components/interations/FitSource', () => () => null);
vi.mock('../../common/haittojenhallinta/CommonProcedureTips', () => () => null);

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

// Provide only fields the component references; cast to HankeData to bypass exhaustive typing.
const hankeData = {
  id: 1,
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
  onYKTHanke: false,
} as unknown as HankeData;

const application: Application<KaivuilmoitusData> = {
  id: 555,
  applicationIdentifier: 'KAIVU-555',
  applicationType: 'EXCAVATION_NOTIFICATION',
  alluStatus: null,
  hankeTunnus: 'HAI-TEST',
  applicationData: {
    applicationType: 'EXCAVATION_NOTIFICATION',
    name: 'HydrationTest',
    workDescription: '',
    constructionWork: false,
    maintenanceWork: false,
    emergencyWork: false,
    rockExcavation: null,
    cableReportDone: null,
    cableReports: [],
    placementContracts: [],
    requiredCompetence: false,
    areas: [
      {
        name: 'Alue 1',
        hankealueId: 1,
        katuosoite: 'Katutie 1',
        tyonTarkoitukset: [],
        meluhaitta: 'EI_MELUHAITTAA',
        polyhaitta: 'EI_POLYHAITTAA',
        tarinahaitta: 'EI_TARINAHAITTAA',
        kaistahaitta: 'EI_VAIKUTA',
        kaistahaittojenPituus: 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
        lisatiedot: undefined,
        haittojenhallintasuunnitelma: {},
        tyoalueet: [
          // Provide minimal Tyoalue shape with placeholder feature required by type
          (() => {
            const placeholderFeature = createFeature();
            const ta = new Tyoalue(placeholderFeature);
            // Remove geometry feature to simulate missing openlayersFeature prior to hydration
            delete (ta as unknown as { openlayersFeature?: Feature<Polygon> }).openlayersFeature;
            return ta;
          })(),
        ],
      },
    ],
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

// Regression test: HaittojenhallintaMap should not crash when hydration populates openlayersFeature after mount.
// We simulate hydration by assigning an OpenLayers Feature onto the nested työalue and dispatching the language change event.
it('hydrates työalue feature for HaittojenhallintaMap without crashing', async () => {
  const utils = mount();

  // Initial snapshot before feature exists
  act(() => {
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
  });

  // Inject openlayersFeature post-mount via test escape hatch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formCtx = (window as any).kaivuFormContext as import('react-hook-form').UseFormReturn<any>;
  expect(formCtx).toBeTruthy();
  const feature = createFeature();
  act(() => {
    formCtx.setValue('applicationData.areas.0.tyoalueet.0.openlayersFeature', feature);
  });

  // Trigger language change again to force persistence snapshot & hydration path
  await act(async () => {
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await new Promise((res) => setTimeout(res, 30));
  });
  // Verify persistence contains the snapshot (indirect verification that hydration path was triggered)
  const raw = sessionStorage.getItem('functional-application-form-555-KAIVU');
  expect(raw).toBeTruthy();
  utils.unmount();
});
