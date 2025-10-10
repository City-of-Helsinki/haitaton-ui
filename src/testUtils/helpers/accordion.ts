import { screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';

/**
 * expandAccordionByText
 * Expands an accordion panel by matching the accessible button name with the provided regex.
 * If the accordion is already expanded (aria-expanded === 'true'), it is left untouched.
 * Useful for idempotent setup in tests where multiple calls should not duplicate side-effects.
 */
export async function expandAccordionByText(user: UserEvent, nameRegex: RegExp): Promise<void> {
  const btn = screen.getByRole('button', { name: nameRegex });
  const ariaExpanded = btn.getAttribute('aria-expanded');
  if (ariaExpanded === 'true') return;
  await user.click(btn);
}
