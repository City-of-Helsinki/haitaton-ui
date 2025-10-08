import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import {
  buildJohtoAreasGeometrySnapshot,
  hydrateJohtoAreasGeometryAfterHydrate,
  buildHankeAlueetGeometrySnapshot,
  hydrateHankeAlueetGeometryAfterHydrate,
  FormContextLike,
  buildKaivuAreasGeometrySnapshot,
  hydrateKaivuAreasGeometryAfterHydrate,
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

  test('Kaivu snapshot serializes nested tyoalueet.openlayersFeature', () => {
    const f = new Feature(new Point([24.5, 60.5]));
    const areas = [
      {
        name: 'Area K',
        hankealueId: 99,
        tyoalueet: [{ area: 1, openlayersFeature: f, tormaystarkasteluTulos: { ok: true } }],
      },
    ];

    const snapshot = buildKaivuAreasGeometrySnapshot(areas as Record<string, unknown>[]);
    expect(snapshot).toHaveProperty('areas');
    const snapshotTyped = snapshot as unknown as { areas?: Array<Record<string, unknown>> };
    const first = snapshotTyped.areas && snapshotTyped.areas[0];
    expect(first).toBeDefined();
    if (!first) return; // narrow for TypeScript
    const tyoalueet = first.tyoalueet as unknown;
    expect(Array.isArray(tyoalueet)).toBe(true);
    const tyoalueetArr = tyoalueet as Array<Record<string, unknown>>;
    expect(tyoalueetArr[0]).toBeTruthy();
  });

  test('Kaivu hydrate applies nested tyoalueet geometries into openlayersFeature', () => {
    const f = new Feature(new Point([24.6, 60.6]));
    // use internal serializer via building snapshot from structure
    const areas = [{ name: 'A', tyoalueet: [{ area: 1, openlayersFeature: f }] }];
    const snapshot = buildKaivuAreasGeometrySnapshot(areas as Record<string, unknown>[]);

    const current = [{ tyoalueet: [{}, {}] }];
    const setCalls: Array<{ path: string; value: unknown }> = [];
    const formContext: FormContextLike = {
      getValues: (_path?: string) => {
        // use the param to satisfy unused-var lint rule
        void _path;
        return current;
      },
      setValue: (_path: string, value: unknown) => setCalls.push({ path: _path, value }),
    };

    hydrateKaivuAreasGeometryAfterHydrate({ __geometry: snapshot }, formContext, {
      pathPrefix: 'applicationData.areas',
      snapshotKey: 'areas',
    });

    // Expect at least one setValue to nested openlayersFeature
    const found = setCalls.some(
      (c) => c.path.includes('.tyoalueet.') && c.path.includes('.openlayersFeature'),
    );
    expect(found).toBe(true);
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
