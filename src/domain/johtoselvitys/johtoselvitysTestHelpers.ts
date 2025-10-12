/**
 * Johtoselvitys domain test helpers
 * ---------------------------------
 * This module centralizes commonly used helper functions for Johtoselvitys tests to reduce
 * repetitive multi-path imports and make refactors easier.
 *
 * Exposed categories:
 *  - Rendering (renderJohtoselvitys)
 *  - Primitive UI interaction helpers re-exported from testUtils/helpers
 *
 * Usage pattern:
 *  import { renderJohtoselvitys, goToContactsStep, selectComboboxOption } from './johtoselvitysTestHelpers';
 */
import React from 'react';
import { render } from '../../testUtils/render';
import JohtoselvitysContainer from './JohtoselvitysContainer';
import hankkeet from '../mocks/data/hankkeet-data';
import { HankeData } from '../types/hanke';

// Re-export generic helpers used across domain tests
import { selectComboboxOption } from '../../testUtils/helpers/combobox';
import { uploadTestAttachments } from '../../testUtils/helpers/uploadTestAttachments';
import { expandAccordionByText } from '../../testUtils/helpers/accordion';
import { fillInvoicingCustomer } from '../../testUtils/formHelpers/invoicingCustomer';
import { screen } from '../../testUtils/render';

export {
  selectComboboxOption,
  uploadTestAttachments,
  expandAccordionByText,
  fillInvoicingCustomer,
};

export function getDefaultHanke(): HankeData {
  return hankkeet[1] as HankeData;
}

/**
 * Render JohtoselvitysContainer with optional overrides.
 * Centralizes the default hankeData (index 1) and lets callers supply an application override.
 * Returns the render result (including user) for further interactions.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// Allow using any in this test helper for flexibility when passing fixture objects
/* eslint-disable @typescript-eslint/no-explicit-any */
export function renderJohtoselvitys({
  hankeData,
  application,
  props,
}: { hankeData?: HankeData; application?: any; props?: Record<string, any> } = {}) {
  const resolvedHankeData = hankeData ?? (hankkeet[1] as HankeData);
  const elementProps: any = {
    hankeData: resolvedHankeData,
    application: application as any,
    ...(props || {}),
  };
  return render(React.createElement(JohtoselvitysContainer as any, elementProps));
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Lightweight wrapper to navigate to the Contacts step for Johtoselvitys tests.
 * Uses the generic navigateToStep helper but accepts a user-event instance and
 * will target the contacts step by finding a button/heading that matches "yhteystiedot".
 */
export async function goToContactsStep(user: import('@testing-library/user-event').UserEvent) {
  const contactsRegex = /yhteystiedot/i;

  // If contacts heading already present, nothing to do
  try {
    await screen.findByRole('heading', { name: contactsRegex }, { timeout: 200 });
    return;
  } catch {
    // continue
  }

  // Try direct step button first, then fall back to clicking "Seuraava" until contacts heading appears.
  const maxAttempts = 6;
  for (let i = 0; i < maxAttempts; i += 1) {
    // Try to find a step button or link labeled with contacts
    const stepBtn = screen.queryByRole('button', { name: contactsRegex });
    if (stepBtn) {
      await user.click(stepBtn);
      try {
        await screen.findByRole('heading', { name: contactsRegex }, { timeout: 2000 });
      } catch {
        // proceed to next iteration to allow for async UI updates
      }
      return;
    }

    // Otherwise click the next button
    const nextBtn = screen.queryByRole('button', { name: /seuraava/i });
    if (!nextBtn) break;
    await user.click(nextBtn);
    try {
      await screen.findByRole('heading', { name: contactsRegex }, { timeout: 2000 });
      return;
    } catch {
      // not yet on contacts, continue
    }
  }
  // Let the caller's assertions handle if the contacts step is not reached.
}
