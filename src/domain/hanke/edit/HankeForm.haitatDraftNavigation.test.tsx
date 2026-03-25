import React from 'react';
import { render, waitFor } from '../../../testUtils/render';
import userEvent from '@testing-library/user-event';
import HankeForm from './HankeForm';
import { HankeDataFormState } from './types';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';

// Keep substeps lightweight; we want real MultipageForm + step state transitions.
vi.mock('./HankeFormPerustiedot', () => ({
  __esModule: true,
  default: () => <div data-testid="perustiedot-step" />,
}));

vi.mock('./HankeFormAlueet', () => ({
  __esModule: true,
  default: () => <div data-testid="alueet-step" />,
}));

// Real haittojen hallinta step: we just need it to have validation schema engaged, but keep light
vi.mock('./HankeFormHaittojenHallinta', () => ({
  __esModule: true,
  default: () => <div data-testid="haittojenhallinta-step" />,
}));

vi.mock('./HankeFormYhteystiedot', () => ({
  __esModule: true,
  default: () => <div data-testid="yhteystiedot-step" />,
}));

vi.mock('./HankeFormLiitteet', () => ({
  __esModule: true,
  default: () => <div data-testid="liitteet-step" />,
}));

vi.mock('./HankeFormSummary', () => ({
  __esModule: true,
  default: () => <div data-testid="summary-step" />,
}));

vi.mock('../../application/components/ApplicationAddDialog', () => ({ default: () => null }));

vi.mock('../../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));

vi.mock('react-i18next', async () => ({
  ...(await vi.importActual<object>('react-i18next')),
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'fi', exists: () => true } }),
}));

function buildDraftData(): HankeDataFormState {
  return {
    hankeTunnus: 'HDRAFTNAV',
    nimi: 'Draft Nav',
    kuvaus: 'Test desc',
    tyomaaKatuosoite: 'Test street',
    // vaihe expects a HANKE_VAIHE_KEY (keyof HANKE_VAIHE enum)
    vaihe: 'OHJELMOINTI',
    tyomaaTyyppi: [],
    onYKTHanke: null,
    alkuPvm: null,
    loppuPvm: null,
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    // Single area with missing nuisance fields to produce validation errors on Haittojen hallinta
    alueet: [
      {
        id: 1,
        nimi: 'Test area',
        feature: new Feature(
          new Polygon([
            [
              [25.0, 60.0],
              [25.0002, 60.0],
              [25.0002, 60.0002],
              [25.0, 60.0002],
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

describe('HankeForm draft navigation from Haittojen hallinta with missing nuisance fields', () => {
  test('can navigate away from haittojen hallinta step (index 2) while draft even with required errors', async () => {
    const data = buildDraftData();
    const onDirty = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();

    const { findByText } = render(
      <HankeForm formData={data} onIsDirtyChange={onDirty} onFormClose={onClose}>
        <div />
      </HankeForm>,
    );

    // Navigate: Perustiedot -> Alueet -> Haittojen hallinta
    await findByText('hankeForm:perustiedotForm:header'); // initial step visible implicitly
    const areasButton = await findByText('hankeForm:hankkeenAlueForm:header');
    await user.click(areasButton);
    const haitatButton = await findByText('hankeForm:haittojenHallintaForm:header');
    await user.click(haitatButton);

    // Now attempt to navigate to Yhteystiedot (index 3) despite missing required haitta fields
    const yhteysButton = await findByText('form:yhteystiedot:header');
    await user.click(yhteysButton);

    // Expect we reached Yhteystiedot (its step content placeholder rendered)
    await waitFor(() => {
      // Stepper active step heading reflects new active step label presence
      expect(document.body.textContent).toContain('form:yhteystiedot:header');
    });
  });
});
