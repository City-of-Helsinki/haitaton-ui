import { test, expect } from '@playwright/test';

test('Johtoselvityshakemus ei ole käytettävissä ennen kirjautumista', async ({ page }) => {
  await page.goto(process.env.haitaton_testing ?? "");
  await expect(page.getByLabel('Tee johtoselvityshakemus.', { exact: true })).not.toBeVisible();
  await page.getByLabel('Kirjaudu').click();
  await page.getByRole('link', { name: 'Test IdP' }).click();
  await page.getByRole('link', { name: 'Käytä oletusta 210281-' }).click();
  await page.getByRole('button', { name: 'Tunnistaudu' }).click();
  await page.getByRole('button', { name: 'Continue to service' }).click();
  await expect(page.getByLabel('Tee johtoselvityshakemus.', { exact: true })).toBeVisible({ timeout: 10000, });
});
