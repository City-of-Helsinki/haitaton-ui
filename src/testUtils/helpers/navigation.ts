import { screen } from '../../testUtils/render';

/**
 * Navigate to a target wizard step.
 * Strategy:
 * 1. Attempt direct step navigation via a stepper button matching text pattern "Vaihe {step}/6".
 * 2. Fallback: perform sequential clicks on the "Seuraava" button until the desired step index is reached or button disappears.
 *
 * This helper is resilient to cases where intermediate validation blocks direct navigation.
 * It can be reused across multi-step form test suites.
 *
 * @param user Testing Library user-event instance
 * @param step 1-based target step number (e.g. 6 for last step)
 */
export async function navigateToStep(
  user: import('@testing-library/user-event').UserEvent,
  step: number,
): Promise<void> {
  if (step < 1) return;
  const directBtn = screen.queryByRole('button', { name: new RegExp(`vaihe ${step}/6`, 'i') });
  if (directBtn) {
    await user.click(directBtn);
    return;
  }
  for (let i = 0; i < step; i++) {
    const nextBtn = screen.queryByRole('button', { name: /seuraava/i });
    if (!nextBtn) break;
    await user.click(nextBtn);
  }
}
