import React from 'react';
import { render, waitFor, cleanup } from '../../../testUtils/render';
import userEvent from '@testing-library/user-event';
import KaivuilmoitusMuutosilmoitusContainer from '../KaivuilmoitusMuutosilmoitusContainer';
import { Muutosilmoitus } from '../../application/muutosilmoitus/types';
import { Application, KaivuilmoitusData } from '../../application/types/application';
import { HankeData } from '../../types/hanke';

// Mock heavy child components
jest.mock('../../kaivuilmoitus/BasicInfo', () => () => (
  <div>
    <input data-testid="applicationData.name" defaultValue="Initial muutos" />
  </div>
));
jest.mock('../../kaivuilmoitus/Areas', () => () => <div data-testid="mock-areas" />);
jest.mock('../../kaivuilmoitus/HaittojenHallinta', () => () => <div data-testid="mock-haitat" />);
jest.mock('../../kaivuilmoitus/Contacts', () => () => <div data-testid="mock-contacts" />);
jest.mock('../../application/taydennysAndMuutosilmoitusCommon/components/Attachments', () => () => (
  <div data-testid="mock-attachments" />
));
jest.mock('../ReviewAndSend', () => () => <div data-testid="mock-review" />);
jest.mock('../../application/components/ApplicationSendDialog', () => () => null);
jest.mock('../../application/muutosilmoitus/components/MuutosilmoitusCancel', () => () => null);
jest.mock('../../application/hooks/useAttachments', () => () => ({ data: [], isError: false }));
jest.mock('../../../common/components/globalNotification/GlobalNotificationContext', () => ({
  GlobalNotificationProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useGlobalNotification: () => ({ setNotification: jest.fn() }),
}));
jest.mock('../../hanke/hankeUsers/hooks/useUserRightsForHanke', () => ({
  usePermissionsForHanke: () => ({ data: undefined }),
}));
jest.mock('../../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: {
      language: 'fi',
      exists: () => true,
      changeLanguage: jest.fn(),
    },
  }),
}));
jest.mock('../../application/hooks/useNavigateToApplicationView', () => {
  return jest.fn(() => jest.fn());
});

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
      expect(sessionStorage.getItem('muutosilmoitus-form-900-KAIVU')).toBeTruthy(),
    );

    unmount();
    const { getByTestId: get2 } = mount();
    const nameAfter = get2('applicationData.name') as HTMLInputElement;
    expect(nameAfter.value).toBe('Edited Muutos');
  });
});
