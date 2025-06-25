import { test, expect } from '@playwright/test';
import {
  testiData,
  helsinkiLogin,
  hankeName,
  createAndFillJohtoselvityshakemusForm,
} from './_setup';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});

test('Johtoselvityshakemus_peruminen', async ({ page }) => {
  test.setTimeout(120000);
  test.slow();
  const ajonNimi = hankeName(`johtoselvitys-tilaus-peruminen`);
  await createAndFillJohtoselvityshakemusForm(page, ajonNimi);

  // hakemuksen lähettäminen
  await page.getByRole('button', { name: 'Lähetä hakemus' }).click();
  await expect(page.getByRole('heading', { name: 'Lähetä hakemus?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Peruuta' })).toBeVisible();
  await page.getByRole('button', { name: 'Vahvista' }).click();
  await expect(page.getByText('Hakemus lähetetty')).toBeVisible();
  const linkkiHakemukseen = await page
    .getByRole('link')
    .filter({ hasText: /HAI/gm })
    .getAttribute('href');
  const linkkiHakemukseenEdit = linkkiHakemukseen?.slice(3);
  const hakemusLinkki = `${testiData.testEnvUrl}${linkkiHakemukseenEdit}`;

  // Tarkista hanke ja poista se
  await page.goto(hakemusLinkki);
  await page.getByText('Hakemukset').click();
  await expect(page.getByTestId('application-status-tag')).toBeVisible();
  await expect(page.getByTestId('application-status-tag')).toContainText('Odottaa käsittelyä');
  await page.getByRole('button', { name: 'Peru hanke' }).click();
  await expect(page.getByRole('button', { name: 'Vahvista' })).toBeVisible();
  await page.getByRole('button', { name: 'Vahvista' }).click();
  await expect(page.getByTestId('hankeListLink')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Hanke poistettu')).toBeVisible();
});
