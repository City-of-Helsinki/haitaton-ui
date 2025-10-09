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

### Step (Page) Persistence & Separation of Concerns

The multi‑page forms (Hanke, Johtoselvitys, Kaivuilmoitus…) also persist the **active step index** so
that a language change brings the user back to the same logical place. This is handled by
`MultipageForm` and intentionally **uses a distinct key namespace** to avoid clobbering the draft
JSON object that contains `__geometry`.

Key pattern:

```
functional-<form>-form-step-<hankeTunnus|-new>-activeStep
```

Earlier regression: The step index used to be written under the same key as the form draft,
overwriting the stored JSON object with a single number which destroyed the geometry snapshot.
The fix introduced the explicit `-step-` segment to hard‑separate concerns.

### Immediate Hydration While Remaining on the Areas Step

Problem discovered after the key‑collision fix: When the user changed language **while already on**
the Areas (geometry) step, polygons did hydrate into form state, but the UI (tabs + map drawer)
did not show them until the user navigated away and back. Root cause: we previously derived
`features` only from the static `useFieldArray` snapshot; setting `alueet[i].feature` mutates a
nested property and does not change the array reference, so React had no reason to re‑render.

Solution: In `HankeFormAlueet.tsx` we now derive `features` from a _watched_ array (`watch('alueet')`)
falling back to the field array snapshot. This ensures that any mutation during hydration triggers
a re‑render (react‑hook‑form updates the watched value proxy), making geometries instantly visible.

### Test Coverage for Immediate Hydration

Added test: `src/domain/hanke/edit/HankeFormAlueet.immediateHydration.test.tsx`.

It verifies:

1. User navigates to Areas step (persisting active step = 1).
2. Language change event `haitaton:languageChanging` fires while on Areas step, persisting both
   the draft (with `__geometry`) and the active step.
3. Component remounts with server data that purposely omits `feature` objects (simulates a fresh
   fetch lacking client‑only instances).
4. Hydration reconstructs features and they are immediately visible (tab label "Area 1" present)
   without any further step navigation.

This guards specifically against regressions where geometry appears only after an unrelated state
change (step switch) and will fail fast if the watch‑based derivation is removed.

### Session Storage Keys & Cookie Banner Classification

All keys introduced for draft + step persistence are strictly **functional / essential**: they only
store the user's in‑progress form content and UI navigation context required to fulfill an explicit
user action (editing a form during a language change). They contain no analytics identifiers, no
cross‑session tracking data, and expire with the browser session.

| Purpose                     | Key Pattern                      | Value Shape      | Essential Justification    |
| --------------------------- | -------------------------------- | ---------------- | -------------------------- | --------------------------------------------------------- |
| Form draft (incl. geometry) | `functional-hanke-form-<id       | new>`            | JSON object + `__geometry` | Prevents accidental data loss on language change mid‑edit |
| Active step index           | `functional-hanke-form-step-<id  | new>-activeStep` | Integer (stringified)      | Returns user to same step; avoids confusion & rework      |
| (Analogous for other forms) | `functional-<form>-form-<id      | new>`            | JSON object                | Same functional necessity                                 |
| Step index (other forms)    | `functional-<form>-form-step-<id | new>-activeStep` | Integer                    | Same functional necessity                                 |

Because these keys are sessionStorage (not persistent cookies) and purely operational, they should
be allow‑listed as "essential" in the cookie consent configuration. If the consent tool surfaces a
warning, confirm that the pattern `functional-*` is included in the essentials allowlist.

Verification procedure after deploying a change:

1. Open a form, edit a field, draw an area.
2. Trigger a language change.
3. After reload, check DevTools > Application > Session Storage for the two keys.
4. Confirm consent banner does not flag them as non‑essential.
5. Clear sessionStorage, repeat to ensure regeneration.

### Rationale Summary

Separating functional draft persistence (rich object) from step index (primitive) eliminates data
type collisions and preserves geometry snapshots. The immediate hydration test ensures UX parity
for the critical scenario of continuing to edit geometries across a language switch **without** an
extra step toggle. The watch‑based feature derivation is minimal, localized, and does not alter
public API surfaces.

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

_Last validated with full test run on 2025-10-09._
