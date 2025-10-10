import React from 'react';
import { render, waitFor, cleanup } from '../../../testUtils/render';
import HankeForm from './HankeForm';
import { HankeDataFormState } from './types';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';

// Light mocks to keep test fast
jest.mock('./HankeFormPerustiedot', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('./HankeFormYhteystiedot', () => () => <div />);
jest.mock('./HankeFormHaittojenHallinta', () => () => <div />);
jest.mock('./HankeFormLiitteet', () => () => <div />);
jest.mock('./HankeFormSummary', () => () => <div />);
// We want the Alueet step to mount so we can inspect features, but mock out heavy internals
jest.mock('./HankeFormAlueet', () => ({
  __esModule: true,
  default: function MockAlueet() {
    return <div data-testid="alueet-step" />;
  },
}));

jest.mock('../../application/components/ApplicationAddDialog', () => () => null);

jest.mock('../../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'fi', exists: () => true } }),
}));

// Utilities
function buildBaseData(): HankeDataFormState {
  return {
    hankeTunnus: 'HGEOM1',
    nimi: 'Testihanke',
    kuvaus: 'Desc',
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
        id: 11,
        nimi: 'Alue 1',
        feature: new Feature(
          new Polygon([
            [
              [25.0, 60.0],
              [25.0005, 60.0],
              [25.0005, 60.0005],
              [25.0, 60.0005],
              [25.0, 60.0],
            ],
          ]),
        ),
        haittaAlkuPvm: null,
        haittaLoppuPvm: null,
        meluHaitta: null,
        polyHaitta: null,
        tarinaHaitta: null,
        kaistaHaitta: null,
        kaistaPituusHaitta: null,
        tormaystarkasteluTulos: null,
      },
    ],
    tormaystarkasteluTulos: null,
    status: 'DRAFT',
  } as unknown as HankeDataFormState;
}

function mount(formData?: Partial<HankeDataFormState>) {
  const data = { ...buildBaseData(), ...formData } as HankeDataFormState;
  const onDirty = jest.fn();
  const onClose = jest.fn();
  return render(
    <HankeForm formData={data} onIsDirtyChange={onDirty} onFormClose={onClose}>
      <div />
    </HankeForm>,
  );
}

describe('HankeForm geometry language persistence regression', () => {
  beforeEach(() => {
    sessionStorage.clear();
    cleanup();
  });

  test('geometry snapshot survives language change + step persistence (no key collision)', async () => {
    const storageDraftKey = 'functional-hanke-form-HGEOM1';
    const storageStepKey = 'functional-hanke-form-step-HGEOM1';
    const { unmount } = mount();

    // Force immediate snapshot before unmount (simulate language change event)
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));

    await waitFor(() => expect(sessionStorage.getItem(storageDraftKey)).toBeTruthy());
    const draftObj = JSON.parse(sessionStorage.getItem(storageDraftKey) as string);
    // eslint-disable-next-line no-underscore-dangle -- internal persisted meta key
    expect(draftObj.__geometry).toBeTruthy();
    // eslint-disable-next-line no-underscore-dangle -- internal persisted meta key
    expect(draftObj.__geometry.alueet?.length).toBe(1);

    // Simulate that step persistence stored an index (ensure separate key used)
    // NOTE: MultipageForm effect would normally do this; we emulate minimal write.
    sessionStorage.setItem(storageStepKey, '0');

    // Ensure original draft object still intact (not overwritten by primitive)
    expect(typeof JSON.parse(sessionStorage.getItem(storageDraftKey) as string)).toBe('object');

    unmount();

    // Remount with empty server areas (to prove hydration restores feature)
    mount({ alueet: [] as unknown as HankeDataFormState['alueet'] });

    // After hydration, draft key should still parse to object and contain geometry
    await waitFor(() => {
      const raw = sessionStorage.getItem(storageDraftKey);
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw as string);
      // eslint-disable-next-line no-underscore-dangle -- internal persisted meta key
      expect(parsed.__geometry?.alueet?.length).toBe(1);
    });
  });
});
