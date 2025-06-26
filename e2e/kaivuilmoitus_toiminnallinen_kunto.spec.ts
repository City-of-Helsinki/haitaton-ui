import { test, expect } from '@playwright/test';
import {
  testiData,
  helsinkiLogin,
  hankeName,
  expectApplicationStatus,
  createAndFillHankeForm,
  ilmoitaKaivuilmoitusValmiiksi,
  createAndFillKaivuilmoitusForm,
  daysFromTodayDate,
  hyvaksyKaivuilmoitusValmiiksi,
  hyvaksyKaivuilmoitusToiminnalliseenKuntoon,
} from './_setup';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});

test('Kaivuilmoitus => toiminnallinen kunto ja valmis', async ({ page }) => {
  test.setTimeout(720000);
  const ajonNimi = hankeName(`kaivuilmoitus`);

  // Luo uusi hanke
  await createAndFillHankeForm(page, ajonNimi);

  // Lisää kaivuilmoitus hankelomakkeen viimeisellä sivulla
  await page.getByRole('button', { name: 'Tallenna ja lisää hakemuksia', exact: true }).click();

  // Täytä kaivuilmoituslomake
  await createAndFillKaivuilmoitusForm(page, ajonNimi);

  // Lähetä kaivuilmoitus
  await page.getByRole('button', { name: 'Lähetä hakemus' }).click();
  await page.getByRole('button', { name: 'Vahvista' }).click();
  await expect(page.getByText('Hakemus lähetetty')).toBeVisible({ timeout: 45000 });

  // Avaa hankkeen hakemukset
  await page.getByRole('link').filter({ hasText: /HAI/gm }).click();
  await expect(page.getByText('Hakemukset', { exact: true })).toBeVisible({ timeout: 10000 });
  await page.getByText('Hakemukset', { exact: true }).click();

  // Tarkista, että sekä johtoselvityshakemus että kaivuilmoitus on listassa
  const johtoselvitys = (await page
    .locator('[data-testid^=applicationViewLinkIdentifier-JS]')
    .textContent())!;
  const kaivuilmoitus = (await page
    .locator('[data-testid^=applicationViewLinkIdentifier-KP]')
    .textContent())!;
  const hanketunnus = await page.locator('[data-testid^=hanke-tunnus]').textContent();

  // Käsittele hakemukset Allussa
  await page.goto(testiData.allu_url);
  await page.getByPlaceholder('Username').fill(testiData.allupw);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('link', { name: 'HAKEMUKSET' })).toBeVisible();
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await expect(page.getByRole('button', { name: 'HAE' })).toBeVisible();

  // Tee kaivuilmoitukselle päätös Allussa
  await page.getByLabel('Hakemuksen tunnus').fill(`${kaivuilmoitus}`);
  await page.getByRole('button', { name: 'HAE' }).click();
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
  await expect(page.getByRole('button', { name: 'PÄÄTTÄMISEEN' })).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTTÄMISEEN' }).click();
  await page.getByRole('button', { name: 'EHDOTA HYVÄKSYMISTÄ' }).click();
  await page.getByLabel('Perustelut *').click();
  await page.getByLabel('Perustelut *').fill('testiautomaatioperustelut');
  await page.getByLabel('Valitse päättäjä').getByText('Valitse päättäjä').click();
  await page.getByText('Allu Päättäjä').click();
  await page.getByRole('button', { name: 'TALLENNA' }).click();
  await expect(page.getByRole('button', { name: 'PÄÄTÄ' })).toBeVisible();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await expect(page.getByRole('heading', { name: 'TYÖJONO' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'HAKEMUKSET' })).toBeVisible();
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await expect(page.getByLabel('Hakemuksen tunnus')).toBeVisible({ timeout: 20000 });

  // Tee johtoselvitykselle päätös Allussa
  await page.getByLabel('Hakemuksen tunnus').fill(`${johtoselvitys}`);
  await page.getByRole('button', { name: 'HAE' }).click();
  await expect(page.getByRole('link', { name: `${johtoselvitys}` })).toBeVisible({
    timeout: 10000,
  });
  await page.getByRole('link', { name: `${johtoselvitys}` }).click();
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
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await page.getByRole('button', { name: 'PÄÄTÄ' }).click();
  await expect(page.getByRole('heading', { name: 'TYÖJONO' })).toBeVisible({ timeout: 10000 });

  // Tarkista, että kaivuilmoituksella on päätös Haitattomassa
  await page.goto(testiData.alluTriggerUrl);
  await expect(async () => {
    await page.goto(`${testiData.hankesalkku}${hanketunnus}`);
    await page.getByText('Hakemukset').click();
    await expectApplicationStatus(page, kaivuilmoitus, 'Päätös');
  }).toPass({ intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout: 120000 });

  // Ilmoita kaivuilmoitus toiminnalliseen kuntoon
  await page.getByTestId(`applicationViewLinkIdentifier-${kaivuilmoitus}`).click();
  await expect(page.getByText('Ilmoita toiminnalliseen kuntoon')).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: 'Ilmoita toiminnalliseen' }).click();
  await page.getByLabel('Päivämäärä*').click();
  await page.getByLabel('Päivämäärä*').fill(daysFromTodayDate(-3));
  await page.getByRole('button', { name: 'Vahvista' }).click();
  await expect(page.getByText('Ilmoitus lähetetty')).toBeVisible();
  await expect(page.getByText('Ilmoitettu toiminnalliseen')).toBeVisible();

  // Hyväksy kaivuilmoitus Allussa toiminnalliseen kuntoon
  await hyvaksyKaivuilmoitusToiminnalliseenKuntoon(page, kaivuilmoitus);

  // Tarkista, että kaivuilmoituksella on toiminnallisen kunnon päätös Haitattomassa
  await page.goto(testiData.alluTriggerUrl);
  await expect(async () => {
    await page.goto(`${testiData.hankesalkku}${hanketunnus}`);
    await page.getByText('Hakemukset').click();
    await page.getByTestId(`applicationViewLinkIdentifier-${kaivuilmoitus}`).click();
    await expectApplicationStatus(page, kaivuilmoitus, 'Toiminnallinen kunto');
    await expect(
      page.getByRole('link', { name: 'Lataa toiminnallinen kunto (PDF)' }),
    ).toBeVisible();
  }).toPass({
    intervals: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
    timeout: 120000,
  });

  // Ilmoita kaivuilmoitus valmiiksi
  await ilmoitaKaivuilmoitusValmiiksi(page);

  // Hyväksy kaivuilmoitus Allussa valmiiksi
  await hyvaksyKaivuilmoitusValmiiksi(page, kaivuilmoitus);

  // Tarkista, että kaivuilmoituksella on työ valmis -päätös Haitattomassa
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
