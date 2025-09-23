import { test, expect } from '@playwright/test';
import {
  vastaava,
  testiData,
  helsinkiLogin,
  hankeName,
  nextAndCloseToast,
  expectApplicationStatus,
  createAndFillJohtoselvityshakemusForm,
} from './_setup';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});

test('Johtoselvityshakemus_tilaus_taydennyspyynto', async ({ page }) => {
  test.setTimeout(160000);
  test.slow();
  const ajonNimi = hankeName(`johtoselvitys-tilaus-taydennyspyynto`);

  // Luo johtoselvityshakemus ja hanke
  await createAndFillJohtoselvityshakemusForm(page, ajonNimi);

  // Lähetä hakemus
  await page.getByRole('button', { name: 'Lähetä hakemus' }).click();
  await expect(page.getByRole('heading', { name: 'Lähetä hakemus?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Peruuta' })).toBeVisible();
  await expect(async () => {
    await page.getByRole('button', { name: 'Vahvista' }).click();
    await expect(page.getByText('Hakemus lähetetty')).toBeVisible();
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000], timeout: 12000 });

  // Ota talteen hakemuksen tunnus ja linkki hankkeeseen
  const hakemuksenTunnus = (await page.getByTestId('allu_tunnus').textContent())!;
  const linkkiHankkeeseen = (await page
    .getByRole('link')
    .filter({ hasText: /HAI/gm })
    .getAttribute('href'))!.slice(3);
  const hankeLinkki = `${testiData.testEnvUrl}${linkkiHankkeeseen}`;

  // Tarkista, että hakemus odottaa käsittelyä
  await page.goto(hankeLinkki);
  await expect(page.getByText('Hakemukset')).toBeVisible({ timeout: 10_000 });
  await page.getByText('Hakemukset').click();
  await expectApplicationStatus(page, hakemuksenTunnus, 'Odottaa käsittelyä');

  // Tee hakemukselle täydennyspyyntö Allussa
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

  // Tarkista, että hakemus on saanut täydennyspyynnön
  await expect(async () => {
    await page.goto(hankeLinkki);
    await page.getByText('Hakemukset').click();
    await expectApplicationStatus(page, hakemuksenTunnus, 'Täydennyspyyntö');
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });

  // Avaa hakemussivu
  await page.locator('[data-testid^=applicationViewLinkIdentifier-]').click();

  // Tee täydennys hakemukselle
  await page.getByText('Täydennä').click();
  await expect(page.locator('#set-focus-here')).toBeVisible();
  await page.getByText('Yhteystiedot').click();
  await page.getByTestId('applicationData.customerWithContacts.customer.phone').fill('0001234567');
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');
  await page.getByText('Yhteystiedot').click();
  await page
    .getByTestId('applicationData.customerWithContacts.customer.phone')
    .fill(vastaava.phonenumber);
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');
  await page.getByText('Yhteenveto').click();

  // Lähetä täydennys
  await page.getByText('Lähetä täydennys').click();
  await page.getByText('Vahvista').click();

  await page.goto(testiData.alluTriggerUrl);

  // Tarkista, että täydennyspyyntö on lähetetty käsittelyyn
  await expect(async () => {
    await page.goto(hankeLinkki);
    await page.getByText('Hakemukset').click();
    await expectApplicationStatus(page, hakemuksenTunnus, 'Täydennetty käsittelyyn');
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });

  // Käsittele täydennys Allussa
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

  // Tee hakemukselle päätös Allussa
  await expect(page.getByRole('button', { name: 'PÄÄTTÄMISEEN' })).toBeVisible({ timeout: 10_000 });
  await page.getByRole('button', { name: 'PÄÄTTÄMISEEN' }).click();
  await expect(page.getByRole('button', { name: 'PÄÄTÄ' })).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await expect(page.getByRole('heading', { name: 'Päätä hakemus' })).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await expect(page.getByRole('heading', { name: 'TYÖJONO' })).toBeVisible();

  await page.goto(testiData.alluTriggerUrl);

  // Tarkista, että hakemus on saanut päätöksen
  await expect(async () => {
    await page.goto(hankeLinkki);
    await page.getByText('Hakemukset').click();
    await expectApplicationStatus(page, hakemuksenTunnus, 'Päätös');
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });
});
