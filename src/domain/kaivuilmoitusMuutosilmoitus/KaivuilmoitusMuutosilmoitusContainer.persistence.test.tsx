import React from 'react';
// Adjusted path after moving test up one directory from __tests__
import { render, waitFor, cleanup } from '../../testUtils/render';
import userEvent from '@testing-library/user-event';
// Adjusted relative imports after moving file out of __tests__
import KaivuilmoitusMuutosilmoitusContainer from './KaivuilmoitusMuutosilmoitusContainer';
import { Muutosilmoitus } from '../application/muutosilmoitus/types';
import { Application, KaivuilmoitusData } from '../application/types/application';
import { HankeData } from '../types/hanke';

// Mock heavy child components
vi.mock('../kaivuilmoitus/BasicInfo', async () => {
  const { useFormContext } =
    await vi.importActual<typeof import('react-hook-form')>('react-hook-form');
  const ReactLocal = await vi.importActual<typeof import('react')>('react');
  return {
    default: function MockBasicInfo() {
      const { register } = useFormContext();
      return ReactLocal.createElement(
        'div',
        null,
        ReactLocal.createElement('input', {
          'data-testid': 'applicationData.name',
          ...register('applicationData.name'),
        }),
        ReactLocal.createElement('input', {
          type: 'checkbox',
          'data-testid': 'applicationData.constructionWork',
          ...register('applicationData.constructionWork'),
        }),
      );
    },
  };
});
vi.mock('../kaivuilmoitus/Areas', () => ({ __esModule: true, default: () => null }));
vi.mock('../kaivuilmoitus/HaittojenHallinta', () => ({
  __esModule: true,
  default: () => null,
}));
vi.mock('../kaivuilmoitus/Contacts', () => ({ __esModule: true, default: () => null }));
vi.mock('../application/taydennysAndMuutosilmoitusCommon/components/Attachments', () => ({
  __esModule: true,
  default: () => null,
}));
vi.mock('./ReviewAndSend', () => ({ __esModule: true, default: () => null }));
vi.mock('../application/components/ApplicationSendDialog', () => ({ default: () => null }));
vi.mock('../application/muutosilmoitus/components/MuutosilmoitusCancel', () => ({
  default: () => null,
}));
vi.mock('../application/hooks/useAttachments', () => ({
  default: () => ({ data: [], isError: false }),
}));
vi.mock('../../common/components/globalNotification/GlobalNotificationContext', () => ({
  GlobalNotificationProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useGlobalNotification: () => ({ setNotification: vi.fn() }),
}));
vi.mock('../hanke/hankeUsers/hooks/useUserRightsForHanke', () => ({
  usePermissionsForHanke: () => ({ data: undefined }),
}));
vi.mock('../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));
vi.mock('react-i18next', async () => ({
  ...(await vi.importActual<object>('react-i18next')),
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: {
      language: 'fi',
      exists: () => true,
      changeLanguage: vi.fn(),
    },
  }),
}));
vi.mock('../application/hooks/useNavigateToApplicationView', () => ({
  default: vi.fn(() => vi.fn()),
}));

describe('KaivuilmoitusMuutosilmoitusContainer language persistence integration', () => {
  const hanke: HankeData = { hankeTunnus: 'HMUUTOS1', nimi: 'Hanke Muutos' } as HankeData;
  const originalApplication: Application<KaivuilmoitusData> = {
    id: 500,
    alluStatus: null,
    applicationType: 'EXCAVATION_NOTIFICATION',
    hankeTunnus: hanke.hankeTunnus,
    applicationData: {
      applicationType: 'EXCAVATION_NOTIFICATION',
      name: 'Orig Excavation',
      workDescription: '',
      constructionWork: false,
      maintenanceWork: false,
      emergencyWork: false,
      rockExcavation: null,
      cableReportDone: null,
      cableReports: [],
      placementContracts: [],
      requiredCompetence: false,
      areas: [],
      startTime: null,
      endTime: null,
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
    },
  } as unknown as Application<KaivuilmoitusData>;

  const muutosilmoitus: Muutosilmoitus<KaivuilmoitusData> = {
    id: 900,
    version: 1,
    createdAt: '2024-01-01',
    createdBy: 'tester',
    updatedAt: '2024-01-01',
    updatedBy: 'tester',
    applicationData: originalApplication.applicationData,
    muutokset: [],
    liitteet: [],
  } as unknown as Muutosilmoitus<KaivuilmoitusData>;

  function mount() {
    return render(
      <KaivuilmoitusMuutosilmoitusContainer
        muutosilmoitus={muutosilmoitus}
        originalApplication={originalApplication}
        hankeData={hanke}
      />,
    );
  }

  beforeEach(() => {
    sessionStorage.clear();
    cleanup();
  });

  test('persists muutosilmoitus name across language change event', async () => {
    const { getByTestId, unmount } = mount();
    const user = userEvent.setup();
    const nameInput = getByTestId('applicationData.name') as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Edited Muutos');

    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await waitFor(() =>
      expect(sessionStorage.getItem('functional-muutosilmoitus-form-900-KAIVU')).toBeTruthy(),
    );

    unmount();
    const { getByTestId: get2 } = mount();
    const nameAfter = get2('applicationData.name') as HTMLInputElement;
    expect(nameAfter.value).toBe('Edited Muutos');
  });

  test('persists boolean fields like constructionWork', async () => {
    const { getByTestId, unmount } = mount();
    const user = userEvent.setup();

    // If constructionWork field not rendered in current mock, skip gracefully
    const checkbox = getByTestId('applicationData.constructionWork');
    await user.click(checkbox);

    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await waitFor(() =>
      expect(sessionStorage.getItem('functional-muutosilmoitus-form-900-KAIVU')).toContain('true'),
    );

    unmount();
    const { getByTestId: get2 } = mount();
    expect((get2('applicationData.constructionWork') as HTMLInputElement).checked).toBe(true);
  });
});
