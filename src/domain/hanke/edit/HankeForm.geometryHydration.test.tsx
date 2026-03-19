import React, { useEffect } from 'react';
import { render, waitFor, cleanup } from '../../../testUtils/render';
import { useFormContext } from 'react-hook-form';
import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';

import HankeForm from './HankeForm';
import { HankeDataFormState } from './types';

// Simplify useApplicationsForHanke hook so form renders immediately
vi.mock('../../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));

// No-op for map draw provider heavy stuff
vi.mock(
  '../../../common/components/map/modules/draw/DrawProvider',
  () =>
    ({ children }: { children: React.ReactNode }) => <>{children}</>,
);

// Provide deterministic translation (return key)
vi.mock('react-i18next', async () => ({
  ...(await vi.importActual<object>('react-i18next')),
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'fi', exists: () => true },
  }),
}));

describe('Hanke persistence - API-shaped payload and feature hydration', () => {
  const baseData: HankeDataFormState = {
    hankeTunnus: 'HTESTGEO',
    nimi: 'Test hanke',
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

  test('persists API-shaped HankeData including GeoJSON and hydrates OL Feature on remount', async () => {
    // We'll mount the form and inject an OpenLayers Feature into the form values
    const { unmount } = (function mountAndInject() {
      // Create a small helper component that will set a feature into the form on mount
      const Injector: React.FC = () => {
        const { setValue } = useFormContext();
        useEffect(() => {
          const coords = [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 0],
            ],
          ];
          const feat = new Feature(new Polygon(coords));
          // Insert an area with a feature into the form state
          setValue('alueet', [
            {
              id: 1,
              nimi: 'Injected area',
              haittaAlkuPvm: null,
              haittaLoppuPvm: null,
              kaistaHaitta: null,
              kaistaPituusHaitta: null,
              meluHaitta: null,
              polyHaitta: null,
              tarinaHaitta: null,
              feature: feat,
              geometriat: { featureCollection: { type: 'FeatureCollection', features: [] } },
            },
          ] as unknown as HankeDataFormState['alueet']);
        }, [setValue]);
        return <div data-testid="injector" />;
      };

      const formRender = render(
        <HankeForm formData={baseData} onIsDirtyChange={vi.fn()} onFormClose={vi.fn()}>
          <Injector />
        </HankeForm>,
      );
      return formRender;
    })();

    // Trigger immediate snapshot (persistence hook listens to this event)
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));

    const storageKey = `functional-hanke-form-${baseData.hankeTunnus || 'new'}`;

    // Wait for sessionStorage to be populated
    await waitFor(() => expect(sessionStorage.getItem(storageKey)).toBeTruthy());

    const raw = sessionStorage.getItem(storageKey)!;
    const parsed = JSON.parse(raw);

    // The persisted payload should be API-shaped HankeData, i.e. include geometriat.featureCollection
    expect(parsed).toHaveProperty('alueet');
    const persistedAlue = parsed.alueet && parsed.alueet[0];
    expect(persistedAlue).toBeTruthy();
    expect(persistedAlue.geometriat).toBeTruthy();
    expect(persistedAlue.geometriat.featureCollection).toBeTruthy();
    // Coordinates should be present in the persisted GeoJSON
    const fc = persistedAlue.geometriat.featureCollection;
    expect(fc.type).toBe('FeatureCollection');
    expect(fc.features && fc.features[0] && fc.features[0].geometry.coordinates).toBeTruthy();

    // Unmount and remount with server-provided alternative geometry to ensure hydration prefers persisted
    unmount();

    // Server override has different geometry coords
    const serverOverride = {
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

    // Reader component will check whether the hydrated form has a Feature object and render text accordingly
    const Reader: React.FC = () => {
      const { getValues } = useFormContext();
      const areas = getValues('alueet') || [];
      const hasFeature = !!(areas[0] && areas[0].feature);
      return <div data-testid="hydration-result">{hasFeature ? 'hydrated' : 'no-feature'}</div>;
    };

    const { getByTestId: getByTestId2 } = render(
      <HankeForm formData={serverOverride} onIsDirtyChange={vi.fn()} onFormClose={vi.fn()}>
        <Reader />
      </HankeForm>,
    );

    // The form should hydrate from persisted payload and thus Reader should show 'hydrated'
    await waitFor(() => expect(getByTestId2('hydration-result').textContent).toBe('hydrated'));
  });
});
