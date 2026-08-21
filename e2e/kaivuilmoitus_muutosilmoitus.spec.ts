import { test, expect } from '@playwright/test';
import {
  alluLogin,
  alluSearchApplication,
  testiData,
  helsinkiLogin,
  hankeName,
  expectApplicationStatus,
  createAndFillHankeForm,
  createAndFillKaivuilmoitusForm,
  hyvaksyTietopaivitykset,
} from './_setup';
import path from 'path';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});

test('Kaivuilmoitus muutosilmoitus', async ({ page }) => {
  test.setTimeout(900000);
  const ajonNimi = hankeName(`kaivuilmoitus-muutosilmoitus`);

  // Luo uusi hanke
  await createAndFillHankeForm(page, ajonNimi);
  await page.getByRole('button', { name: 'Tallenna ja lisää hakemuksia', exact: true }).click();

  // Lisää kaivuilmoitus
  await createAndFillKaivuilmoitusForm(page, ajonNimi);

  // Lähetä kaivuilmoitus
  await page.getByRole('button', { name: 'Lähetä hakemus' }).click();
  await page.getByRole('button', { name: 'Vahvista' }).click();
  await expect(page.getByText('Hakemus lähetetty')).toBeVisible({ timeout: 45000 });

  // Avaa hankkeen hakemuslista
  await page.getByRole('link').filter({ hasText: /HAI/gm }).click();
  await expect(page.getByText('Hakemukset', { exact: true })).toBeVisible({ timeout: 10000 });
  await page.getByText('Hakemukset', { exact: true }).click();

  const kaivuilmoitus = (await page
    .locator('[data-testid^=applicationViewLinkIdentifier-KP]')
    .textContent())!;
  const hanketunnus = await page.locator('[data-testid^=hanke-tunnus]').textContent();

  // Käsittele kaivuilmoitus Allussa
  await alluLogin(page);
  await alluSearchApplication(page, kaivuilmoitus);
  await hyvaksyTietopaivitykset(page, 'Katu- ja vihertyöt');

  // Tarkista, että kaivuilmoitus on käsittelyssä Haitattomassa
  await page.goto(testiData.alluTriggerUrl);
  await expect(async () => {
    await page.goto(`${testiData.hankesalkku}${hanketunnus}`);
    await page.getByText('Hakemukset').click();
    await expectApplicationStatus(page, kaivuilmoitus, 'Käsittelyssä');
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });

  // Tee kaivuilmoitukselle päätös Allussa
  await alluLogin(page);
  await alluSearchApplication(page, kaivuilmoitus);
  const naytaUudetTiedot = page.getByRole('button', { name: 'NÄYTÄ UUDET TIEDOT' });
  if (await naytaUudetTiedot.isVisible().catch(() => false)) {
    await naytaUudetTiedot.click();
  }
  await page.getByRole('button', { name: 'PÄÄTTÄMISEEN' }).click();
  await page.getByRole('button', { name: 'EHDOTA HYVÄKSYMISTÄ' }).click();
  await page.getByRole('textbox', { name: 'Perustelut' }).fill('Testiautomaatio e2e');
  await page.getByRole('combobox', { name: 'Valitse päättäjä' }).press('Enter');
  await page.getByText('Allu Päättäjä').click();
  await page.getByRole('button', { name: 'TALLENNA' }).click();
  await expect(page.getByLabel('Hakemus siirretty odottamaan')).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await expect(page.getByLabel('Hakemus päätetty')).toBeVisible();

  // Tarkista, että kaivuilmoituksella on päätös Haitattomassa
  await page.goto(testiData.alluTriggerUrl);
  await expect(async () => {
    await page.goto(`${testiData.hankesalkku}${hanketunnus}`);
    await page.getByText('Hakemukset').click();
    await expectApplicationStatus(page, kaivuilmoitus, 'Päätös');
  }).toPass({
    intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
    timeout: 360000,
  });

  // Tee kaivuilmoitukselle muutosilmoitus, lisää valtakirja ja lähetä se Alluun
  await page.getByTestId(`applicationViewLinkIdentifier-${kaivuilmoitus}`).click();
  await page.getByRole('button', { name: 'Tee muutosilmoitus' }).click();
  await page
    .locator('div')
    .filter({ hasText: /^5Liitteet$/ })
    .click();
  await page
    .locator('#excavation-notification-file-upload-mandate')
    .setInputFiles(path.join(__dirname, './valtakirja_pdf.pdf'));
  await expect(page.getByText('Lisätty tänään')).toBeVisible();
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await expect(page.getByRole('heading', { name: 'Lisätty valtakirja' })).toBeVisible();
  await expect(page.getByText('valtakirja_pdf.pdf')).toBeVisible();
  await page.getByRole('button', { name: 'Lähetä muutosilmoitus' }).click();
  await page.getByRole('button', { name: 'Vahvista' }).click();
  await page.getByText('Muutosilmoitus lähetetty').click();

  // Käsittele muutosilmoitus Allussa
  await alluLogin(page);
  await alluSearchApplication(page, kaivuilmoitus);
  // Tarkista että liitteet ovat saapuneet
  await page.getByRole('link', { name: 'Liitteet' }).click();
  await page.getByText('valtakirja_pdf.pdf').isVisible({ timeout: 5000 });
  await page.getByRole('link', { name: 'Perustiedot' }).click();

  // Tee korvaava päätös Allussa
  await expect(
    page.locator('external-update-notification').getByRole('link', { name: 'Näytä' }),
  ).toBeVisible();
  await page.locator('external-update-notification').getByRole('link', { name: 'Näytä' }).click();
  await expect(page.getByText('valtakirja_pdf.pdf')).toBeVisible();
  await page.getByRole('button', { name: 'KORVAAVA PÄÄTÖS' }).click();
  await page.getByRole('button', { name: 'TALLENNA' }).click();
  await page.getByRole('button').filter({ hasText: 'cancel' }).click();
  await page.getByRole('button', { name: 'PÄÄTTÄMISEEN' }).click();
  await page.getByRole('button', { name: 'EHDOTA HYVÄKSYMISTÄ' }).click();
  await page.getByRole('textbox', { name: 'Perustelut' }).fill('Testiautomaatio e2e succesfull');
  await page.getByRole('combobox', { name: 'Valitse päättäjä' }).press('Enter');
  await page.getByText('Allu Päättäjä').click();
  await page.getByRole('button', { name: 'TALLENNA' }).click();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await expect(page.getByLabel('Hakemus päätetty')).toBeVisible();

  // Tarkista, että kaivuilmoitus on saanut uuden tunnuksen Haitattomassa
  await page.goto(testiData.alluTriggerUrl);
  const kaivuilmoitusMuutosilmoitus = `${kaivuilmoitus}-2`;
  await expect(async () => {
    await page.goto(`${testiData.hankesalkku}${hanketunnus}`);
    await page.getByText('Hakemukset').click();
    await expect(
      page.getByTestId(`applicationViewLinkIdentifier-${kaivuilmoitusMuutosilmoitus}`),
    ).toBeVisible();
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });
});
