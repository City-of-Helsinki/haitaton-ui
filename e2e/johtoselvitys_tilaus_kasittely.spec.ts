import { test, expect } from '@playwright/test';
import { perustaja, vastaava, suorittaja, testiData, testiOsoite, helsinkiLogin, hankeName } from './_setup';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});

test('Johtoselvityshakemus_tilaus ja käsittely', async ({ page }) => {
  test.setTimeout(120000);
  test.slow();
  await page.getByLabel('Tee johtoselvityshakemus.', { exact: true }).click();
  await page.getByTestId('perustaja.sahkoposti').fill(perustaja.email);
  await page.getByTestId('perustaja.puhelinnumero').click();
  await page.getByTestId('perustaja.puhelinnumero').fill(perustaja.phonenumber);
  const ajonNimi = hankeName(`johtoselvitys-tilaus-kasittely`)
  console.log(ajonNimi)
  await page.getByTestId('nimi').click();
  await page.getByTestId('nimi').fill(ajonNimi);
  await page.getByRole('button', { name: 'Luo hakemus' }).click();
  await page.getByTestId('applicationData.postalAddress.streetAddress.streetName').click();
  await page.getByTestId('applicationData.postalAddress.streetAddress.streetName').fill(testiOsoite.address);
  await expect(page.getByTestId('save-form-btn')).toBeVisible();
  await page.getByLabel('Uuden rakenteen tai johdon').check();
  await page.getByText('Kyllä').click();
  await page.getByLabel('Työn kuvaus*').click();
  await page.getByLabel('Työn kuvaus*').fill(`Testiautomaatio ${testiData.todayFull}`);
  await page.getByRole('button', { name: 'Seuraava' }).click();
  // Merkkaa päivämäärät
  await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
  await page.getByLabel('Valitse päivämäärä').first().click();
  await page.getByRole('button', { name: `${testiData.currentMonth} ${testiData.todayDate}`, exact: true }).click();
  await page.getByLabel('Työn arvioitu loppupäivä*').fill(testiData.tomorrowType);
  // Merkkaa kartta-canvas
  await page.getByTestId('draw-control-Polygon').click();
  await page.locator('canvas').first().click({ position: { x: 454, y: 221, } });
  await page.locator('canvas').first().click({ position: { x: 543, y: 221, }, });
  await page.locator('canvas').first().click({ position: { x: 454, y: 289, } });
  await page.locator('canvas').first().click({ position: { x: 454, y: 221, }, });
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
  // Täytä hakijoiden tiedot
  await page.locator('[id="applicationData\\.customerWithContacts\\.customer\\.name"]').click();
  await page.locator('[id="applicationData\\.customerWithContacts\\.customer\\.name"]').fill(vastaava.username);
  await page.getByTestId('applicationData.customerWithContacts.customer.registryKey').fill(vastaava.y_tunnus);
  await page.getByTestId('applicationData.customerWithContacts.customer.email').click();
  await page.getByTestId('applicationData.customerWithContacts.customer.email').fill(vastaava.email);
  await page.getByTestId('applicationData.customerWithContacts.customer.phone').fill(vastaava.phonenumber);
  await page.locator('#hds-combobox-11-toggle-button').click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page.locator('#hds-combobox-11-toggle-button').click();
  await page.locator('[id="applicationData\\.contractorWithContacts\\.customer\\.name"]').click();
  await page.locator('[id="applicationData\\.contractorWithContacts\\.customer\\.name"]').fill(suorittaja.username);
  await page.getByTestId('applicationData.contractorWithContacts.customer.registryKey').fill(suorittaja.y_tunnus);
  await page.getByTestId('applicationData.contractorWithContacts.customer.email').click();
  await page.getByTestId('applicationData.contractorWithContacts.customer.email').fill(suorittaja.email);
  await page.getByTestId('applicationData.contractorWithContacts.customer.phone').fill(suorittaja.phonenumber);
  await page.getByRole('region', { name: 'Työn suorittajan tiedot' }).getByLabel('Yhteyshenkilöt: Sulje ja avaa').click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page.getByRole('region', { name: 'Työn suorittajan tiedot' }).getByLabel('Yhteyshenkilöt: Sulje ja avaa').click();
  await expect(page.getByRole('button', { name: 'Peru hakemus' })).toBeVisible();

  // Workaround chromium selaimelle
  await expect(async () => {
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await expect(page.getByText('Vaihe 4/5: Liitteet')).toBeVisible();
  }).toPass({ intervals: [2000, 2000, 2000, 2000, 2000], timeout: 12000, });

  // hakemuksen lähettäminen
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 12000 });
  await page.getByRole('button', { name: 'Lähetä hakemus' }).click();
  await expect(page.getByRole('heading', { name: 'Lähetä hakemus?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Peruuta' })).toBeVisible();
  await page.getByRole('button', { name: 'Vahvista' }).click();
  await expect(page.getByText('Hakemus lähetetty')).toBeVisible();
  const hakemuksenTunnus = await page.getByTestId('allu_tunnus').textContent();
  const linkkiHakemukseen = await page.locator('a').filter({ hasText: /HAI/gm }).getAttribute('href');
  const linkkiHakemukseenEdit = linkkiHakemukseen?.slice(3);
  const hakemusLinkki = `${testiData.testEnvUrl}${linkkiHakemukseenEdit}`;

  // Tarkista hanke
  await page.goto(hakemusLinkki);
  await page.getByText('Hakemukset').click();
  await expect(page.getByTestId('application-status-tag')).toBeVisible();
  await expect(page.getByTestId('application-status-tag')).toContainText('Odottaa käsittelyä');

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
  await expect(page.getByRole('button', { name: 'PÄÄTTÄMISEEN' })).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTTÄMISEEN' }).click();
  await expect(page.getByRole('button', { name: 'PÄÄTÄ' })).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await expect(page.getByRole('heading', { name: 'Päätä hakemus' })).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await expect(page.getByRole('heading', { name: 'TYÖJONO' })).toBeVisible();

  // Odotetaan tuloksia
  await expect(async () => {
    await page.goto(hakemusLinkki);
    await page.getByText('Hakemukset').click();
    await expect(page.getByTestId('application-status-tag')).toBeVisible();
    await expect(page.getByTestId('application-status-tag')).toContainText('Päätös', { timeout: 5000, });
  }).toPass({ intervals: [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000], timeout: 120000, });
});
