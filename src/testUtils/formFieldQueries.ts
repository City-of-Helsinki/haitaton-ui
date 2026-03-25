// Utility helpers for resilient form field queries in tests.
// Focus: Avoid brittle index-based access to repeated 'Tyyppi' (type) comboboxes.
// Strategy: Prefer scoping by participant section heading (e.g. 'Asiakas', 'Urakoitsija', 'Edustaja', 'Rakennuttaja').
// Falls back to role/name search, then data-testid matching.

import { screen, within, waitFor } from '@testing-library/react';

export interface TypeSelectQueryOptions {
  sectionLabel?: RegExp | string; // e.g. /Asiakas/i
  typeLabel?: RegExp; // default /Tyyppi/i
  occurrence?: number; // fallback nth match if multiple remain
  debugOnFail?: boolean; // include DOM dump on failure
}

function getScopedQueryRoot(sectionLabel: RegExp | string | undefined): HTMLElement {
  if (!sectionLabel) return document.body;

  const sectionPattern =
    typeof sectionLabel === 'string' ? new RegExp(sectionLabel, 'i') : sectionLabel;
  const heading = screen
    .queryAllByRole('heading')
    .find((h) => sectionPattern.test(h.textContent || ''));

  if (!heading) return document.body;
  return (
    heading.closest('section') ||
    heading.closest('fieldset') ||
    heading.parentElement ||
    document.body
  );
}

function findComboboxesIn(
  queryRoot: HTMLElement,
  typeLabel: RegExp,
  sectionLabel: RegExp | string | undefined,
  occurrence: number | undefined,
): HTMLElement {
  let all = within(queryRoot).queryAllByRole('combobox', { name: typeLabel });
  if (all.length === 0 && sectionLabel) {
    all = screen.queryAllByRole('combobox', { name: typeLabel });
  }
  if (all.length === 1 && occurrence === undefined) return all[0];
  if (all.length > 1) {
    if (occurrence !== undefined) {
      if (occurrence >= 0 && occurrence < all.length) return all[occurrence];
      throw new Error(
        `findTypeSelect: occurrence ${occurrence} out of bounds (found ${all.length}). Names: ${all
          .map(
            (el) =>
              el.getAttribute('aria-label') ||
              el.getAttribute('name') ||
              el.textContent ||
              '<no-label>',
          )
          .join(' | ')}`,
      );
    }
    console.warn(
      `findTypeSelect: multiple (${all.length}) matches for ${typeLabel}; returning first. Provide occurrence to disambiguate.`,
    );
    return all[0];
  }
  throw new Error(`findTypeSelect: no combobox found for ${typeLabel}`);
}

function findByLabelFallback(
  queryRoot: HTMLElement,
  typeLabel: RegExp,
  occurrence: number | undefined,
): HTMLElement {
  const labelMatches = Array.from(queryRoot.querySelectorAll('label'))
    .filter((l) => typeLabel.test(l.textContent || ''))
    .map((l) => {
      const forId = l.getAttribute('for');
      return forId ? document.getElementById(forId) : l.querySelector('select,input');
    })
    .filter(Boolean) as HTMLElement[];

  if (labelMatches.length === 1) return labelMatches[0];
  if (labelMatches.length > 1 && occurrence !== undefined && occurrence < labelMatches.length) {
    return labelMatches[occurrence];
  }
  throw new Error(`findTypeSelect: Unable to locate element via label fallback for ${typeLabel}`);
}

// Attempts to locate a single combobox representing a participant 'type' selector.
export function findTypeSelect(opts: TypeSelectQueryOptions = {}) {
  const { sectionLabel, typeLabel = /tyyppi/i, occurrence, debugOnFail = false } = opts;

  const queryRoot = getScopedQueryRoot(sectionLabel);

  try {
    return findComboboxesIn(queryRoot, typeLabel, sectionLabel, occurrence);
  } catch {
    // combobox search failed — try label fallback
  }

  try {
    return findByLabelFallback(queryRoot, typeLabel, occurrence);
  } catch {
    if (debugOnFail) {
      console.log('findTypeSelect debug: DOM snapshot', queryRoot.innerHTML.slice(0, 3000));
    }
    const locationHint = sectionLabel ? ` within section ${String(sectionLabel)}` : '';
    throw new Error(
      `findTypeSelect: Unable to locate combobox with name matching ${typeLabel}${locationHint}`,
    );
  }
}

// Async variant that waits for the combobox(es) to appear before delegating to the sync helper.
export async function findTypeSelectAsync(opts: TypeSelectQueryOptions = {}, waitMs = 3000) {
  const deadline = Date.now() + waitMs;
  let lastErr: unknown;
  while (Date.now() < deadline) {
    try {
      return findTypeSelect(opts);
    } catch (e) {
      lastErr = e;
      // small delay

      await new Promise((r) => setTimeout(r, 50));
    }
  }
  // One final attempt inside waitFor to surface better RTL error messaging
  try {
    await waitFor(
      () => {
        const el = findTypeSelect(opts);
        if (!el) throw new Error('Still not found');
      },
      { timeout: waitMs },
    );
    return findTypeSelect(opts); // found
  } catch (e) {
    throw lastErr || e;
  }
}
