import React from 'react';
import { render, waitFor, cleanup } from '../../../testUtils/render';
import { useFormContext } from 'react-hook-form';
import HankeForm from './HankeForm';
import { HankeDataFormState } from './types';

// Keep peripheral components light
vi.mock('./HankeFormPerustiedot', () => ({
  default: () => <div data-testid="mock-perustiedot" />,
}));
vi.mock('./HankeFormYhteystiedot', () => ({
  default: () => <div data-testid="mock-yhteystiedot" />,
}));
vi.mock('./HankeFormHaittojenHallinta', () => ({
  default: () => <div data-testid="mock-haitat" />,
}));
vi.mock('./HankeFormLiitteet', () => ({ default: () => <div data-testid="mock-liitteet" /> }));
vi.mock('./HankeFormSummary', () => ({ default: () => <div data-testid="mock-summary" /> }));
vi.mock('../../application/components/ApplicationAddDialog', () => ({ default: () => null }));
vi.mock('../../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));

vi.mock('react-i18next', async () => ({
  ...(await vi.importActual<object>('react-i18next')),
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'fi', exists: () => true },
  }),
}));

describe('HankeFormAlueet adapted immediate hydration', () => {
  const baseData: HankeDataFormState = {
    hankeTunnus: 'HTESTHYD',
    nimi: 'Hydration test',
    kuvaus: '',
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

  beforeEach(() => {
    sessionStorage.clear();
    cleanup();
  });

  test('remount hydrates persisted GeoJSON into area feature and UI shows area name', async () => {
    // First mount: set persisted GeoJSON payload directly into sessionStorage
    const storageKey = `functional-hanke-form-${baseData.hankeTunnus || 'new'}`;
    const persisted = {
      ...baseData,
      alueet: [
        {
          id: 1,
          nimi: 'Persisted area',
          geometriat: {
            featureCollection: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [0, 0],
                        [1, 0],
                        [1, 1],
                        [0, 0],
                      ],
                    ],
                  },
                  properties: {},
                },
              ],
            },
          },
        },
      ],
    };
    sessionStorage.setItem(storageKey, JSON.stringify(persisted));

    // Mount form with a server-side different geometry to ensure hydration uses persisted
    const serverProvided = {
      ...baseData,
      alueet: [
        {
          id: 1,
          nimi: 'Server area',
          geometriat: {
            featureCollection: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [9, 9],
                        [10, 9],
                        [10, 10],
                        [9, 9],
                      ],
                    ],
                  },
                  properties: {},
                },
              ],
            },
          },
        },
      ],
    } as unknown as HankeDataFormState;

    // Render a Reader child that inspects hydrated form values directly (avoids triggering step-change validation)
    const Reader: React.FC = () => {
      const { getValues } = useFormContext();
      const areas = getValues('alueet') || [];
      return <div data-testid="reader">{areas[0]?.nimi || 'no-area'}</div>;
    };

    const { getByTestId } = render(
      <HankeForm formData={serverProvided} onIsDirtyChange={vi.fn()} onFormClose={vi.fn()}>
        <Reader />
      </HankeForm>,
    );

    // The persisted area name should be used in the hydrated form state
    await waitFor(() => expect(getByTestId('reader').textContent).toBe('Persisted area'));
  });
});
