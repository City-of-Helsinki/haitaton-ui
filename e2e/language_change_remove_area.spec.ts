import { test, expect } from '@playwright/test';
import {
  helsinkiLogin,
  hankeName,
  createAndFillHankeForm,
  createAndFillKaivuilmoitusForm,
} from './_setup';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});

test('area removal persists across language change', async ({ page }) => {
  test.setTimeout(5 * 60_000);

  const name = hankeName('lang-change-remove-area');

  // create hanke and draw hanke area
  await createAndFillHankeForm(page, name);

  // Lisää kaivuilmoitus hankelomakkeen viimeisellä sivulla
  await page.getByRole('button', { name: 'Tallenna ja lisää hakemuksia', exact: true }).click();

  // create kaivuilmoitus and copy hanke area as work area
  await createAndFillKaivuilmoitusForm(page, name);

  // The stepper button has an aria-label like: "Alueiden piirto. Vaihe 2/6. Valmis." — target it directly
  await page.locator('button[aria-label^="Alueiden piirto"]').first().click();

  // Ensure the work area button exists
  await expect(page.getByTestId('work-area-button')).toBeVisible();

  // Change language (Suomi -> English) via header language selector
  // Open language selector and pick English
  await page.getByRole('button', { name: 'Suomi' }).click();
  await page.getByText('English').click();

  // After language change the work area button should still be present
  await expect(page.getByTestId('work-area-button')).toBeVisible();

  // Remove the work area using the table delete button (localized label)
  // Scope search to the tyoalueet table to target the correct delete button
  const table = page.getByTestId('tyoalueet-table');
  // Click first delete button inside the table (aria-label varies by language)
  await table
    .getByRole('button', { name: /Poista|Remove/i })
    .first()
    .click();

  // Confirm removal in the dialog (button label varies by language)
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Vahvista|Confirm|Remove/i })
    .click();

  // Wait for the UI to reflect removal: no work-area buttons should remain
  await expect(page.locator('[data-testid="work-area-button"]')).toHaveCount(0);

  // Change language again (English -> Suomi)
  await page.getByRole('button', { name: 'English' }).click();
  await page.getByText('Suomi').click();

  // Verify the removal persisted after language change
  await expect(page.locator('[data-testid="work-area-button"]')).toHaveCount(0);
});
