import { test, expect } from '@playwright/test';
import {
  perustaja,
  vastaava,
  suorittaja,
  testiData,
  testiOsoite,
  helsinkiLogin,
  hankeName,
} from './_setup';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});

test('Johtoselvityshakemus_tilaus_taydennyspyynto', async ({ page }) => {
  test.setTimeout(160000);
  test.slow();
  await page.getByLabel('Tee johtoselvityshakemus.', { exact: true }).click();
  await page.getByTestId('perustaja.sahkoposti').fill(perustaja.email);
  await page.getByTestId('perustaja.puhelinnumero').click();
  await page.getByTestId('perustaja.puhelinnumero').fill(perustaja.phonenumber);
  await page.getByTestId('nimi').click();
  const ajonNimi = hankeName(`johtoselvitys-tilaus-taydennyspyynto`);
  await page.getByTestId('nimi').fill(ajonNimi);
  await page.getByRole('button', { name: 'Luo hakemus' }).click();
  await page.getByTestId('applicationData.postalAddress.streetAddress.streetName').click();
  await page
    .getByTestId('applicationData.postalAddress.streetAddress.streetName')
    .fill(testiOsoite.address);
  await expect(page.getByTestId('save-form-btn')).toBeVisible();
  await page.getByLabel('Uuden rakenteen tai johdon').check();
  await page.getByText('Kyllä').click();
  await page.getByLabel('Työn kuvaus*').click();
  await page.getByLabel('Työn kuvaus*').fill(`Testiautomaatio ${testiData.todayFull}`);
  await page.getByRole('button', { name: 'Seuraava' }).click();
  // Merkkaa päivämäärät
  await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
  await page
    .getByRole('alert')
    .getByLabel('Sulje ilmoitus', { exact: true })
    .click({ timeout: 2000 });

  await page.getByLabel('Valitse päivämäärä').first().click();
  await page
    .getByRole('button', { name: `${testiData.currentMonth} ${testiData.todayDate}`, exact: true })
    .click();
  await page.getByLabel('Työn arvioitu loppupäivä*').fill(testiData.tomorrowType);
  // Merkkaa kartta-canvas
  await page.getByTestId('draw-control-Polygon').click();
  await page
    .locator('canvas')
    .first()
    .click({ position: { x: 454, y: 221 } });
  await page
    .locator('canvas')
    .first()
    .click({ position: { x: 543, y: 221 } });
  await page
    .locator('canvas')
    .first()
    .click({ position: { x: 454, y: 289 } });
  await page
    .locator('canvas')
    .first()
    .click({ position: { x: 454, y: 221 } });
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
  await page
    .getByRole('alert')
    .getByLabel('Sulje ilmoitus', { exact: true })
    .click({ timeout: 2000 });

  // Täytä hakijoiden tiedot
  await page.locator('[id="applicationData\\.customerWithContacts\\.customer\\.name"]').click();
  await page
    .locator('[id="applicationData\\.customerWithContacts\\.customer\\.name"]')
    .fill(vastaava.username);
  await page
    .getByTestId('applicationData.customerWithContacts.customer.registryKey')
    .fill(vastaava.y_tunnus);
  await page.getByTestId('applicationData.customerWithContacts.customer.email').click();
  await page
    .getByTestId('applicationData.customerWithContacts.customer.email')
    .fill(vastaava.email);
  await page
    .getByTestId('applicationData.customerWithContacts.customer.phone')
    .fill(vastaava.phonenumber);
  await page
    .getByRole('button', { name: /Yhteyshenkilöt/ })
    .first()
    .click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page
    .getByRole('button', { name: /Yhteyshenkilöt/ })
    .first()
    .click();
  await page.locator('[id="applicationData\\.contractorWithContacts\\.customer\\.name"]').click();
  await page
    .locator('[id="applicationData\\.contractorWithContacts\\.customer\\.name"]')
    .fill(suorittaja.username);
  await page
    .getByTestId('applicationData.contractorWithContacts.customer.registryKey')
    .fill(suorittaja.y_tunnus);
  await page.getByTestId('applicationData.contractorWithContacts.customer.email').click();
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
  await page
    .getByRole('region', { name: 'Työn suorittajan tiedot' })
    .getByRole('button', { name: /Yhteyshenkilöt/ })
    .click();
  await expect(page.getByRole('button', { name: 'Peru hakemus' })).toBeVisible();

  // Workaround chromium selaimelle
  await expect(async () => {
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await expect(page.getByText('Vaihe 4/5: Liitteet')).toBeVisible();
  }).toPass({ intervals: [2000, 2000, 2000, 2000, 2000], timeout: 12000 });

  // hakemuksen lähettäminen
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
  await page
    .getByRole('alert')
    .getByLabel('Sulje ilmoitus', { exact: true })
    .click({ timeout: 2000 });

  await page.getByRole('button', { name: 'Lähetä hakemus' }).click();
  await expect(page.getByRole('heading', { name: 'Lähetä hakemus?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Peruuta' })).toBeVisible();
  await page.getByRole('button', { name: 'Vahvista' }).click();
  await expect(page.getByText('Hakemus lähetetty')).toBeVisible();
  const hakemuksenTunnus = await page.getByTestId('allu_tunnus').textContent();
  const linkkiHakemukseen = await page
    .getByRole('link')
    .filter({ hasText: /HAI/gm })
    .getAttribute('href');
  const linkkiHakemukseenEdit = linkkiHakemukseen?.slice(3);
  const hakemusLinkki = `${testiData.testEnvUrl}${linkkiHakemukseenEdit}`;

  // Tarkista hanke
  await page.goto(hakemusLinkki);
  await expect(page.getByText('Hakemukset')).toBeVisible({ timeout: 10_000 });
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
  await page.getByLabel('Työn tarkenne').getByText('Työn tarkenne').click();
  await page.getByText('Asfaltointityö').click();
  await page.locator('.cdk-overlay-container > div:nth-child(3)').click();
  await expect(page.getByRole('button', { name: 'TALLENNA' })).toBeVisible();
  await page.getByRole('button', { name: 'TALLENNA' }).click();
  await expect(page.getByRole('button', { name: 'TÄYDENNYSPYYNTÖ' })).toBeVisible();
  await page.getByRole('button', { name: 'TÄYDENNYSPYYNTÖ' }).click();
  await page.getByLabel('Hyväksy tiedot täydennyspyynt').getByText('Hakija').click();
  await expect(page.getByLabel('Selite *')).toBeVisible();
  await page.getByLabel('Selite *').fill('Testi Auto Maatio');
  await page.getByRole('button', { name: 'LÄHETÄ PYYNTÖ' }).click();
  await expect(page.getByText('Hakemus siirretty odottamaan täydennystä')).toBeVisible();
  await page
    .getByText('Hakemus siirretty odottamaan täydennystä')
    .waitFor({ state: 'hidden', timeout: 10000 });

  await page.goto(testiData.alluTriggerUrl);
  await expect(async () => {
    await page.goto(hakemusLinkki);
    await page.getByText('Hakemukset').click();
    await expect(page.getByTestId('application-status-tag')).toBeVisible();
    await expect(page.getByTestId('application-status-tag')).toContainText('Täydennyspyyntö', {
      timeout: 5000,
    });
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });

  await page.locator('[data-testid^=applicationViewLinkIdentifier-]').click();

  await page.getByText('Täydennä').click();
  await expect(page.locator('#set-focus-here')).toBeVisible();
  await page.getByText('Yhteystiedot').click();
  await page.getByTestId('applicationData.customerWithContacts.customer.phone').fill('0001234567');
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
  await page
    .getByRole('alert')
    .getByLabel('Sulje ilmoitus', { exact: true })
    .click({ timeout: 2000 });

  await page.getByText('Yhteystiedot').click();
  await page
    .getByTestId('applicationData.customerWithContacts.customer.phone')
    .fill(vastaava.phonenumber);
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
  await page
    .getByRole('alert')
    .getByLabel('Sulje ilmoitus', { exact: true })
    .click({ timeout: 2000 });

  await page.getByText('Yhteenveto').click();
  await page.getByText('Lähetä täydennys').click();
  await page.getByText('Vahvista').click();

  await page.goto(testiData.alluTriggerUrl);
  await expect(async () => {
    await page.goto(hakemusLinkki);
    await page.getByText('Hakemukset').click();
    await expect(page.getByTestId('application-status-tag')).toBeVisible();
    await expect(page.getByTestId('application-status-tag')).toContainText(
      'Täydennetty käsittelyyn',
      { timeout: 5000 },
    );
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });

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
  await page.getByRole('button', { name: 'Kuittaa' }).click();
  await expect(page.getByRole('button', { name: 'KÄSITTELE TÄYDENNYSPYYNTÖ' })).toBeVisible();
  await page.getByRole('button', { name: 'KÄSITTELE TÄYDENNYSPYYNTÖ' }).click();
  await expect(page.getByRole('button', { name: 'TALLENNA' })).toBeVisible();
  await page.getByRole('button', { name: 'TALLENNA' }).click();
  await page.getByText(' Täydennyspyyntö käsitelty ').waitFor({ state: 'hidden', timeout: 10000 });
  await page
    .getByText(' Ilmoitus hakemuksen muutoksista kuitattu ')
    .waitFor({ state: 'hidden', timeout: 10000 });
  await expect(page.getByRole('button', { name: 'PÄÄTTÄMISEEN' })).toBeVisible({ timeout: 10_000 });
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
    await expect(page.getByTestId('application-status-tag')).toBeVisible();
    await expect(page.getByTestId('application-status-tag')).toContainText('Päätös', {
      timeout: 5000,
    });
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });
});
