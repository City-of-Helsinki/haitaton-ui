import { expect, test } from '@playwright/test';
import {
  createAndFillHankeForm,
  daysFromTodayDate,
  expectApplicationStatus,
  hankeName,
  helsinkiLogin,
  monthAndDayFromTodayDate,
  nextAndCloseToast,
  perustaja,
  suorittaja,
  testiData,
  testiOsoite,
  vastaava,
} from './_setup';
import path from 'path';
import { DRAWTOOLTYPE } from '../src/common/components/map/modules/draw/types';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});

test('Johtoselvitys ja liite hankkeelle', async ({ page }) => {
  test.setTimeout(600000);
  const ajonNimi = hankeName(`Johtoselvitys ja liite hankkeelle`);

  await createAndFillHankeForm(page, ajonNimi, DRAWTOOLTYPE.POLYGON);

  await page.getByRole('button', { name: 'Tallenna ja lisää hakemuksia', exact: true }).click();
  await page.getByRole('combobox', { name: 'Hakemustyyppi' }).click();
  await page.getByRole('option', { name: 'Johtoselvitys', exact: true }).click();
  await page.getByRole('button', { name: 'Luo hakemus' }).click();
  await page.getByTestId('applicationData.name').fill('Johtoselvitys Hankkeelle');
  await page
    .getByTestId('applicationData.postalAddress.streetAddress.streetName')
    .fill(testiOsoite.address);
  await page.getByLabel('Olemassaolevan rakenteen').check();
  await page.getByText('Kyllä').click();
  await page.getByLabel('Työn kuvaus*').fill('Tämä on luotu testiautomaatiossa');
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await page.getByLabel('Valitse päivämäärä').first().click();
  await page.getByRole('button', { name: monthAndDayFromTodayDate(0), exact: true }).click();
  await page.getByLabel('Työn arvioitu loppupäivä*').fill(daysFromTodayDate(7));
  await page
    .locator('canvas')
    .nth(1)
    .click({
      position: {
        x: 528,
        y: 206,
      },
    });
  await page.getByRole('button', { name: 'Kopioi työalueeksi' }).click();
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await page
    .locator('[id="applicationData\\.customerWithContacts\\.customer\\.name"]')
    .fill(vastaava.username);
  await page
    .getByTestId('applicationData.customerWithContacts.customer.registryKey')
    .fill(vastaava.y_tunnus);
  await page
    .getByTestId('applicationData.customerWithContacts.customer.email')
    .fill(vastaava.email);
  await page
    .getByTestId('applicationData.customerWithContacts.customer.phone')
    .fill(vastaava.phonenumber);
  await page.locator('[aria-label^=Yhteyshenkilöt]').first().click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page
    .locator('[id="applicationData\\.contractorWithContacts\\.customer\\.name"]')
    .fill(suorittaja.username);
  await page
    .getByTestId('applicationData.contractorWithContacts.customer.registryKey')
    .fill(suorittaja.y_tunnus);
  await page
    .getByTestId('applicationData.contractorWithContacts.customer.email')
    .fill(suorittaja.email);
  await page
    .getByTestId('applicationData.contractorWithContacts.customer.phone')
    .fill(suorittaja.phonenumber);
  await page
    .getByRole('region', { name: 'Työn suorittajan tiedot' })
    .getByRole('button', { name: /Yhteyshenkilöt/ })
    .click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await expect(page.getByRole('button', { name: 'Peru hakemus' })).toBeVisible();
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');

  await page.locator('button').filter({ hasText: 'Lisää tiedostoja' }).click();
  await page
    .getByLabel('Raahaa tiedostot tänne')
    .setInputFiles(path.join(__dirname, './valtakirja.txt'));
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');

  await expect(page.getByRole('heading', { name: 'Vaihe 5/5: Yhteenveto' })).toBeVisible();
  await page.getByRole('button', { name: 'Lähetä hakemus' }).click();
  await page.getByRole('button', { name: 'Vahvista' }).click();
  await expect(page.getByText('Hakemus lähetetty')).toBeVisible({ timeout: 30000 });

  await expect(page.getByTestId('allu_tunnus')).toBeVisible({ timeout: 30000 });
  const hakemuksenTunnus = (await page.getByTestId('allu_tunnus').textContent())!;
  await expect(page.getByRole('button', { name: 'Peru hakemus' })).toBeVisible();
  const linkkiHakemukseen = await page
    .getByLabel('Hankkeen navigaatio')
    .locator('div')
    .getByText('TA-Johtoselvitys ja liite')
    .getAttribute('href');
  const linkkiHakemukseenEdit = linkkiHakemukseen?.slice(3);
  const hakemusLinkki = `${testiData.testEnvUrl}${linkkiHakemukseenEdit}`;

  // check allu
  await page.goto(testiData.allu_url);
  await expect(page.getByPlaceholder('Username')).toBeEmpty();
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill(testiData.allupw);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('link', { name: 'HAKEMUKSET' })).toBeVisible();
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await expect(page.getByRole('button', { name: 'HAE' })).toBeVisible();
  await page.getByRole('button', { name: 'HAE' }).click();
  await page.getByRole('link', { name: `${hakemuksenTunnus}` }).click();
  await page.getByRole('button', { name: 'NÄYTÄ UUDET TIEDOT' }).click();
  await page.getByRole('button', { name: 'KÄSITTELYYN' }).click();
  await page.getByLabel('Hakemuksen lajit *').getByText('Hakemuksen lajit').click();
  await page.getByText('Katu- ja vihertyöt').click();
  await page.locator('.cdk-overlay-container > div:nth-child(3)').click();
  await expect(page.getByRole('button', { name: 'TALLENNA' })).toBeVisible();
  await page.getByRole('button', { name: 'TALLENNA' }).click();

  // Tarkista että liitteet ovat saapuneet
  await page.getByRole('link', { name: 'Liitteet (2)' }).click();
  await page.getByText('valtakirja.txt').isVisible({ timeout: 5000 });
  await page.getByRole('link', { name: 'Perustiedot' }).click();

  // Päätä hakemus
  await expect(page.getByRole('button', { name: 'PÄÄTTÄMISEEN' })).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: 'PÄÄTTÄMISEEN' }).click();
  await expect(page.getByRole('button', { name: 'PÄÄTÄ' })).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await expect(page.getByRole('heading', { name: 'Päätä hakemus' })).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await expect(page.getByRole('heading', { name: 'TYÖJONO' })).toBeVisible();

  await page.goto(testiData.alluTriggerUrl);
  await expect(async () => {
    await page.goto(hakemusLinkki);
    await page.getByText('Hakemukset').click();
    await expectApplicationStatus(page, hakemuksenTunnus, 'Päätös');
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });

  // Tarkista haitattomasta että liite näkyy
  await page.locator('[data-testid^="applicationViewLinkIdentifier-"]').click();
  await page.getByText('Liitteet').click();
  await expect(page.getByText('valtakirja.txt')).toBeVisible();
});
