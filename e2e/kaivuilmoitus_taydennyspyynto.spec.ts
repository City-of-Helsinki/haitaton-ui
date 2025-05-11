import { test, expect } from '@playwright/test';
import {
  testiData,
  helsinkiLogin,
  hankeName,
  nextAndCloseToast,
  expectApplicationStatus,
  createAndFillHankeForm,
  ilmoitaKaivuilmoitusValmiiksi,
  createAndFillKaivuilmoitusForm,
} from './_setup';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});

test('Kaivuilmoitus täydennyspyyntö', async ({ page }) => {
  test.setTimeout(780000);
  const ajonNimi = hankeName(`kaivuilmoitus-taydennyspyynto`);
  await createAndFillHankeForm(page, ajonNimi);
  await page.getByRole('button', { name: 'Tallenna ja lisää hakemuksia', exact: true }).click();

  // Lisää kaivuilmoitus
  await createAndFillKaivuilmoitusForm(page, ajonNimi);
  // Lähetä kaivuilmoitus
  await page.getByRole('button', { name: 'Lähetä hakemus' }).click();
  await page.getByRole('button', { name: 'Vahvista' }).click();
  await expect(page.getByText('Hakemus lähetetty')).toBeVisible({ timeout: 45000 });
  await page.getByRole('link').filter({ hasText: /HAI/gm }).click();
  await expect(page.getByText('Hakemukset', { exact: true })).toBeVisible({ timeout: 10000 });
  await page.getByText('Hakemukset', { exact: true }).click();

  const johtoselvitys = (await page
    .locator('[data-testid^=applicationViewLinkIdentifier-JS]')
    .textContent())!;
  const kaivuilmoitus = (await page
    .locator('[data-testid^=applicationViewLinkIdentifier-KP]')
    .textContent())!;
  const hanketunnus = await page.locator('[data-testid^=hanke-tunnus]').textContent();

  // käsittely Allussa
  await page.goto(testiData.allu_url);
  await page.getByPlaceholder('Username').fill(testiData.allupw);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('link', { name: 'HAKEMUKSET' })).toBeVisible();
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await expect(page.getByRole('button', { name: 'HAE' })).toBeVisible();
  await page.getByLabel('Hakemuksen tunnus').fill(`${kaivuilmoitus}`);
  await page.getByRole('button', { name: 'HAE' }).click();
  // kaivuilmoitus
  await expect(page.getByRole('link', { name: `${kaivuilmoitus}` })).toBeVisible({
    timeout: 20000,
  });
  await page.getByRole('link', { name: `${kaivuilmoitus}` }).click();
  await page.getByRole('button', { name: 'NÄYTÄ UUDET TIEDOT' }).click();
  await page.getByRole('button', { name: 'KÄSITTELYYN' }).click();
  await page.getByLabel('Hakemuksen lajit *').getByText('Hakemuksen lajit').click();
  await page.getByText('Katu- ja vihertyöt').click();
  await page.locator('.cdk-overlay-container > div:nth-child(3)').click();
  await expect(page.getByRole('button', { name: 'TALLENNA' })).toBeVisible();
  await page.getByRole('button', { name: 'TALLENNA' }).click();

  // Johtoselvitys
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await expect(page.getByRole('button', { name: 'HAE' })).toBeVisible();
  await page.getByLabel('Hakemuksen tunnus').fill(`${johtoselvitys}`);
  await page.getByRole('button', { name: 'HAE' }).click();
  await expect(page.getByRole('link', { name: `${johtoselvitys}` })).toBeVisible({
    timeout: 20000,
  });
  await page.getByRole('link', { name: `${johtoselvitys}` }).click();
  await page.getByRole('button', { name: 'NÄYTÄ UUDET TIEDOT' }).click();
  await page.getByRole('button', { name: 'KÄSITTELYYN' }).click();
  await page.getByLabel('Hakemuksen lajit *').getByText('Hakemuksen lajit').click();
  await page.getByText('Katu- ja vihertyöt').click();
  await page.locator('.cdk-overlay-container > div:nth-child(3)').click();
  await expect(page.getByRole('button', { name: 'TALLENNA' })).toBeVisible();
  await page.getByRole('button', { name: 'TALLENNA' }).click();

  // Odotetaan tuloksia
  await page.goto(testiData.alluTriggerUrl);
  await expect(async () => {
    await page.goto(`${testiData.hankesalkku}${hanketunnus}`);
    await page.getByText('Hakemukset').click();
    await expectApplicationStatus(page, johtoselvitys, 'Käsittelyssä');
    await expectApplicationStatus(page, kaivuilmoitus, 'Käsittelyssä');
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 180000 });

  // käsittely allussa

  await page.goto(testiData.allu_url);
  await page.getByPlaceholder('Username').fill(testiData.allupw);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('link', { name: 'HAKEMUKSET' })).toBeVisible();
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await expect(page.getByRole('button', { name: 'HAE' })).toBeVisible();
  await page.getByLabel('Hakemuksen tunnus').fill(`${johtoselvitys}`);
  await page.getByLabel('Hakemuksen tunnus').press('Enter');
  await page.getByRole('button', { name: 'HAE' }).click();
  await page.getByRole('link', { name: `${johtoselvitys}` }).click();

  await page.getByRole('button', { name: 'TÄYDENNYSPYYNTÖ' }).click();
  await page.getByText('Muu', { exact: true }).click();
  await page.getByLabel('Selite *').click();
  await page.getByLabel('Selite *').fill('Testiautomaatio täydennyspyyntö');
  await page.getByRole('button', { name: 'LÄHETÄ PYYNTÖ' }).click();
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await page.getByLabel('Hakemuksen tunnus').click();
  await page.getByLabel('Hakemuksen tunnus').fill(`${kaivuilmoitus}`);
  await page.getByRole('button', { name: 'HAE' }).click();
  await page.getByRole('link', { name: `${kaivuilmoitus}` }).click();
  await page.getByRole('button', { name: 'TÄYDENNYSPYYNTÖ' }).click();
  await page.getByText('Muu', { exact: true }).click();
  await page.getByLabel('Selite *').click();
  await page.getByLabel('Selite *').fill('Testiautomaatio täydennyspyyntö');
  await page.getByRole('button', { name: 'LÄHETÄ PYYNTÖ' }).click();

  // tarkista haitattomasta
  await page.goto(testiData.alluTriggerUrl);
  await expect(async () => {
    await page.goto(`${testiData.hankesalkku}${hanketunnus}`);
    await page.getByText('Hakemukset').click();
    await expectApplicationStatus(page, johtoselvitys, 'Täydennyspyyntö');
    await expectApplicationStatus(page, kaivuilmoitus, 'Täydennyspyyntö');
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });

  // johtoselvitys täydennyspyyntö
  await page.getByTestId(`applicationViewLinkIdentifier-${johtoselvitys}`).click();
  await page.getByRole('button', { name: 'Täydennä' }).click();
  await page.getByLabel('Työn kuvaus*').click();
  await page
    .getByLabel('Työn kuvaus*')
    .fill(`Testiautomaatio täydennyspyyntö johtoselvitys ${testiData.runtime}`);
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');

  await page.getByRole('button', { name: 'Lähetä täydennys' }).click();
  await page.getByTestId('dialog-button-test').click();
  await expect(page.getByTestId('application-status-tag')).toBeVisible({ timeout: 30000 });

  // kaivuilmoitus täydennyspyyntö
  await page.goto(`${testiData.hankesalkku}${hanketunnus}`);
  await expect(page.getByText('Hakemukset', { exact: true })).toBeVisible({ timeout: 10000 });
  await page.getByText('Hakemukset', { exact: true }).click();
  await page.getByTestId(`applicationViewLinkIdentifier-${kaivuilmoitus}`).click();
  await page.getByRole('button', { name: 'Täydennä' }).click();
  await page.getByLabel('Työn kuvaus*').click();
  await page
    .getByLabel('Työn kuvaus*')
    .fill(`Testiautomaatio täydennyspyyntö kaivuilmoitus ${testiData.runtime}`);
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');
  await page.getByRole('button', { name: 'Lähetä täydennys' }).click();
  await page.getByTestId('dialog-button-test').click();
  await expect(page.getByTestId('dialog-description-test')).not.toBeVisible({ timeout: 30000 });

  // täydennyspyynnöt suoritettu
  await page.goto(testiData.alluTriggerUrl);
  await expect(async () => {
    await page.goto(`${testiData.hankesalkku}${hanketunnus}`);
    await page.getByText('Hakemukset').click();
    await expectApplicationStatus(page, johtoselvitys, 'Täydennetty käsittelyyn');
    await expectApplicationStatus(page, kaivuilmoitus, 'Täydennetty käsittelyyn');
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });

  // täydennyspyyntöjen käsittely allussa

  await page.goto(testiData.allu_url);
  await expect(page.getByPlaceholder('Username')).toBeEmpty();
  await page.getByPlaceholder('Username').fill(testiData.allupw);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('link', { name: 'HAKEMUKSET' })).toBeVisible();
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await page.getByLabel('Hakemuksen tunnus').fill(`${johtoselvitys}`);
  await page.getByRole('button', { name: 'HAE' }).click();
  await page.getByRole('link', { name: `${johtoselvitys}` }).click();
  await expect(page.getByText('TÄYDENNYS VASTAANOTETTU')).toBeVisible();
  await page.getByRole('button', { name: 'KÄSITTELE TÄYDENNYSPYYNTÖ' }).click();
  await page.getByText('Työn kuvaus').nth(3).click();
  await page.getByRole('button', { name: 'TALLENNA' }).click();
  await expect(page.getByLabel('Täydennyspyyntö käsitelty')).toBeVisible();

  await page.getByRole('button', { name: 'PÄÄTTÄMISEEN' }).click();
  await expect(page.getByText('KÄSITTELYSSÄ')).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await expect(page.getByLabel('Hakemus päätetty')).toBeVisible();

  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await page.getByLabel('Hakemuksen tunnus').fill(`${kaivuilmoitus}`);
  await page.getByRole('button', { name: 'HAE' }).click();
  await page.getByRole('link', { name: `${kaivuilmoitus}` }).click();
  await expect(page.getByText('TÄYDENNYS VASTAANOTETTU')).toBeVisible();
  await page.getByRole('button', { name: 'KÄSITTELE TÄYDENNYSPYYNTÖ' }).click();
  await page.getByText('Työn tarkoitus').nth(2).click();
  await page.getByRole('button', { name: 'TALLENNA' }).click();
  await expect(page.getByText('KÄSITTELYSSÄ')).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTTÄMISEEN' }).click();
  await page.getByRole('button', { name: 'EHDOTA HYVÄKSYMISTÄ' }).click();
  await page.getByLabel('Perustelut *').click();
  await page.getByLabel('Perustelut *').fill('Testiautomaatio e2e succesfull');
  await page.getByLabel('Valitse päättäjä').getByText('Valitse päättäjä').click();
  await page.getByText('Allu Päättäjä').click();
  await page.getByRole('button', { name: 'TALLENNA' }).click();

  await expect(page.getByLabel('Hakemus siirretty odottamaan')).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await expect(page.getByLabel('Hakemus päätetty')).toBeVisible();

  // Tarkista Haitattomasta
  await page.goto(testiData.alluTriggerUrl);
  await expect(async () => {
    await page.goto(`${testiData.hankesalkku}${hanketunnus}`);
    await page.getByText('Hakemukset').click();
    await expectApplicationStatus(page, johtoselvitys, 'Päätös');
    await expectApplicationStatus(page, kaivuilmoitus, 'Päätös');
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });
  await page.getByTestId(`applicationViewLinkIdentifier-${kaivuilmoitus}`).click();

  // Ilmoita valmiiksi
  await ilmoitaKaivuilmoitusValmiiksi(page);

  // Check Allu valmis
  await page.goto(testiData.allu_url);
  await page.getByPlaceholder('Username').fill(testiData.allupw);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('link', { name: 'HAKEMUKSET' })).toBeVisible();
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await expect(page.getByRole('button', { name: 'HAE' })).toBeVisible();
  await page.getByRole('button', { name: 'HAE' }).click();
  await expect(page.getByRole('link', { name: `${kaivuilmoitus}` })).toBeVisible({
    timeout: 20000,
  });
  await page.getByRole('link', { name: `${kaivuilmoitus}` }).click();
  await page.getByRole('link', { name: 'Historia' }).click();
  await page.locator('.mat-slide-toggle-thumb').click();
  await expect(page.getByText('Asiakkaan ilmoittama aika,')).toBeVisible();
  await expect(page.getByText('Valmistumisen ilmoituspäivä')).toBeVisible();
  await page.getByRole('link', { name: /Valvonta/gm }).click();
  await page.getByRole('button', { name: 'OMAKSI' }).first().click();
  await page.getByRole('button', { name: 'HYVÄKSY' }).click();
  await page.getByLabel('Valvojan merkinnät *').click();
  await page.getByLabel('Valvojan merkinnät *').fill('Valmiiksi merkinnät');
  await page.getByText('EHDOTA PÄÄTETTÄVÄKSI').click();
  await page.getByLabel('Valitse päättäjä').getByText('Valitse päättäjä').click();
  await page.getByText('Allu Päättäjä').click();
  await page.getByRole('button', { name: 'TALLENNA' }).click();
  await expect(page.getByLabel('Valvontatehtävä hyväksytty')).toBeVisible();
  await page.getByRole('link', { name: 'Perustiedot' }).click();

  await page.getByText('PÄÄTTÄMISEEN').click();
  await page.getByText('Työ valmis').click();
  await page.getByRole('button', { name: 'HYVÄKSY' }).click();
  await page.getByRole('button', { name: 'HYVÄKSY' }).click();
  await expect(page.getByText('TYÖJONO')).toBeVisible();

  // Odotetaan tuloksia "valmis"
  await page.goto(testiData.alluTriggerUrl);
  await expect(async () => {
    await page.goto(`${testiData.hankesalkku}${hanketunnus}`);
    await page.getByText('Hakemukset').click();
    await page.getByTestId(`applicationViewLinkIdentifier-${kaivuilmoitus}`).click();
    await expectApplicationStatus(page, kaivuilmoitus, 'Työ valmis');
    await expect(page.getByRole('link', { name: 'Lataa työ valmis (PDF)' })).toBeVisible();
  }).toPass({
    intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
    timeout: 240000,
  });
});
