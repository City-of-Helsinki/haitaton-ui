import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import {
  buildJohtoAreasGeometrySnapshot,
  hydrateJohtoAreasGeometryAfterHydrate,
  buildHankeAlueetGeometrySnapshot,
  hydrateHankeAlueetGeometryAfterHydrate,
  FormContextLike,
} from './persistenceGeometry';

describe('persistenceGeometry helpers', () => {
  test('Johto snapshot and hydrate roundtrip sets feature geometry', () => {
    const f1 = new Feature(new Point([24.0, 60.0]));
    const f2 = undefined;

    const areas = [
      { feature: f1, name: 'one' },
      { feature: f2, name: 'two' },
    ];

    const snapshot = buildJohtoAreasGeometrySnapshot<Record<string, unknown>>(
      areas as Record<string, unknown>[],
    );

    // emulate form context current values (features initially missing)
    const current = [{ feature: undefined }, { feature: undefined }];
    const setCalls: Array<{ path: string; value: unknown }> = [];
    const formContext: FormContextLike = {
      getValues: (path?: string) => (path ? current : { applicationData: { areas: current } }),
      setValue: (_path: string, value: unknown) => setCalls.push({ path: _path, value }),
    };

    hydrateJohtoAreasGeometryAfterHydrate({ __geometry: snapshot }, formContext, {
      pathPrefix: 'applicationData.areas',
      snapshotKey: 'areas',
    });

    // Expect a setValue call for the first area only
    expect(setCalls.length).toBeGreaterThanOrEqual(1);
    expect(setCalls[0].path).toBe('applicationData.areas.0.feature');
    const setFeature = setCalls[0].value as Feature;
    expect(setFeature.getGeometry()).not.toBeNull();
  });

  test('Hanke snapshot and hydrate roundtrip sets feature geometry', () => {
    const f1 = new Feature(new Point([25.0, 61.0]));
    const alueet = [{ id: 'a', feature: f1, nimi: 'A' }];

    const snapshot = buildHankeAlueetGeometrySnapshot<Record<string, unknown>>(
      alueet as Record<string, unknown>[],
    );

    const current = [{ feature: undefined }];
    const setCalls: Array<{ path: string; value: unknown }> = [];
    const formContext: FormContextLike = {
      getValues: (path?: string) => (path ? current : { alueet: current }),
      setValue: (_path: string, value: unknown) => setCalls.push({ path: _path, value }),
    };

    hydrateHankeAlueetGeometryAfterHydrate({ __geometry: snapshot }, formContext, {
      pathPrefix: 'alueet',
      snapshotKey: 'alueet',
    });

    expect(setCalls.length).toBeGreaterThanOrEqual(1);
    expect(setCalls[0].path).toBe('alueet.0.feature');
    const setFeature = setCalls[0].value as Feature;
    expect(setFeature.getGeometry()).not.toBeNull();
  });
});
