import React from 'react'; // top-level import okay outside mock factories
import { render, waitFor, cleanup } from '../../../testUtils/render';
import userEvent from '@testing-library/user-event';
import KaivuilmoitusContainer from '../KaivuilmoitusContainer';
import { Application, KaivuilmoitusData } from '../../application/types/application';
import { HankeData } from '../../types/hanke';

// Mock heavy child components to focus on persistence only
// Mock BasicInfo but still integrate with react-hook-form so persistence hook sees updates
jest.mock('../BasicInfo', () => {
  const { useFormContext } = jest.requireActual('react-hook-form');
  const ReactLocal = jest.requireActual('react');
  return function MockBasicInfo() {
    const { register } = useFormContext();
    return ReactLocal.createElement(
      'div',
      null,
      ReactLocal.createElement('input', {
        'data-testid': 'applicationData.name',
        ...register('applicationData.name'),
      }),
      ReactLocal.createElement('textarea', {
        'data-testid': 'applicationData.workDescription',
        ...register('applicationData.workDescription'),
      }),
    );
  };
});
jest.mock('../Contacts', () => ({ __esModule: true, default: () => null }));
jest.mock('../Areas', () => ({ __esModule: true, default: () => null }));
jest.mock('../HaittojenHallinta', () => ({ __esModule: true, default: () => null }));
jest.mock('../Attachments', () => ({ __esModule: true, default: () => null }));
jest.mock('../ReviewAndSend', () => ({ __esModule: true, default: () => null }));
// Minimal FormActions stub
jest.mock('../../forms/components/FormActions', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../../application/components/ApplicationCancel', () => ({
  ApplicationCancel: () => null,
}));
jest.mock('../../application/components/ApplicationSendDialog', () => () => null);
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

describe('KaivuilmoitusContainer language persistence integration', () => {
  const hanke: HankeData = { hankeTunnus: 'HKAIVU1', nimi: 'Hanke Kaivu' } as HankeData;
  const application: Application<KaivuilmoitusData> = {
    id: 77,
    alluStatus: null,
    applicationType: 'EXCAVATION_NOTIFICATION',
    hankeTunnus: hanke.hankeTunnus,
    applicationData: {
      applicationType: 'EXCAVATION_NOTIFICATION',
      name: 'Initial excavation',
      workDescription: 'Desc',
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

  function mount(app?: Application<KaivuilmoitusData>) {
    return render(<KaivuilmoitusContainer hankeData={hanke} application={app} />);
  }

  beforeEach(() => {
    sessionStorage.clear();
    cleanup();
  });

  test('persists application name across language change event', async () => {
    const { getByTestId, unmount } = mount(application);
    const user = userEvent.setup();
    const nameInput = getByTestId('applicationData.name') as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Edited Excavation');

    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await waitFor(() => expect(sessionStorage.getItem('application-form-77-KAIVU')).toBeTruthy());

    unmount();
    const { getByTestId: get2 } = mount({
      ...application,
      applicationData: { ...application.applicationData, name: 'Server Excavation Name' },
    });
    const nameAfter = get2('applicationData.name') as HTMLInputElement;
    expect(nameAfter.value).toBe('Edited Excavation');
  });
});
