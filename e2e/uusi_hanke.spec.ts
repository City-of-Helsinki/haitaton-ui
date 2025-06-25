import { expect, test } from '@playwright/test';
import { createAndFillHankeForm, hankeName, helsinkiLogin } from './_setup';
import { DRAWTOOLTYPE } from '../src/common/components/map/modules/draw/types';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});

test('Uusi hanke ja hakutyökalu', async ({ page }) => {
  test.setTimeout(300000);
  const ajonNimi = hankeName(`uusi-hanke`);
  await createAndFillHankeForm(page, ajonNimi, DRAWTOOLTYPE.POLYGON);

  await page.getByRole('button', { name: 'Tallenna', exact: true }).click();
  await expect(page.locator('[data-testid^=hanke-tunnus]')).toBeVisible();
  const hanketunnus = await page.locator('[data-testid^=hanke-tunnus]').textContent();
  await page.getByRole('link', { name: 'Haitaton' }).click();
  await page.getByTestId('hankeListLink').click();
  await page.getByPlaceholder('Esim. hankkeen nimi tai tunnus').fill(ajonNimi);
  await page.getByLabel('Search', { exact: true }).click();
  await page.getByText(`${hanketunnus}`).click();
});
