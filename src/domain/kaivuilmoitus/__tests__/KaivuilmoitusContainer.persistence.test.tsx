import React from 'react';
import { render, waitFor, cleanup } from '../../../testUtils/render';
import userEvent from '@testing-library/user-event';
import KaivuilmoitusContainer from '../KaivuilmoitusContainer';
import { Application, KaivuilmoitusData } from '../../application/types/application';
import { HankeData } from '../../types/hanke';

// Mock heavy child components to focus on persistence only
jest.mock('../BasicInfo', () => () => (
  <div>
    <input data-testid="applicationData.name" defaultValue="Initial excavation" />
    <textarea data-testid="applicationData.workDescription" defaultValue="Desc" />
  </div>
));
jest.mock('../Contacts', () => () => <div data-testid="mock-contacts" />);
jest.mock('../Areas', () => () => <div data-testid="mock-areas" />);
jest.mock('../HaittojenHallinta', () => () => <div data-testid="mock-haitat" />);
jest.mock('../Attachments', () => () => <div data-testid="mock-attachments" />);
jest.mock('../ReviewAndSend', () => () => <div data-testid="mock-review" />);
jest.mock('../../application/components/ApplicationCancel', () => () => null);
jest.mock('../../application/components/ApplicationSendDialog', () => () => null);
jest.mock('../../application/hooks/useAttachments', () => () => ({ data: [], isError: false }));
jest.mock('../../common/components/globalNotification/GlobalNotificationContext', () => ({
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
  useTranslation: () => ({ t: (k: string) => k }),
}));

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
