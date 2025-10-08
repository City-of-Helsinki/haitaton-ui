## Geometry & Form Session Persistence

This document describes the implementation that persists drawn map geometries together with
existing language‑change form persistence for the Hanke, Johtoselvitys and Kaivuilmoitus flows.

### Goals

1. Persist user‑drawn geometries (areas / features) across in‑app language changes and soft reloads.
2. Store only essential coordinate data (no volatile OpenLayers Feature instances, no style / id meta).
3. Trigger persistence only after a geometry is finalized (draw finished or modify committed) – not on every pointer move.
4. Keep existing field value persistence semantics unchanged.
5. Avoid polluting react‑hook‑form hydration with geometry meta structures.

### High‑Level Architecture

```
OpenLayers Draw/Modify -> onGeometryFinalized callback -> persistence.saveSnapshot()
                     \-> serializeFeatureGeometry() -> sessionStorage[key]

App load / language change -> useFormLanguagePersistence.hydrate() -> afterHydrate()
                                                      \-> deserializeGeometry() -> recreate Features
```

### Storage Shape

Session storage entry (one per form) already held a JSON object of field values. We extend it with a
reserved meta key: `"__geometry"` that is ignored by automatic field hydration.

Example (trimmed):

```json
{
  "nimi": "Test Hanke",
  "kuvaus": "...",
  "__geometry": {
    "alueet": [
      { "type": "Polygon", "coordinates": [[[24.93, 60.17], ...]] },
      { "type": "Polygon", "coordinates": [[[24.94, 60.18], ...]] }
    ]
  }
}
```

Only raw GeoJSON geometry objects (no Feature wrappers, no projection transforms beyond what the map already uses).

### Supported geometry shapes

The persistence system stores plain GeoJSON geometry objects. The following GeoJSON geometry types are supported and will be serialized/deserialized by the helpers in `geometrySerialization.ts`:

- Point
- MultiPoint
- LineString
- MultiLineString
- Polygon
- MultiPolygon

If you need to persist additional geometry types in future (for example `GeometryCollection`) add an explicit test and ensure `deserializeGeometry` correctly handles them.

### Key Components

| Component / File                                                              | Responsibility                                                                                    |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `geometrySerialization.ts`                                                    | `serializeFeatureGeometry`, `deserializeGeometry`, batch helpers for arrays & nested structures   |
| `useFormLanguagePersistence.ts`                                               | Extended to add `afterHydrate`, skip keys beginning with `__`, expose `hydrated` + `saveSnapshot` |
| `HankeForm.tsx` / `JohtoselvitysContainer.tsx` / `KaivuilmoitusContainer.tsx` | Provide `select()` (filter + inject `__geometry`) and `afterHydrate()` (reconstruct Features)     |
| Draw / Modify interaction wrappers                                            | Emit `onGeometryFinalized` on `drawend` & successful `modifyend`                                  |
| Map container (e.g. `ApplicationMap`, drawers)                                | Wire `onGeometryFinalized` -> persistence `saveSnapshot`                                          |

### Serialization Strategy

We capture only `feature.getGeometry()?.getType()` and `getCoordinates()`. This yields a canonical
GeoJSON geometry object `{ type, coordinates }`. De/serialization is O(n) in number of features and
memory‑lean. Style, ids, selection state or derived measurements are intentionally omitted.

### Hydration Flow

1. Raw form values load from session storage.
2. Hook filters out keys starting with `__` when writing RHF default values.
3. After RHF has mounted, `afterHydrate` receives the full object (including `__geometry`).
4. Each stored geometry is turned back into a new OpenLayers `Feature` with a geometry instance of the appropriate type.
5. Feature arrays are injected into the map layer state providers.

### Triggers for Snapshot

Snapshots occur when:

- User finishes drawing (`drawend`).
- User finishes a modification (`modifyend`) and geometry actually changed.
- (Optionally) manual invocation via exposed `saveSnapshot` if future features require it.

### Defensive Measures

- Guards ensure undefined or null features are skipped instead of throwing.
- Meta key prefix `__` prevents accidental form field collisions.
- Batch helpers avoid code duplication for nested Kaivuilmoitus `tyoalueet` geometry arrays.

### Testing Adjustments

- Refactored brittle Hanke form test to rely on accessible step button names instead of composite heading text.
- Left console error surfacing intact except for filtered noisy categories already handled in `setupTests.ts`.
- Full suite (86 suites / 789 tests / 13 snapshots) passes after integration.

### Performance Considerations

- Coordinate arrays are small; snapshot only after finalize keeps write frequency low.
- Serialization cost negligible versus map interaction time.
- No deep cloning of large Feature objects—only plain JSON.

### Limitations / Non‑Goals

- Does not yet persist feature styles or selection state (out of scope – ephemeral UI concerns).
- Does not track history / undo of geometry edits; only last committed state survives.
- Projection assumptions: Uses current map projection coordinates directly (ensure consistency if projection changes in future).

### Future Improvements

| Idea                                     | Benefit                                     | Notes                                           |
| ---------------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| Add checksum to geometry array           | Skip snapshot if unchanged                  | Hash serialized string before write             |
| Persist drawing tool active state        | Restore UX context after language change    | Add another meta key `__ui`                     |
| Debounce snapshot queue                  | Collapse rapid modify events                | Only if modifyend bursts observed               |
| Add automated hydration integration test | Guard against regressions                   | Could live as `*.persistence.test.tsx` per form |
| Optional migration version field         | Forward compatibility for structure changes | E.g. `__meta: { v: 1 }`                         |

### Usage Summary

To add geometry persistence for a new form with map features:

1. Extend its `select()` to inject `__geometry` with serialized geometry list.
2. Implement `afterHydrate()` to reconstruct Features and set into state providers.
3. Ensure draw / modify interactions call `onGeometryFinalized`.
4. (Optional) Provide a manual button invoking `saveSnapshot()` if needed.

### Maintenance Checklist

- When altering the geometry storage schema, bump a meta version and add migration logic inside `afterHydrate`.
- Keep serialization pure (no side effects, no external state access) for easy unit testing.
- Avoid adding non‑deterministic data (timestamps, random ids) to the stored geometry payload.

---

_Last validated with full test run on 2025-10-03._
