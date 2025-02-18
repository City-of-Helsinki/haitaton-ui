import { test, expect } from '@playwright/test';
import { perustaja, suorittaja, rakennuttaja, testiData, testiOsoite, helsinkiLogin, idGenerator } from './_setup';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});


test('Uusi hanke', async ({ page }) => {
    test.setTimeout(240000);
    await page.getByLabel('Luo uusi hanke.', { exact: true }).click();
    await page.getByTestId('nimi').click();
    const ajonNimi = `TA${testiData.runtime}-${idGenerator(1)}`
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
    await page.locator('canvas').first().click({ position: { x: 454, y: 221, } });
    await page.locator('canvas').first().click({ position: { x: 543, y: 221, }, });
    await page.locator('canvas').first().click({ position: { x: 454, y: 289, } });
    await page.locator('canvas').first().click({ position: { x: 454, y: 221, }, });
    await page.getByLabel('Valitse päivämäärä').first().click();
    await page.getByRole('button', { name: `${testiData.currentMonth} ${testiData.todayDate}`, exact: true }).click();
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

    let count = await page.getByText(/Lisää toimet haittojen hallintaan/).count()
    while (count > 0) {
      await page.getByText(/Lisää toimet haittojen hallintaan/).first().click();
      count -=1
    } 

    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.YLEINEN').click();
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.YLEINEN').fill('testiautomaatio toimet hankealue1');
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE').click();
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE').fill('testiautomaatiotoimet raitioliikenne');
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.PYORALIIKENNE').click();
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.PYORALIIKENNE').fill('testiautomaatiotoimet pyöräliikenne');
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.AUTOLIIKENNE').click();
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.AUTOLIIKENNE').fill('testiautomaatiotoimet autoliikenne');
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.MUUT').click();
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.MUUT').fill('testiautomaatiotoimet bussiliikenne');
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
    await page.getByRole('combobox', { name: 'Nimi *' }).click();
    await page.getByRole('combobox', { name: 'Nimi *' }).fill(perustaja.username);
    await page.getByTestId('omistajat.0.ytunnus').click();
    await page.getByTestId('omistajat.0.ytunnus').fill(perustaja.y_tunnus);
    await page.getByTestId('omistajat.0.email').click();
    await page.getByTestId('omistajat.0.email').fill(perustaja.email);
    await page.getByTestId('omistajat.0.puhelinnumero').fill(perustaja.phonenumber);
    await page.getByLabel('Yhteyshenkilöt: Sulje ja avaa').click();
    await page.getByRole('option', { name: `${perustaja.username}` }).click();
    await page.getByRole('button', { name: 'Lisää rakennuttaja' }).click();
    await page.locator('[id="rakennuttajat\\.0\\.nimi"]').click();
    await page.locator('[id="rakennuttajat\\.0\\.nimi"]').fill(rakennuttaja.username);
    await page.getByTestId('rakennuttajat.0.ytunnus').fill(rakennuttaja.y_tunnus);
    await page.getByTestId('rakennuttajat.0.email').click();
    await page.getByTestId('rakennuttajat.0.email').fill(rakennuttaja.email);
    await page.getByTestId('rakennuttajat.0.puhelinnumero').fill(rakennuttaja.phonenumber);
    await page.getByRole('region', { name: 'Rakennuttajan tiedot' }).getByLabel('Yhteyshenkilöt: Sulje ja avaa').click();
    await page.getByRole('option', { name: `${perustaja.username}` }).click();
    await page.getByRole('button', { name: 'Lisää toteuttaja' }).click();
    await page.locator('[id="toteuttajat\\.0\\.nimi"]').click();
    await page.locator('[id="toteuttajat\\.0\\.nimi"]').fill(suorittaja.username);
    await page.getByTestId('toteuttajat.0.ytunnus').fill(suorittaja.y_tunnus);
    await page.getByTestId('toteuttajat.0.email').click();
    await page.getByTestId('toteuttajat.0.email').fill(suorittaja.email);
    await page.getByTestId('toteuttajat.0.puhelinnumero').fill(suorittaja.phonenumber);
    await page.getByRole('region', { name: 'Toteuttajan tiedot' }).getByLabel('Yhteyshenkilöt: Sulje ja avaa').click();
    await page.getByRole('option', { name: `${perustaja.username}` }).click();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
    await page.getByRole('button', { name: 'Tallenna', exact: true }).click();
    await expect(page.locator("[data-testid^=hanke-tunnus]")).toBeVisible();
    let hanketunnus = await page.locator("[data-testid^=hanke-tunnus]").textContent();
    await page.getByRole('link', { name: 'Haitaton' }).click();
    await page.getByTestId('hankeListLink').click();
    await page.getByPlaceholder('Esim. hankkeen nimi tai tunnus').fill(ajonNimi);
    await page.getByLabel('Search', { exact: true }).click();
    await page.getByText(`${hanketunnus}`).click();
})