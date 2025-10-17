import React, { useEffect } from 'react';
import { render, waitFor, cleanup } from '../../../testUtils/render';
import { useFormContext } from 'react-hook-form';
import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';

import HankeForm from './HankeForm';
import { HankeDataFormState } from './types';

jest.mock('../../application/hooks/useApplications', () => ({
  useApplicationsForHanke: () => ({ data: { applications: [] } }),
}));

jest.mock(
  '../../../common/components/map/modules/draw/DrawProvider',
  () =>
    ({ children }: { children: React.ReactNode }) => <>{children}</>,
);

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'fi', exists: () => true },
  }),
}));

describe('HankeForm persistence stores API-shaped HankeData (GeoJSON)', () => {
  const baseData: HankeDataFormState = {
    hankeTunnus: 'HTESTPERSIST',
    nimi: 'Persist test',
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

  test('stores GeoJSON featureCollection for area when feature present', async () => {
    // Injector will set a feature on first area
    const Injector: React.FC = () => {
      const { setValue } = useFormContext();
      useEffect(() => {
        const coords = [
          [
            [0, 0],
            [0, 1],
            [1, 1],
            [0, 0],
          ],
        ];
        const feat = new Feature(new Polygon(coords));
        setValue('alueet', [
          {
            id: 1,
            nimi: 'Area 1',
            feature: feat,
            geometriat: { featureCollection: { type: 'FeatureCollection', features: [] } },
            haittaAlkuPvm: null,
            haittaLoppuPvm: null,
            kaistaHaitta: null,
            kaistaPituusHaitta: null,
            meluHaitta: null,
            polyHaitta: null,
            tarinaHaitta: null,
          },
        ] as unknown as HankeDataFormState['alueet']);
      }, [setValue]);
      return <div data-testid="injector" />;
    };

    const { unmount } = render(
      <HankeForm formData={baseData} onIsDirtyChange={jest.fn()} onFormClose={jest.fn()}>
        <Injector />
      </HankeForm>,
    );

    // Trigger immediate snapshot
    window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));

    const storageKey = `functional-hanke-form-${baseData.hankeTunnus || 'new'}`;

    await waitFor(() => expect(sessionStorage.getItem(storageKey)).toBeTruthy());
    const raw = sessionStorage.getItem(storageKey)!;
    const parsed = JSON.parse(raw);

    // Assert persisted shape has area geometriat.featureCollection
    expect(parsed).toHaveProperty('alueet');
    const persistedAlue = parsed.alueet && parsed.alueet[0];
    expect(persistedAlue).toBeTruthy();
    expect(persistedAlue.geometriat).toBeTruthy();
    expect(persistedAlue.geometriat.featureCollection).toBeTruthy();

    unmount();
  });
});
