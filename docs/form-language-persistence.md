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

## Select option

`select(values)` should return a _plain_, serializable object. Avoid:

- Live OpenLayers Features
- Large binary blobs
- Deep reference cycles

Persist geometry via a snapshot under a meta key (e.g. `__geometry`) and rebuild in `afterHydrate`.

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

## Geometry pattern example

```ts
useFormLanguagePersistence(key, form, {
  select(values) {
    return {
      name: values.name,
      // lightweight geometry snapshot under meta key
      __geometry: buildSnapshot(values.areas),
    };
  },
  afterHydrate(raw) {
    hydrateGeometry(raw, form, { pathPrefix: 'areas', snapshotKey: 'areas' });
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
