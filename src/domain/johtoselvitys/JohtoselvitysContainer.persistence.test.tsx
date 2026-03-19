import React from 'react';
import { render, waitFor, cleanup, fireEvent } from '../../testUtils/render';
import userEvent from '@testing-library/user-event';
import JohtoselvitysContainer from './JohtoselvitysContainer';
import { Application, JohtoselvitysData } from '../application/types/application';
import { HankeData } from '../types/hanke';

// Mock heavy subcomponents and contexts similar to Kaivuilmoitus persistence tests
vi.mock('./BasicInfo', async () => {
  const { useFormContext } =
    await vi.importActual<typeof import('react-hook-form')>('react-hook-form');
  return {
    __esModule: true,
    BasicInfo: ({
      applicationData,
    }: {
      applicationData?: { name?: string; workDescription?: string };
    }) => {
      const { register, setValue } = useFormContext();
      if (applicationData) {
        // seed values when component mounts (mirrors Kaivuilmoitus mock behavior)
        if (applicationData.name) setValue('applicationData.name', applicationData.name);
        if (applicationData.workDescription)
          setValue('applicationData.workDescription', applicationData.workDescription);
      }
      return (
        <div>
          <input {...register('applicationData.name')} data-testid="applicationData.name" />
          <textarea
            {...register('applicationData.workDescription')}
            data-testid="applicationData.workDescription"
          />
        </div>
      );
    },
  };
});

// Lightweight mocks for heavy components and contexts
vi.mock('../application/components/ApplicationContacts', async () => {
  const { useFormContext } =
    await vi.importActual<typeof import('react-hook-form')>('react-hook-form');
  return {
    __esModule: true,
    default: () => {
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
vi.mock('./Geometries', () => ({ __esModule: true, Geometries: () => null }));
vi.mock('./ReviewAndSend', () => ({ __esModule: true, ReviewAndSend: () => null }));
vi.mock('../forms/components/FormActions', () => ({ __esModule: true, default: () => null }));
vi.mock('../application/components/ApplicationCancel', () => ({ ApplicationCancel: () => null }));
vi.mock('../application/hooks/useAttachments', () => () => ({ data: [], isError: false }));
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
vi.mock('../application/components/ApplicationSendDialog', () => () => null);
vi.mock('react-i18next', async () => ({
  ...(await vi.importActual<object>('react-i18next')),
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'fi', exists: () => true, changeLanguage: vi.fn() },
  }),
}));
vi.mock('../application/hooks/useNavigateToApplicationView', () => vi.fn(() => vi.fn()));

describe('JohtoselvitysContainer language persistence integration', () => {
  const hanke: HankeData = { hankeTunnus: 'HJOHTO1', nimi: 'Hanke Johto' } as HankeData;

  const contactApp: Application<JohtoselvitysData> = {
    id: 99,
    applicationType: 'CABLE_REPORT',
    hankeTunnus: hanke.hankeTunnus,
    applicationData: {
      applicationType: 'CABLE_REPORT',
      name: 'Initial Johto',
      customerWithContacts: null,
      areas: [],
      startTime: null,
      endTime: null,
      workDescription: '',
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

  const nameApp: Application<JohtoselvitysData> = {
    id: 55,
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

  function mount(app?: Application<JohtoselvitysData>, initialStep?: number) {
    return render(
      <JohtoselvitysContainer hankeData={hanke} application={app} initialStep={initialStep} />,
    );
  }

  beforeEach(() => {
    sessionStorage.clear();
    cleanup();
  });

  test('persists contact person fields across language change', async () => {
    const { getByTestId, unmount } = mount(contactApp, 2);
    // Use fireEvent to update inputs synchronously
    // Navigate to Contacts step (click stepper button index 3)
    const buttons = document.querySelectorAll('button');
    if (buttons[2]) buttons[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitFor(() =>
      expect(getByTestId('applicationData.customerWithContacts.customer.name')).toBeTruthy(),
    );

    const custName = getByTestId(
      'applicationData.customerWithContacts.customer.name',
    ) as HTMLInputElement;
    fireEvent.change(custName, { target: { value: 'Johto Company' } });
    const firstName = getByTestId(
      'applicationData.customerWithContacts.contacts.0.firstName',
    ) as HTMLInputElement;
    fireEvent.change(firstName, { target: { value: 'Liisa' } });
    const lastName = getByTestId(
      'applicationData.customerWithContacts.contacts.0.lastName',
    ) as HTMLInputElement;
    fireEvent.change(lastName, { target: { value: 'Lahti' } });

    await waitFor(() =>
      expect(
        (getByTestId('applicationData.customerWithContacts.customer.name') as HTMLInputElement)
          .value,
      ).toBe('Johto Company'),
    );
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await waitFor(() =>
      expect(sessionStorage.getItem('functional-application-form-99-JOHTO')).toBeTruthy(),
    );

    unmount();

    const remountApp = {
      ...contactApp,
      applicationData: {
        ...contactApp.applicationData,
        customerWithContacts: {
          customer: { name: 'Server', registryKey: '', email: '', phone: '' },
          contacts: [{ firstName: 'S', lastName: 'U', email: '', phone: '' }],
        },
      },
    } as unknown as Application<JohtoselvitysData>;

    const { getByTestId: get2 } = mount(remountApp, 2);
    await waitFor(() =>
      expect(get2('applicationData.customerWithContacts.customer.name')).toBeTruthy(),
    );

    expect(
      (get2('applicationData.customerWithContacts.customer.name') as HTMLInputElement).value,
    ).toBe('Johto Company');
    expect(
      (get2('applicationData.customerWithContacts.contacts.0.firstName') as HTMLInputElement).value,
    ).toBe('Liisa');
    expect(
      (get2('applicationData.customerWithContacts.contacts.0.lastName') as HTMLInputElement).value,
    ).toBe('Lahti');
  });

  test('persists name across language change event', async () => {
    const { getByTestId, unmount } = mount(nameApp, 0);
    const user = userEvent.setup();
    // Use a minimal BasicInfo mock that registers 'applicationData.name' under test utils; find via testid 'applicationData.name' may exist in real component
    const nameInput = getByTestId('applicationData.name') as HTMLInputElement | null;
    if (nameInput) {
      await user.clear(nameInput);
      await user.type(nameInput, 'Edited Cable Report');
    }

    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await waitFor(() =>
      expect(sessionStorage.getItem('functional-application-form-55-JOHTO')).toBeTruthy(),
    );

    unmount();
    const { getByTestId: getByTestId2 } = mount({
      ...nameApp,
      applicationData: { ...nameApp.applicationData, name: 'Server side name' },
    });
    const nimiAfter = getByTestId2('applicationData.name') as HTMLInputElement | null;
    if (nimiAfter) expect(nimiAfter.value).toBe('Edited Cable Report');
  });
});
