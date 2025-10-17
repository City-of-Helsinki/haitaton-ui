# Form Language Persistence Hook

`useFormLanguagePersistence` keeps selected draft values from a `react-hook-form` instance in `sessionStorage` so a language change (which triggers a route + component unmount) does not discard unsaved edits.

## Quick start

```ts
const persistence = useFormLanguagePersistence(
  `functional-hanke-form-${id || 'new'}`,
  formContext,
  {
    select: (values) => ({ nimi: values.nimi, kuvaus: values.kuvaus }),
  },
);
```

## Why a custom hook?

We need finer control than a naive `watch` + `sessionStorage` pair:

- Selective persistence (lightweight subsets only).
- Safe serialization (skip OpenLayers Features / functions / circular references).
- Field-by-field merge that respects _exact_ dirty paths (prevents clobbering server-fetched edits while still restoring nested pristine properties).
- Geometry / heavy data reconstruction via `afterHydrate`.
- Configurable hydration timing (`hydratePhase`) to support both fast visual recovery and complex mount effects.

## Hydration timing (`hydratePhase`)

| Phase    | When it runs                           | Pros                                      | Cons / When NOT to use                                           |
| -------- | -------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `layout` | Before first paint (`useLayoutEffect`) | No flicker; new items visible immediately | Risk of update-depth loops if mount logic calls many `setValue`s |
| `effect` | After first paint (`useEffect`)        | Safer for complex geometry / side-effects | One paint with default values (brief flash)                      |

### Current usage

- **Kaivuilmoitus**: `layout` (needs new added area rows visible immediately after language change).
- **Hanke**: `effect` (geometry and area side-effects caused deep update warnings under layout hydration).

Switch phases per form:

```ts
useFormLanguagePersistence(key, form, { hydratePhase: 'effect' });
```

## Select option (API-shaped persistence)

In the current approach `select(values)` should return the same API-shaped data model the backend uses when
reading/writing the application (for example an `Application` object or the `applicationData` payload). This
keeps persisted drafts aligned with the objects used by the server and avoids special-case snapshot keys.

Guidelines:

- Persist only plain, serializable data. Avoid including OpenLayers Feature instances, functions, or binary blobs.
- Geometry objects are persisted as plain GeoJSON-like entries
  inside the API-shaped model (coordinates + type) that the server's model expects for `areas`/`tyoalueet`.
- The hook's `afterHydrate` can still be used to reconstruct runtime-only artifacts (recreate Features from
  plain geometry objects) and to merge the persisted API-shaped object into the form state using the same
  conversion helpers used when reading server responses.

## Dirty merge semantics

Only exact dirty paths block hydration:

```js
dirtyFields = { applicationData: { name: true } };
```

`applicationData.description` will still hydrate because only `name` path is marked dirty. Parent `true` does **not** cascade.

## Arrays

Arrays hydrate element-wise so freshly added indices (persisted previously) reappear even if the parent path became dirty programmatically. Dirty element paths are skipped; pristine ones are restored.

## API

```ts
useFormLanguagePersistence(key, form, {
  enabled?: boolean;
  clearOnUnmount?: boolean;
  select?: (values) => unknown;
  debounceMs?: number;          // default 300
  afterHydrate?: (raw) => void; // geometry rehydration, etc.
  testMode?: boolean;           // disables debounce + batches hydration
  hydratePhase?: 'layout' | 'effect';
});
```

Returns:

```ts
{
  clearPersisted: () => void;
  saveSnapshot: () => void;      // manual immediate persist (e.g. before route push)
  hydrated: boolean;             // hydration attempt finished
}
```

## Custom language change snapshot

The application dispatches a custom event just before route change:

```js
window.dispatchEvent(new CustomEvent('haitaton:languageChanging'));
```

The hook listens and immediately snapshots (bypassing debounce) to minimize lost changes.

## API-shaped persistence example

Persist the DTO the backend expects and convert it back into form state when hydrating. Keep geometry as
plain geometry objects inside the persisted model and recreate map Features during `afterHydrate`.

```ts
useFormLanguagePersistence(key, form, {
  select(values) {
    // build the same shape that the backend accepts when creating/updating the application
    return buildPersistedApplicationFromForm(values);
  },
  afterHydrate(raw) {
    // raw is the persisted API-shaped object; convert it back into the form state the UI expects
    const formState = convertApplicationDataToFormState(raw.applicationData ?? raw);
    // apply the converted form state and then recreate runtime-only Features from geometry objects
    applyFormStateIntoRHF(formState, form);
    recreateFeaturesFromGeometry(raw, { pathPrefix: 'applicationData.areas' });
  },
});
```

## Troubleshooting

| Symptom                                        | Fix                                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| New rows disappear after language change       | Use `layout` phase OR ensure they are included in `select` subset.               |
| Maximum update depth exceeded                  | Switch that form to `hydratePhase: 'effect'`. Audit mount-time `setValue` loops. |
| Heavy objects in sessionStorage / quota errors | Narrow `select` further; offload geometry to snapshot + rebuild.                 |
| Nested pristine field not restored             | Confirm its exact path isn’t marked dirty; check `select` includes it.           |

## Testing tips

- Use `testMode: true` to remove debounce noise and batch hydration (fewer `act()` warnings).
- For legacy timing scenarios, explicitly set `hydratePhase: 'effect'` inside the test.

## Future improvements ideas

- Auto-detect excessive synchronous `setValue` calls during layout and fall back to effect phase with a dev warning.
- Add optional size guard & compression (e.g. JSON + LZ) if snapshots grow large.

---

Maintainers: Update this document when changing merge or array hydration semantics to keep form behaviour consistent across Hanke / Kaivuilmoitus.
