import { test, expect } from '@playwright/test';
import { testiData } from './_setup';

test('Johtoselvityshakemus ei ole käytettävissä ennen kirjautumista', async ({ page }) => {
  await page.goto(testiData.testEnvUrl);
  await expect(page.getByLabel('Tee johtoselvityshakemus.', { exact: true })).not.toBeVisible();
  await page.getByLabel('Kirjaudu').click();
  await page.getByRole('link', { name: 'Suomi.fi-tunnistautuminen' }).click();
  await page.getByRole('link', { name: 'Testitunnistaja' }).click();
  await page.getByRole('link', { name: 'Käytä oletusta 210281-' }).click();
  await page.getByRole('button', { name: 'Tunnistaudu' }).click();
  await page.getByRole('button', { name: 'Jatka palveluun' }).click();
  await expect(page.getByLabel('Tee johtoselvityshakemus.', { exact: true })).toBeVisible({
    timeout: 10000,
  });
});
