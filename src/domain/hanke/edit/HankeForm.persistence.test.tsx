import React from 'react';
// Adjusted path after moving test up one directory from __tests__
import { render, waitFor, cleanup } from '../../../testUtils/render';
import userEvent from '@testing-library/user-event';
// Adjusted relative imports after moving file out of __tests__
import HankeForm from './HankeForm';
import { HankeDataFormState } from './types';

// Mock heavy sub components rendered inside steps to keep test light & fast.
vi.mock('./HankeFormAlueet', () => ({ default: () => <div data-testid="mock-alueet" /> }));
vi.mock('./HankeFormPerustiedot', async () => {
  const { useFormContext } =
    await vi.importActual<typeof import('react-hook-form')>('react-hook-form');
  return {
    __esModule: true,
    default: function MockHankeFormPerustiedot() {
      const { register } = useFormContext();
      return (
        <div>
          <input {...register('nimi')} data-testid="nimi" />
          <textarea {...register('kuvaus')} data-testid="kuvaus" />
        </div>
      );
    },
  };
});
vi.mock('./HankeFormYhteystiedot', () => ({
  default: () => <div data-testid="mock-yhteystiedot" />,
}));
vi.mock('./HankeFormHaittojenHallinta', () => ({
  default: () => <div data-testid="mock-haitat" />,
}));
vi.mock('./HankeFormLiitteet', () => ({ default: () => <div data-testid="mock-liitteet" /> }));
vi.mock('./HankeFormSummary', () => ({ default: () => <div data-testid="mock-summary" /> }));
vi.mock('../../application/components/ApplicationAddDialog', () => ({ default: () => null }));

// Simplify useApplicationsForHanke hook so form renders immediately
vi.mock('../../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));

// No-op for map draw provider heavy stuff
vi.mock('../../../common/components/map/modules/draw/DrawProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Provide deterministic translation (return key)
vi.mock('react-i18next', async () => ({
  ...(await vi.importActual<object>('react-i18next')),
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: {
      language: 'fi',
      exists: () => true,
    },
  }),
}));

describe('HankeForm language persistence integration', () => {
  const baseData: HankeDataFormState = {
    hankeTunnus: 'HTEST123',
    nimi: 'Alku nimi',
    kuvaus: 'kuvaus',
    tyomaaKatuosoite: '',
    vaihe: null,
    tyomaaTyyppi: [],
    onYKTHanke: null,
    alkuPvm: null,
    loppuPvm: null,
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    alueet: [],
    tormaystarkasteluTulos: null,
    status: 'DRAFT',
  } as unknown as HankeDataFormState;

  function mountOnce(overrides: Partial<HankeDataFormState> = {}) {
    const formData = { ...baseData, ...overrides } as HankeDataFormState;
    const onDirty = vi.fn();
    const onClose = vi.fn();
    return render(
      <HankeForm formData={formData} onIsDirtyChange={onDirty} onFormClose={onClose}>
        <div />
      </HankeForm>,
    );
  }

  beforeEach(() => {
    sessionStorage.clear();
    cleanup();
  });

  test('edits to nimi persist across simulated language change (unmount/remount)', async () => {
    const { getByTestId, unmount } = mountOnce();
    const user = userEvent.setup();
    const nimiInput = getByTestId('nimi') as HTMLInputElement;
    await user.clear(nimiInput);
    await user.type(nimiInput, 'Muokattu nimi');

    // Fire custom event that our persistence hook listens to for immediate snapshot
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));

    // Storage key should now exist
    await waitFor(() =>
      expect(sessionStorage.getItem('functional-hanke-form-HTEST123')).toBeTruthy(),
    );

    // Simulate component unmount due to route/language change
    unmount();

    // Remount form (fresh instance) - should hydrate persisted nimi
    const { getByTestId: getByTestId2 } = mountOnce({ nimi: 'Server nimi' });
    const nimiAfter = getByTestId2('nimi') as HTMLInputElement;
    await waitFor(() => expect(nimiAfter.value).toBe('Muokattu nimi'));
  });
});
