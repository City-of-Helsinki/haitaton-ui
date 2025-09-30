import React from 'react';
// Adjusted path after moving test up one directory from __tests__
import { render, waitFor, cleanup } from '../../testUtils/render';
import userEvent from '@testing-library/user-event';
// Adjusted relative imports after moving file out of __tests__
import JohtoselvitysContainer from './JohtoselvitysContainer';
import { Application, JohtoselvitysData } from '../application/types/application';
import { HankeData } from '../types/hanke';

// Light mocks for heavy/irrelevant child components
jest.mock('./Geometries', () => ({
  Geometries: () => <div data-testid="mock-geometries" />,
}));
jest.mock('./Attachments', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-attachments" />,
}));
jest.mock('./ReviewAndSend', () => ({
  ReviewAndSend: () => <div data-testid="mock-review" />,
}));
jest.mock('./BasicInfo', () => ({
  BasicInfo: ({
    applicationData,
  }: {
    applicationData?: { name: string; workDescription: string };
  }) => {
    const { useFormContext } = jest.requireActual('react-hook-form');
    const { register, setValue } = useFormContext();
    // Seed defaults if provided via props (since we use RHF-controlled fields)
    if (applicationData) {
      setValue('applicationData.name', applicationData.name);
      setValue('applicationData.workDescription', applicationData.workDescription);
    }
    return (
      <div>
        <input {...register('applicationData.name')} data-testid="nimi" />
        <textarea {...register('applicationData.workDescription')} data-testid="workDescription" />
      </div>
    );
  },
}));
jest.mock('../application/components/ApplicationContacts', () => () => (
  <div data-testid="mock-contacts" />
));
jest.mock('../application/components/ApplicationCancel', () => ({
  ApplicationCancel: () => null,
}));
jest.mock('../application/components/ApplicationSendDialog', () => () => null);
jest.mock('../application/hooks/useAttachments', () => () => ({ data: [], isError: false }));
jest.mock('../../common/components/globalNotification/GlobalNotificationContext', () => ({
  __esModule: true,
  GlobalNotificationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useGlobalNotification: () => ({ isOpen: false, options: undefined, setNotification: jest.fn() }),
}));
jest.mock('../hanke/hankeUsers/hooks/useUserRightsForHanke', () => ({
  usePermissionsForHanke: () => ({ data: undefined }),
}));
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: {
      language: 'fi',
      exists: () => true,
    },
  }),
}));

describe('JohtoselvitysContainer language persistence integration', () => {
  const hanke: HankeData = {
    hankeTunnus: 'HTUNNUS1',
    nimi: 'Hanke Nimi',
  } as HankeData;

  const application: Application<JohtoselvitysData> = {
    id: 55,
    alluStatus: null,
    applicationType: 'CABLE_REPORT',
    hankeTunnus: hanke.hankeTunnus,
    applicationData: {
      applicationType: 'CABLE_REPORT',
      name: 'Initial cable report',
      customerWithContacts: null,
      areas: [],
      startTime: null,
      endTime: null,
      workDescription: 'Desc',
      contractorWithContacts: null,
      postalAddress: { streetAddress: { streetName: '' }, city: '', postalCode: '' },
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
      constructionWork: false,
      maintenanceWork: false,
      emergencyWork: false,
      propertyConnectivity: false,
      rockExcavation: null,
    },
  } as unknown as Application<JohtoselvitysData>;

  function mount(app?: Application<JohtoselvitysData>) {
    return render(<JohtoselvitysContainer hankeData={hanke} application={app} />);
  }

  beforeEach(() => {
    sessionStorage.clear();
    cleanup();
  });

  test('persists name across language change event', async () => {
    const { getByTestId, unmount } = mount(application);
    const user = userEvent.setup();
    const nimi = getByTestId('nimi') as HTMLInputElement;
    await user.clear(nimi);
    await user.type(nimi, 'Edited Cable Report');

    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await waitFor(() => expect(sessionStorage.getItem('application-form-55-JOHTO')).toBeTruthy());

    unmount();

    const { getByTestId: getByTestId2 } = mount({
      ...application,
      applicationData: { ...application.applicationData, name: 'Server side name' },
    });
    const nimiAfter = getByTestId2('nimi') as HTMLInputElement;
    expect(nimiAfter.value).toBe('Edited Cable Report');
  });
});
