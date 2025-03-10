import { test, expect } from '@playwright/test';
import {
  perustaja,
  vastaava,
  suorittaja,
  rakennuttaja,
  testiData,
  testiOsoite,
  helsinkiLogin,
  hankeName,
} from './_setup';
import path from 'path';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});

test('Johtoselvitys ja liite hankkeelle', async ({ page }) => {
  test.setTimeout(240000);
  await page.getByLabel('Luo uusi hanke.', { exact: true }).click();
  await page.getByTestId('nimi').click();
  const ajonNimi = hankeName(`uusi-hanke`);
  await page.getByTestId('nimi').fill(ajonNimi);
  await page.getByTestId('perustaja.sahkoposti').click();
  await page.getByTestId('perustaja.sahkoposti').fill(perustaja.email);
  await page.getByTestId('perustaja.puhelinnumero').click();
  await page.getByTestId('perustaja.puhelinnumero').fill(perustaja.phonenumber);
  await page.getByRole('button', { name: 'Luo hanke' }).click();
  await page.getByTestId('kuvaus').click();
  await page.getByTestId('kuvaus').fill(`${ajonNimi} Tämä on testiautomaatiota varten luotu`);
  await page.getByTestId('tyomaaKatuosoite').click();
  await page.getByTestId('tyomaaKatuosoite').fill(testiOsoite.address);
  await page.getByText('Ohjelmointi').click();
  await page.getByLabel('', { exact: true }).click();
  await page.getByLabel('Työn tyyppi: Sulje ja avaa').click();
  await page.getByRole('option', { name: 'Vesi', exact: true }).getByLabel('check').click();
  await page.getByLabel('Työn tyyppi: Sulje ja avaa').click();
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
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
  await page.getByLabel('Valitse päivämäärä').first().click();
  await page
    .getByRole('button', { name: `${testiData.currentMonth} ${testiData.todayDate}`, exact: true })
    .click();
  await page.getByLabel('Haittojen loppupäivä*').click();
  await page.getByLabel('Haittojen loppupäivä*').fill(testiData.tomorrowType);
  await page.getByRole('button', { name: 'Meluhaitta *' }).click();
  await page.getByRole('option', { name: 'Satunnainen meluhaitta' }).click();
  await page.getByRole('button', { name: 'Pölyhaitta *' }).click();
  await page.getByRole('option', { name: 'Satunnainen pölyhaitta' }).click();
  await page.getByRole('button', { name: 'Tärinähaitta *' }).click();
  await page.getByRole('option', { name: 'Satunnainen tärinähaitta' }).click();
  await page.getByRole('button', { name: 'Autoliikenteen kaistahaitta *' }).click();
  await page.getByRole('option', { name: 'Yksi autokaista vähenee -' }).click();
  await page.getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Alle 10 m' }).click();
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });

  let count = await page.getByText(/Lisää toimet haittojen hallintaan/).count();
  while (count > 0) {
    await page
      .getByText(/Lisää toimet haittojen hallintaan/)
      .first()
      .click();
    count -= 1;
  }

  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.YLEINEN')
    .fill('testiautomaatio toimet hankealue1');
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE')
    .fill('testiautomaatiotoimet raitioliikenne');
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE')
    .fill('testiautomaatiotoimet linjaautoliikenne');
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.PYORALIIKENNE')
    .fill('testiautomaatiotoimet pyöräliikenne');
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.AUTOLIIKENNE')
    .fill('testiautomaatiotoimet autoliikenne');
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.MUUT')
    .fill('testiautomaatiotoimet bussiliikenne');
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
  await page.getByRole('combobox', { name: 'Nimi *' }).fill(perustaja.username);
  await page.getByTestId('omistajat.0.ytunnus').fill(perustaja.y_tunnus);
  await page.getByTestId('omistajat.0.email').fill(perustaja.email);
  await page.getByTestId('omistajat.0.puhelinnumero').fill(perustaja.phonenumber);
  await page.getByLabel('Yhteyshenkilöt: Sulje ja avaa').click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page.getByRole('button', { name: 'Lisää rakennuttaja' }).click();
  await page.locator('[id="rakennuttajat\\.0\\.nimi"]').fill(rakennuttaja.username);
  await page.getByTestId('rakennuttajat.0.ytunnus').fill(rakennuttaja.y_tunnus);
  await page.getByTestId('rakennuttajat.0.email').fill(rakennuttaja.email);
  await page.getByTestId('rakennuttajat.0.puhelinnumero').fill(rakennuttaja.phonenumber);
  await page
    .getByRole('region', { name: 'Rakennuttajan tiedot' })
    .getByLabel('Yhteyshenkilöt: Sulje ja avaa')
    .click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page.getByRole('button', { name: 'Lisää toteuttaja' }).click();
  await page.locator('[id="toteuttajat\\.0\\.nimi"]').fill(suorittaja.username);
  await page.getByTestId('toteuttajat.0.ytunnus').fill(suorittaja.y_tunnus);
  await page.getByTestId('toteuttajat.0.email').fill(suorittaja.email);
  await page.getByTestId('toteuttajat.0.puhelinnumero').fill(suorittaja.phonenumber);
  await page
    .getByRole('region', { name: 'Toteuttajan tiedot' })
    .getByLabel('Yhteyshenkilöt: Sulje ja avaa')
    .click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
  await page.getByRole('button', { name: 'Tallenna ja lisää hakemuksia', exact: true }).click();
  await page.getByLabel('', { exact: true }).click();
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
  await page
    .getByRole('button', { name: `${testiData.currentMonth} ${testiData.todayDate}`, exact: true })
    .click();
  await page.getByLabel('Työn arvioitu loppupäivä*').fill(testiData.tomorrowType);
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
    .getByLabel('Yhteyshenkilöt: Sulje ja avaa')
    .click();
  await page
    .getByRole('option', { name: `${perustaja.username}` })
    .getByLabel('check')
    .click();
  await expect(page.getByRole('button', { name: 'Peru hakemus' })).toBeVisible();
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
  await page.locator('button').filter({ hasText: 'Lisää tiedostoja' }).click();
  await page
    .getByLabel('Raahaa tiedostot tänne')
    .setInputFiles(path.join(__dirname, './valtakirja.txt'));
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
  await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Vaihe 5/5: Yhteenveto' })).toBeVisible();
  await page.getByRole('button', { name: 'Lähetä hakemus' }).click();
  await page.getByRole('button', { name: 'Vahvista' }).click();
  await expect(page.getByText('Hakemus lähetetty')).toBeVisible();
  await expect(page.getByTestId('allu_tunnus')).toBeVisible({ timeout: 30000 });
  const hakemuksenTunnus = await page.getByTestId('allu_tunnus').textContent();
  await expect(page.getByRole('button', { name: 'Peru hakemus' })).toBeVisible();
  const linkkiHakemukseen = await page
    .locator('a')
    .filter({ hasText: /HAI/gm })
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
    await expect(page.getByTestId('application-status-tag')).toContainText('Päätös', {
      timeout: 5000,
    });
  }).toPass({ intervals: [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000], timeout: 120000 });
});
