import React from 'react';
import { render, waitFor, cleanup } from '../../../testUtils/render';
import HankeForm from './HankeForm';
import { HankeDataFormState } from './types';

// Keep peripheral components light
jest.mock('./HankeFormPerustiedot', () => () => <div data-testid="mock-perustiedot" />);
jest.mock('./HankeFormYhteystiedot', () => () => <div data-testid="mock-yhteystiedot" />);
jest.mock('./HankeFormHaittojenHallinta', () => () => <div data-testid="mock-haitat" />);
jest.mock('./HankeFormLiitteet', () => () => <div data-testid="mock-liitteet" />);
jest.mock('./HankeFormSummary', () => () => <div data-testid="mock-summary" />);
jest.mock('../../application/components/ApplicationAddDialog', () => () => null);
jest.mock('../../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
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
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { useFormContext } = require('react-hook-form');
      const { getValues } = useFormContext();
      const areas = getValues('alueet') || [];
      return <div data-testid="reader">{areas[0]?.nimi || 'no-area'}</div>;
    };

    const { getByTestId } = render(
      <HankeForm formData={serverProvided} onIsDirtyChange={jest.fn()} onFormClose={jest.fn()}>
        <Reader />
      </HankeForm>,
    );

    // The persisted area name should be used in the hydrated form state
    await waitFor(() => expect(getByTestId('reader').textContent).toBe('Persisted area'));
  });
});
