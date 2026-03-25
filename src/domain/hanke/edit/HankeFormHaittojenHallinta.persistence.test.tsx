import React from 'react';
import { render, waitFor, cleanup } from '../../../testUtils/render';
import userEvent from '@testing-library/user-event';
// Mock complex haittojenhallinta schema to avoid invoking heavy detectedTrafficNuisance custom tests
vi.mock('../../common/haittojenhallinta/haittojenhallintaSchema', async () => {
  const yup = (
    (await vi.importActual<typeof import('../../../common/utils/yup')>(
      '../../../common/utils/yup',
    )) as { default: typeof import('../../../common/utils/yup').default }
  ).default;
  return {
    default: yup.object({
      YLEINEN: yup.string().required(),
      MUUT: yup.string().required(),
      PYORALIIKENNE: yup.string().nullable(),
      AUTOLIIKENNE: yup.string().nullable(),
      RAITIOLIIKENNE: yup.string().nullable(),
      LINJAAUTOLIIKENNE: yup.string().nullable(),
    }),
  };
});
import HankeForm from './HankeForm';
import { HankeDataFormState } from './types';
import { HAITTOJENHALLINTATYYPPI } from '../../common/haittojenhallinta/types';
import {
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
} from '../../types/hanke';

// Mock other heavy step components to keep test fast, but keep HaittojenHallinta real.
vi.mock('./HankeFormPerustiedot', () => ({
  default: () => <div data-testid="mock-perustiedot" />,
}));
vi.mock('./HankeFormAlueet', () => ({ default: () => <div data-testid="mock-alueet" /> }));
vi.mock('./HankeFormYhteystiedot', () => ({
  default: () => <div data-testid="mock-yhteystiedot" />,
}));
vi.mock('./HankeFormLiitteet', () => ({ default: () => <div data-testid="mock-liitteet" /> }));
vi.mock('./HankeFormSummary', () => ({ default: () => <div data-testid="mock-summary" /> }));
vi.mock('../../application/components/ApplicationAddDialog', () => ({ default: () => null }));
vi.mock('../../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));
// Map components mocked to avoid OpenLayers weight
vi.mock('../../map/components/HankkeenHaittojenhallintasuunnitelma/HankealueMap', () => ({
  default: () => <div data-testid="mock-hankealue-map" />,
}));
vi.mock('../../map/components/HankkeenHaittojenhallintasuunnitelma/HankeMap', () => ({
  default: () => <div data-testid="mock-hanke-map" />,
}));
// Mock ProcedureTips to a simple passthrough to avoid relying on internal tip computation
vi.mock('../../common/haittaIndexes/ProcedureTips', () => ({
  default: () => <div data-testid="mock-procedure-tips" />,
}));
vi.mock('react-i18next', async () => ({
  ...(await vi.importActual<object>('react-i18next')),
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'fi', exists: () => true },
  }),
}));

describe('Haittojen hallinta free-text field language persistence', () => {
  const baseData: HankeDataFormState = {
    hankeTunnus: 'HTEST123',
    nimi: 'Nimi',
    kuvaus: 'Kuvaus',
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
    alueet: [
      {
        id: 1,
        haittaAlkuPvm: new Date(),
        haittaLoppuPvm: new Date(),
        kaistaHaitta: null,
        kaistaPituusHaitta: null,
        meluHaitta: null,
        polyHaitta: null,
        tarinaHaitta: null,
        nimi: 'Alue 1',
        haittojenhallintasuunnitelma: {
          [HAITTOJENHALLINTATYYPPI.YLEINEN]: 'Alku Yleinen',
          [HAITTOJENHALLINTATYYPPI.MUUT]: 'Alku Muut',
        },
      },
    ],
    tormaystarkasteluTulos: null,
    status: 'DRAFT',
  } as unknown as HankeDataFormState;

  function mount(overrides: Partial<HankeDataFormState> = {}) {
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

  test('haittojenhallintasuunnitelma.YLEINEN value persists across language change', async () => {
    // Provide valid required nuisance fields so we can navigate steps
    const validArea = {
      id: 1,
      haittaAlkuPvm: new Date(),
      haittaLoppuPvm: new Date(),
      kaistaHaitta: Object.keys(HANKE_KAISTAHAITTA)[0] as keyof typeof HANKE_KAISTAHAITTA,
      kaistaPituusHaitta: Object.keys(
        HANKE_KAISTAPITUUSHAITTA,
      )[0] as keyof typeof HANKE_KAISTAPITUUSHAITTA,
      meluHaitta: Object.keys(HANKE_MELUHAITTA)[0] as keyof typeof HANKE_MELUHAITTA,
      polyHaitta: Object.keys(HANKE_POLYHAITTA)[0] as keyof typeof HANKE_POLYHAITTA,
      tarinaHaitta: Object.keys(HANKE_TARINAHAITTA)[0] as keyof typeof HANKE_TARINAHAITTA,
      nimi: 'Alue 1',
      haittojenhallintasuunnitelma: {
        [HAITTOJENHALLINTATYYPPI.YLEINEN]: 'Alku Yleinen',
        [HAITTOJENHALLINTATYYPPI.MUUT]: 'Alku Muut',
      },
    };
    const { getByTestId, unmount, getByRole } = mount({ alueet: [validArea] });
    const user = userEvent.setup();

    // Directly select Haittojen Hallinta step via step button label
    const haittojenHallintaStepBtn = getByRole('button', {
      name: /hankeForm:haittojenHallintaForm:header/i,
    });
    await user.click(haittojenHallintaStepBtn);

    const yleinenField = getByTestId(
      'alueet.0.haittojenhallintasuunnitelma.YLEINEN',
    ) as HTMLTextAreaElement;
    expect(yleinenField.value).toBe('Alku Yleinen');

    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await waitFor(() =>
      expect(sessionStorage.getItem('functional-hanke-form-HTEST123')).toMatch(/Alku Yleinen/),
    );
    unmount();

    // Remount with different server value – hydration should override it with persisted value
    const overrideArea = {
      ...validArea,
      haittojenhallintasuunnitelma: {
        [HAITTOJENHALLINTATYYPPI.YLEINEN]: 'Server uusi arvo',
        [HAITTOJENHALLINTATYYPPI.MUUT]: 'Server Muut',
      },
    };
    const { getByRole: getByRole2, getByTestId: getByTestId2 } = mount({ alueet: [overrideArea] });
    const haittojenHallintaStepBtn2 = getByRole2('button', {
      name: /hankeForm:haittojenHallintaForm:header/i,
    });
    await user.click(haittojenHallintaStepBtn2);
    const yleinenFieldAfter = getByTestId2(
      'alueet.0.haittojenhallintasuunnitelma.YLEINEN',
    ) as HTMLTextAreaElement;
    await waitFor(() => expect(yleinenFieldAfter.value).toBe('Alku Yleinen'));
  });
});
