import React from 'react'; // top-level import okay outside mock factories
// Adjusted path after moving test up one directory from __tests__
import { render, waitFor, cleanup, fireEvent } from '../../testUtils/render';
import userEvent from '@testing-library/user-event';
// Adjusted relative imports after moving file out of __tests__
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import { Application, KaivuilmoitusData } from '../application/types/application';
import { HankeData } from '../types/hanke';

// Mock heavy child components to focus on persistence only
// Mock BasicInfo but still integrate with react-hook-form so persistence hook sees updates
jest.mock('./BasicInfo', () => {
  const { useFormContext } = jest.requireActual('react-hook-form');
  return function MockBasicInfo() {
    const { register } = useFormContext();
    return (
      <div>
        <input data-testid="applicationData.name" {...register('applicationData.name')} />
        <textarea
          data-testid="applicationData.workDescription"
          {...register('applicationData.workDescription')}
        />
        <input
          type="checkbox"
          data-testid="applicationData.constructionWork"
          {...register('applicationData.constructionWork')}
        />
        <input
          type="checkbox"
          data-testid="applicationData.maintenanceWork"
          {...register('applicationData.maintenanceWork')}
        />
        <input
          type="checkbox"
          data-testid="applicationData.emergencyWork"
          {...register('applicationData.emergencyWork')}
        />
        <input
          type="checkbox"
          data-testid="applicationData.requiredCompetence"
          {...register('applicationData.requiredCompetence')}
        />
        <input
          data-testid="applicationData.cableReports.0"
          {...register('applicationData.cableReports.0')}
        />
      </div>
    );
  };
});
jest.mock('./Contacts', () => {
  const { useFormContext } = jest.requireActual('react-hook-form');
  return {
    __esModule: true,
    default: () => {
      // Capitalized wrapper to appease lint/react rules for hook usage
      function ContactsMockInner() {
        const { register } = useFormContext();
        return (
          <div>
            <input
              data-testid="applicationData.customerWithContacts.customer.name"
              {...register('applicationData.customerWithContacts.customer.name')}
            />
            <input
              data-testid="applicationData.customerWithContacts.customer.registryKey"
              {...register('applicationData.customerWithContacts.customer.registryKey')}
            />
            <input
              data-testid="applicationData.customerWithContacts.customer.email"
              {...register('applicationData.customerWithContacts.customer.email')}
            />
            <input
              data-testid="applicationData.customerWithContacts.customer.phone"
              {...register('applicationData.customerWithContacts.customer.phone')}
            />
            <input
              data-testid="applicationData.customerWithContacts.contacts.0.firstName"
              {...register('applicationData.customerWithContacts.contacts.0.firstName')}
            />
            <input
              data-testid="applicationData.customerWithContacts.contacts.0.lastName"
              {...register('applicationData.customerWithContacts.contacts.0.lastName')}
            />
          </div>
        );
      }
      return <ContactsMockInner />;
    },
  };
});
jest.mock('./Areas', () => ({ __esModule: true, default: () => null }));
jest.mock('./HaittojenHallinta', () => ({ __esModule: true, default: () => null }));
jest.mock('./Attachments', () => ({ __esModule: true, default: () => null }));
jest.mock('./ReviewAndSend', () => ({ __esModule: true, default: () => null }));
// Minimal FormActions stub
jest.mock('../forms/components/FormActions', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../application/components/ApplicationCancel', () => ({
  ApplicationCancel: () => null,
}));
jest.mock('../application/components/ApplicationSendDialog', () => () => null);
jest.mock('../application/hooks/useAttachments', () => () => ({ data: [], isError: false }));
jest.mock('../../common/components/globalNotification/GlobalNotificationContext', () => ({
  GlobalNotificationProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useGlobalNotification: () => ({ setNotification: jest.fn() }),
}));
jest.mock('../hanke/hankeUsers/hooks/useUserRightsForHanke', () => ({
  usePermissionsForHanke: () => ({ data: undefined }),
}));
jest.mock('../application/hooks/useApplications', () => ({
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
jest.mock('../application/hooks/useNavigateToApplicationView', () => {
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

  test('persists name, booleans and cable report id across language change', async () => {
    const { getByTestId, unmount } = mount(application);
    const user = userEvent.setup();
    const nameInput = getByTestId('applicationData.name') as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Edited Excavation');
    await user.click(getByTestId('applicationData.constructionWork'));
    await user.click(getByTestId('applicationData.maintenanceWork'));
    await user.click(getByTestId('applicationData.requiredCompetence'));
    const cable0 = getByTestId('applicationData.cableReports.0') as HTMLInputElement;
    await user.type(cable0, 'CR-1');

    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await waitFor(() => expect(sessionStorage.getItem('application-form-77-KAIVU')).toBeTruthy());

    unmount();
    const { getByTestId: get2 } = mount({
      ...application,
      applicationData: { ...application.applicationData, name: 'Server Excavation Name' },
    });
    const nameAfter = get2('applicationData.name') as HTMLInputElement;
    expect(nameAfter.value).toBe('Edited Excavation');
    expect((get2('applicationData.constructionWork') as HTMLInputElement).checked).toBe(true);
    expect((get2('applicationData.maintenanceWork') as HTMLInputElement).checked).toBe(true);
    expect((get2('applicationData.requiredCompetence') as HTMLInputElement).checked).toBe(true);
    expect((get2('applicationData.cableReports.0') as HTMLInputElement).value).toBe('CR-1');
    // Contact fields not on first step in this lightweight mock; validated in container-level test elsewhere
  });

  test('persists contact person fields across language change', async () => {
    const { getByTestId, unmount } = mount(application);

    // Navigate to Contacts step so contact inputs are rendered
    const contactsStepButton = document.querySelectorAll('button')[3];
    if (contactsStepButton)
      contactsStepButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitFor(() =>
      expect(getByTestId('applicationData.customerWithContacts.customer.name')).toBeTruthy(),
    );

    // Fill customer and first contact fields synchronously to ensure react-hook-form sees updates
    const custName = getByTestId(
      'applicationData.customerWithContacts.customer.name',
    ) as HTMLInputElement;
    fireEvent.change(custName, { target: { value: 'Persisted Company' } });

    const firstName = getByTestId(
      'applicationData.customerWithContacts.contacts.0.firstName',
    ) as HTMLInputElement;
    fireEvent.change(firstName, { target: { value: 'Matti' } });

    const lastName = getByTestId(
      'applicationData.customerWithContacts.contacts.0.lastName',
    ) as HTMLInputElement;
    fireEvent.change(lastName, { target: { value: 'Meikäläinen' } });

    // Ensure the DOM inputs reflect the full typed values before snapshotting
    await waitFor(() =>
      expect(
        (getByTestId('applicationData.customerWithContacts.customer.name') as HTMLInputElement)
          .value,
      ).toBe('Persisted Company'),
    );
    await waitFor(() =>
      expect(
        (
          getByTestId(
            'applicationData.customerWithContacts.contacts.0.firstName',
          ) as HTMLInputElement
        ).value,
      ).toBe('Matti'),
    );
    await waitFor(() =>
      expect(
        (
          getByTestId(
            'applicationData.customerWithContacts.contacts.0.lastName',
          ) as HTMLInputElement
        ).value,
      ).toBe('Meikäläinen'),
    );

    // Trigger immediate snapshot before route/language change
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await waitFor(() => expect(sessionStorage.getItem('application-form-77-KAIVU')).toBeTruthy());

    // Unmount and remount with different server-provided values to ensure persisted values take effect
    unmount();
    const remountApp = {
      ...application,
      applicationData: {
        ...application.applicationData,
        customerWithContacts: {
          customer: {
            name: 'Server Company',
            registryKey: '0000000-0',
            email: 'server@example.com',
            phone: '999',
          },
          contacts: [{ firstName: 'Server', lastName: 'User', email: 's@t', phone: '' }],
        },
      },
    } as unknown as Application<KaivuilmoitusData>;

    const { getByTestId: get2 } = mount(remountApp);

    // Navigate to Contacts step after remount to ensure inputs are rendered
    const contactsStepButton2 = document.querySelectorAll('button')[3];
    if (contactsStepButton2)
      contactsStepButton2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitFor(() =>
      expect(get2('applicationData.customerWithContacts.customer.name')).toBeTruthy(),
    );

    expect(
      (get2('applicationData.customerWithContacts.customer.name') as HTMLInputElement).value,
    ).toBe('Persisted Company');
    expect(
      (get2('applicationData.customerWithContacts.contacts.0.firstName') as HTMLInputElement).value,
    ).toBe('Matti');
    expect(
      (get2('applicationData.customerWithContacts.contacts.0.lastName') as HTMLInputElement).value,
    ).toBe('Meikäläinen');
  });
});
