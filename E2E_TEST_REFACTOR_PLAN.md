# Plan: Modularize E2E Tests

# STATUS: Deferred — fix audit vulnerabilities + commit first

## Context

The `e2e/` directory has one monolithic `_setup.ts` (633 lines) that mixes authentication, form helpers, ALLU helpers, test data, and date utilities. Several spec files contain near-identical ALLU interaction blocks (login + search + process) duplicated 6+ times. The goal is to reduce duplication and make it easier to find, read, and maintain helpers.

---

## Observations & Open Questions

### `johtoselvitys_ja_liite_hankkeelle.spec.ts` — misleading name

- The attachment (valtakirja.txt) is added to the **johtoselvitys application**, not the hanke itself
- A test for adding an attachment **to a hanke** doesn't currently exist — worth adding
- Consider merging attachment upload into `createAndFillJohtoselvityshakemusForm()` (or a separate step) so it's tested as part of the johtoselvitys creation flow

### Shared hanke/application approach

**User idea:** Instead of creating a new hanke + johtoselvitys + kaivuilmoitus in every test, use **one shared hanke** with one shared johtoselvitys and one shared kaivuilmoitus. Each spec only tests its specific workflow on top of that shared state.

**How this could work in Playwright:**

- `globalSetup` script: creates the shared hanke + johtoselvitys + kaivuilmoitus once, saves IDs to a JSON file (e.g. `e2e/.fixtures/shared-state.json`)
- Each spec reads from that file and jumps straight to the workflow being tested
- Significantly reduces per-test setup time (currently 3-4 minutes of form filling per test)
- Risk: shared state means test order matters and a failed setup breaks all tests

**Alternative:** Use `test.beforeAll` in a `describe` block if tests are closely related enough to share a hanke without state interference.

This is a bigger architectural change — evaluate carefully before implementing.

---

## What Is and Isn't Reasonable

**Reasonable:**

- Splitting `_setup.ts` into focused modules by domain (main structural improvement)
- Extracting the repeated ALLU login+search+process blocks into reusable helpers (biggest duplication win)
- Adding a test for attaching a file to a hanke (coverage gap)
- Optionally: merging attachment upload into `createAndFillJohtoselvityshakemusForm`

**Bigger scope (evaluate separately):**

- Shared hanke/application via `globalSetup` — reduces test runtime significantly but adds setup complexity

**Not worth doing:**

- Page Object Model — too heavyweight for sequential integration tests against a real backend
- Playwright fixtures for login — tests run sequentially with `beforeEach` login; no gain
- Parallelization — dangerous with shared backend state

---

## Proposed New Structure

```
e2e/
  helpers/
    auth.ts            # helsinkiLogin, nextAndCloseToast
    test-data.ts       # testiData, perustaja/vastaava/suorittaja/etc., hankeName(), date utils
    hanke.ts           # createAndFillHankeForm
    johtoselvitys.ts   # createAndFillJohtoselvityshakemusForm (+ optional: addAttachmentToJohtoselvitys)
    kaivuilmoitus.ts   # createAndFillKaivuilmoitusForm, ilmoitaKaivuilmoitusValmiiksi
    allu.ts            # navigateToAlluApplication, processAlluApplication,
                       # hyvaksyKaivuilmoitusToiminnalliseenKuntoon, hyvaksyKaivuilmoitusValmiiksi,
                       # expectApplicationStatus
  _setup.ts            # barrel re-exports from helpers/ (keep for backwards compat)
  *.spec.ts            # unchanged or lightly updated imports
```

---

## Step-by-Step Plan

### 1. Create `e2e/helpers/test-data.ts`

Move out of `_setup.ts`: `testiData`, user role objects (`perustaja`, `vastaava`, etc.), `testiOsoite`, date utils, `hankeName()`

### 2. Create `e2e/helpers/auth.ts`

Move: `helsinkiLogin(page)`, `nextAndCloseToast(page, ...)`

### 3. Create `e2e/helpers/hanke.ts`

Move: `createAndFillHankeForm(page, nimi, drawTool?)`

### 4. Create `e2e/helpers/johtoselvitys.ts`

Move: `createAndFillJohtoselvityshakemusForm(page, nimi)`
Consider: adding optional attachment step inside or as a separate exported helper

### 5. Create `e2e/helpers/kaivuilmoitus.ts`

Move: `createAndFillKaivuilmoitusForm(page, nimi)`, `ilmoitaKaivuilmoitusValmiiksi(page)`

### 6. Create `e2e/helpers/allu.ts` — BIGGEST WIN

Extract duplicated ALLU blocks (appear 6+ times verbatim across specs):

```typescript
export async function navigateToAlluApplication(page: Page, applicationId: string) {
  await page.goto(testiData.allu_url);
  await page.getByPlaceholder('Username').fill(testiData.allupw);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('link', { name: 'HAKEMUKSET' })).toBeVisible();
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await page.getByRole('button', { name: 'HAE' }).click();
  await page.getByRole('link', { name: applicationId }).click();
}

export async function processAlluApplication(page: Page) {
  await page.getByRole('button', { name: 'NÄYTÄ UUDET TIEDOT' }).click();
  await page.getByRole('button', { name: 'KÄSITTELYYN' }).click();
  // ... category selection + TALLENNA
}
```

Also move: `expectApplicationStatus`, `hyvaksyKaivuilmoitusToiminnalliseenKuntoon`, `hyvaksyKaivuilmoitusValmiiksi`

### 7. Update `_setup.ts` to barrel re-export

```typescript
export * from './helpers/auth';
export * from './helpers/test-data';
export * from './helpers/hanke';
export * from './helpers/johtoselvitys';
export * from './helpers/kaivuilmoitus';
export * from './helpers/allu';
```

### 8. Update spec files (5 files) to replace inline ALLU blocks

Affected: `johtoselvitys_ja_liite_hankkeelle`, `johtoselvitys_tilaus_taydennyspyynto`, `kaivuilmoitus_muutosilmoitus`, `kaivuilmoitus_taydennyspyynto`, `kaivuilmoitus_toiminnallinen_kunto`

### 9. (New) Add test for attaching a file to a hanke

Currently not tested. Add a focused spec or add a step to `createAndFillHankeForm` or a post-hanke helper.

### 10. (Optional / Later) Shared hanke via globalSetup

Evaluate whether a single shared test hanke+johtoselvitys+kaivuilmoitus created in `globalSetup` can safely be shared across specs. Would dramatically reduce test runtime.

### 11. (Defer) Split `kaivuilmoitus_taydennyspyynto.spec.ts` (275 lines) and `haitaton_suomifi_login.spec.ts` (329 lines)

---

## Critical Files

| File                           | Action                                  |
| ------------------------------ | --------------------------------------- |
| `e2e/_setup.ts`                | Refactor to barrel re-exports           |
| `e2e/helpers/test-data.ts`     | Create                                  |
| `e2e/helpers/auth.ts`          | Create                                  |
| `e2e/helpers/hanke.ts`         | Create                                  |
| `e2e/helpers/johtoselvitys.ts` | Create (+ optional attachment helper)   |
| `e2e/helpers/kaivuilmoitus.ts` | Create                                  |
| `e2e/helpers/allu.ts`          | Create (biggest duplication win)        |
| 5× spec files                  | Replace inline ALLU blocks with helpers |

## Verification

1. `npx tsc --noEmit` — verify no broken imports after each extraction
2. Full E2E suite run against test environment — verify no regressions
