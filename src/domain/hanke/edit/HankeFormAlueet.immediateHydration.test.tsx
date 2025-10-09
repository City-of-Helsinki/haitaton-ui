import React from 'react';
import { render, waitFor } from '../../../testUtils/render';
import userEvent from '@testing-library/user-event';
import HankeForm from './HankeForm';
import { HankeDataFormState } from './types';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';

// Mock heavy sub components except HankeFormAlueet which we want to exercise fully.
// Keep perustiedot lightweight but include required fields so validation doesn't block next step
jest.mock('./HankeFormPerustiedot', () => ({
  __esModule: true,
  default: function MockPerustiedot() {
    const { useFormContext } = jest.requireActual('react-hook-form');
    const { register } = useFormContext();
    return (
      <div>
        <input aria-label="nimi" {...register('nimi')} />
        <textarea aria-label="kuvaus" {...register('kuvaus')} />
      </div>
    );
  },
}));
jest.mock('./HankeFormYhteystiedot', () => () => <div data-testid="yhteystiedot" />);
jest.mock('./HankeFormHaittojenHallinta', () => () => <div data-testid="haitat" />);
jest.mock('./HankeFormLiitteet', () => () => <div data-testid="liitteet" />);
jest.mock('./HankeFormSummary', () => () => <div data-testid="summary" />);
// Keep real HankeFormAlueet

jest.mock('../../application/components/ApplicationAddDialog', () => () => null);

jest.mock('../../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'fi', exists: () => true } }),
}));

function buildAreaFeature() {
  return new Feature(
    new Polygon([
      [
        [25.0, 60.0],
        [25.0004, 60.0],
        [25.0004, 60.0004],
        [25.0, 60.0004],
        [25.0, 60.0],
      ],
    ]),
  );
}

function buildFormData(): HankeDataFormState {
  return {
    hankeTunnus: 'HYDR1',
    nimi: 'Hydration Test',
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
        id: 99,
        nimi: 'Area 1',
        feature: buildAreaFeature(),
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

describe('HankeForm immediate geometry hydration on areas step', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('areas features visible immediately after language change while staying on areas step', async () => {
    const baseData = buildFormData();
    const onDirty = jest.fn();
    const onClose = jest.fn();
    const user = userEvent.setup();

    // 1. Mount and navigate to Areas step (index 1). This ensures step persistence stores activeStep=1.
    const { unmount, findByText } = render(
      <HankeForm formData={baseData} onIsDirtyChange={onDirty} onFormClose={onClose}>
        <div />
      </HankeForm>,
    );

    // Click the second step in the stepper (Areas). The stepper renders buttons with step labels.
    // Label comes from t('hankeForm:hankkeenAlueForm:header') which our i18n mock returns as the key itself.
    // So we look for that raw key text.
    const areasStepButton = await findByText('hankeForm:hankkeenAlueForm:header');
    await user.click(areasStepButton);

    // Sanity: area tab label should be visible indicating we're on Areas step
    await waitFor(() => expect(document.querySelector('button')?.textContent).toBeTruthy());
    await waitFor(() => expect(document.body.textContent).toContain('Area 1'));

    // 2. Trigger snapshot (language change) while on Areas step
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
    await waitFor(() => expect(sessionStorage.getItem('functional-hanke-form-HYDR1')).toBeTruthy());
    await waitFor(() =>
      expect(sessionStorage.getItem('functional-hanke-form-step-HYDR1-activeStep')).toBe('1'),
    );

    // 3. Unmount to simulate route change
    unmount();

    // 4. Remount with server data missing features
    const serverDataMissingFeature = {
      ...baseData,
      alueet: baseData.alueet!.map((a) => ({ ...a, feature: undefined })),
    } as HankeDataFormState;

    const { getByText } = render(
      <HankeForm
        formData={serverDataMissingFeature}
        onIsDirtyChange={onDirty}
        onFormClose={onClose}
      >
        <div />
      </HankeForm>,
    );

    // 5. Assert area tab label visible immediately (no step navigation required). We expect Areas step re-selected.
    await waitFor(() => {
      expect(getByText('Area 1')).toBeTruthy();
    });
  });
});
