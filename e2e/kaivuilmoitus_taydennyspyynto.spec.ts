import { test, expect } from '@playwright/test';
import { perustaja, suorittaja, rakennuttaja, vastaava, asianhoitaja, testiData, testiOsoite, helsinkiLogin, hankeName } from './_setup';

test.beforeEach('Helsinki_login', async ({ page }) => {
  await helsinkiLogin(page);
});


test('Kaivuilmoitus täydennyspyyntö', async ({ page }) => {
    test.setTimeout(560000);
    await page.getByLabel('Luo uusi hanke.', { exact: true }).click();
    const ajonNimi = hankeName(`kaivuilmoitus-taydennyspyynto`)
    console.log(ajonNimi)
    await page.getByTestId('nimi').fill(ajonNimi);
    await page.getByTestId('perustaja.sahkoposti').fill(perustaja.email);
    await page.getByTestId('perustaja.puhelinnumero').fill(perustaja.phonenumber);
    await page.getByRole('button', { name: 'Luo hanke' }).click();
    await page.getByTestId('kuvaus').click();
    await page.getByTestId('kuvaus').fill('Testiautomaatio');
    await page.getByTestId('tyomaaKatuosoite').click();
    await page.getByTestId('tyomaaKatuosoite').fill(testiOsoite.address);
    await page.getByText('Ohjelmointi').click();
    await page.getByLabel('', { exact: true }).click();
    await page.getByLabel('Työn tyyppi: Sulje ja avaa').click();
    await page.getByRole('option', { name: 'Vesi', exact: true }).getByLabel('check').click();
    await page.getByLabel('Työn tyyppi: Sulje ja avaa').click();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
    await page.getByTestId('draw-control-Square').click();
    await page.locator('canvas').first().click({
    position: {
      x: 203,
      y: 441
    }
    });
    await page.locator('canvas').first().click({
    position: {
      x: 577,
      y: 179
    }
    });
    await page.getByLabel('Valitse päivämäärä').first().click();
    await page.getByRole('button', { name: `${testiData.currentMonth} ${testiData.todayDate}`, exact: true }).click();
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

    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.YLEINEN').focus();
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.YLEINEN').fill('testiautomaatio toimet hankealue1');
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE').focus();
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE').fill('testiautomaatiotoimet raitioliikenne');
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.PYORALIIKENNE').focus();
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.PYORALIIKENNE').fill('testiautomaatiotoimet pyöräliikenne');
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.AUTOLIIKENNE').focus();
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.AUTOLIIKENNE').fill('testiautomaatiotoimet autoliikenne');
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE').focus();
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE').fill('testiautomaatiotoimet linjaautoliikenne');
    await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.MUUT').fill('testiautomaatiotoimet bussiliikenne');
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
    await page.getByRole('combobox', { name: 'Nimi *' }).click();
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
    await page.getByRole('region', { name: 'Rakennuttajan tiedot' }).getByLabel('Yhteyshenkilöt: Sulje ja avaa').click();
    await page.getByRole('option', { name: `${perustaja.username}` }).click();
    await page.getByRole('button', { name: 'Lisää toteuttaja' }).click();
    await page.locator('[id="toteuttajat\\.0\\.nimi"]').fill(suorittaja.username);
    await page.getByTestId('toteuttajat.0.ytunnus').fill(suorittaja.y_tunnus);
    await page.getByTestId('toteuttajat.0.email').fill(suorittaja.email);
    await page.getByTestId('toteuttajat.0.puhelinnumero').fill(suorittaja.phonenumber);
    await page.getByRole('region', { name: 'Toteuttajan tiedot' }).getByLabel('Yhteyshenkilöt: Sulje ja avaa').click();
    await page.getByRole('option', { name: `${perustaja.username}` }).click();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await page.getByText('Hakemus tallennettu').waitFor({ state: 'hidden', timeout: 10000 });
    await page.getByRole('button', { name: 'Tallenna ja lisää hakemuksia', exact: true }).click();
    // Lisää kaivuilmoitus
    await page.getByLabel('', { exact: true }).click();
    await page.getByRole('option', { name: 'Kaivuilmoitus (ja' }).click();
    await page.getByRole('button', { name: 'Luo hakemus' }).click();
    await page.getByTestId('applicationData.name').fill(ajonNimi);
    await page.getByLabel('Työn kuvaus*').fill('Työn kuvaus');
    await page.getByLabel('Uuden rakenteen tai johdon').check();
    await page.getByText('Hae uusi johtoselvitys').click();
    await page.getByPlaceholder('SLXXXXXXX').fill('SL1111111');
    await page.getByTestId('placementContract-addButton').click();
    await page.getByTestId('applicationData.requiredCompetence').check();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await page.getByLabel('Valitse päivämäärä').first().click();
    await page.getByRole('button', { name: `${testiData.currentMonth} ${testiData.todayDate}`, exact: true }).click();
    await page.getByLabel('Työn loppupäivämäärä*').fill(testiData.tomorrowType);
    await page.locator('canvas').nth(1).click({
      position: {
        x: 552,
        y: 216
      }
    });
    await page.getByRole('button', { name: 'Kopioi työalueeksi' }).click();
    await expect(page.getByTestId('applicationData.areas.0.katuosoite')).toBeVisible();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.YLEINEN').focus();
    await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.YLEINEN').fill('Hankealue 1 Haittojenhallintasuunnitelma');
    await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE').focus();
    await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE').fill('Raitioliikennesuunnitelma');
    await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.PYORALIIKENNE').focus();
    await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.PYORALIIKENNE').fill('Pyöräliikenteensuunnitelma');
    await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.AUTOLIIKENNE').focus();
    await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.AUTOLIIKENNE').fill('Autoliikenteensuunnitelma');
    await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE').focus();
    await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE').fill('Linjaautoliikennesuunnitelma');
    await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.MUUT').focus();
    await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.MUUT').fill('Muut haittojenhallinta suunnitelmat');
    await page.getByRole('button', { name: 'Seuraava' }).focus();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await page.locator('[id="applicationData\\.customerWithContacts\\.customer\\.name"]').fill(vastaava.username);
    await page.getByTestId('applicationData.customerWithContacts.customer.registryKey').fill(vastaava.y_tunnus);
    await page.getByTestId('applicationData.customerWithContacts.customer.email').fill(vastaava.email);
    await page.getByTestId('applicationData.customerWithContacts.customer.phone').fill(vastaava.phonenumber);
    await page.locator("[id$=toggle-button]").nth(1).click()
    await page.getByRole('option', { name: `${perustaja.username}` }).click();
    await page.locator('[id="applicationData\\.contractorWithContacts\\.customer\\.name"]').fill(suorittaja.username);
    await page.getByTestId('applicationData.contractorWithContacts.customer.registryKey').fill(suorittaja.y_tunnus);
    await page.getByTestId('applicationData.contractorWithContacts.customer.email').fill(suorittaja.email);
    await page.getByTestId('applicationData.contractorWithContacts.customer.phone').fill(suorittaja.phonenumber);
    await page.getByRole('region', { name: 'Työn suorittajan tiedot' }).getByLabel('Yhteyshenkilöt: Sulje ja avaa').click();
    await page.getByRole('option', { name: `${perustaja.username}` }).click();
    await page.getByTestId('applicationData.invoicingCustomer.name').fill(asianhoitaja.username);
    await page.getByTestId('applicationData.invoicingCustomer.registryKey').fill(asianhoitaja.y_tunnus);
    await page.getByTestId('applicationData.invoicingCustomer.invoicingOperator').click();
    await page.getByTestId('applicationData.invoicingCustomer.ovt').click();
    await page.getByTestId('applicationData.invoicingCustomer.ovt').fill('0000000000000');
    await page.getByTestId('applicationData.invoicingCustomer.invoicingOperator').fill('1');
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await page.getByRole('button', { name: 'Lähetä hakemus' }).click();
    await page.getByRole('button', { name: 'Vahvista' }).click();
    await expect(page.getByText('Hakemus lähetetty')).toBeVisible({timeout:40000});
    await expect(page.locator("[data-testid=related_hanke]")).toBeVisible({timeout:30000})
    await page.locator("[data-testid=related_hanke]").click();
    await expect(page.getByText("Hakemukset", {exact:true})).toBeVisible({timeout:10000})
    await page.getByText("Hakemukset", {exact:true}).click();

    let johtoselvitys = await page.locator("[data-testid^=applicationViewLinkIdentifier-JS]").textContent();
    let kaivuilmoitus = await page.locator("[data-testid^=applicationViewLinkIdentifier-KP]").textContent();
    let hanketunnus = await page.locator("[data-testid^=hanke-tunnus]").textContent();

    // käsittely
    await page.goto(testiData.allu_url);
    await expect(page.getByPlaceholder('Username')).toBeEmpty();
    await page.getByPlaceholder('Username').fill(testiData.allupw);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('link', { name: 'HAKEMUKSET' })).toBeVisible();
    await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
    await expect(page.getByRole('button', { name: 'HAE' })).toBeVisible();
    await page.getByRole('button', { name: 'HAE' }).click();
    // kaivuilmoitus
    await expect(page.getByRole('link', { name: `${kaivuilmoitus}` })).toBeVisible({timeout:20000})
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
    await page.getByRole('button', { name: 'HAE' }).click();
    await expect(page.getByRole('link', { name: `${johtoselvitys}` })).toBeVisible({timeout:20000})
    await page.getByRole('link', { name: `${johtoselvitys}` }).click();
    await page.getByRole('button', { name: 'NÄYTÄ UUDET TIEDOT' }).click();
    await page.getByRole('button', { name: 'KÄSITTELYYN' }).click();
    await page.getByLabel('Hakemuksen lajit *').getByText('Hakemuksen lajit').click();
    await page.getByText('Katu- ja vihertyöt').click();
    await page.locator('.cdk-overlay-container > div:nth-child(3)').click();
    await expect(page.getByRole('button', { name: 'TALLENNA' })).toBeVisible();
    await page.getByRole('button', { name: 'TALLENNA' }).click();

    // Odotetaan tuloksia
    await expect(async () => {
      await page.goto(`${testiData.hankesalkku}${hanketunnus}`)
      await page.getByText('Hakemukset').click();
      await expect(page.getByTestId('application-card').first()).toContainText('Käsittelyssä', { timeout: 2000, });
      await expect(page.getByTestId('application-card').nth(1)).toContainText('Käsittelyssä', { timeout: 2000, });
    }).toPass({ intervals: [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000], timeout: 120000, });


    await page.goto(testiData.allu_url);
    await expect(page.getByPlaceholder('Username')).toBeEmpty();
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
    // Odotetaan tuloksia
    await expect(async () => {
      await page.goto(`${testiData.hankesalkku}${hanketunnus}`)
      await page.getByText('Hakemukset').click();
      await expect(page.getByTestId('application-status-tag').first()).toContainText('Täydennyspyyntö', { timeout: 2000, });
      await expect(page.getByTestId('application-status-tag').nth(1)).toContainText('Täydennyspyyntö', { timeout: 2000, });
    }).toPass({ intervals: [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000], timeout: 120000, });
    
    // johtoselvitys täydennyspyyntö
    await page.getByTestId(`applicationViewLinkIdentifier-${johtoselvitys}`).click();
    await page.getByRole('button', { name: 'Täydennä' }).click();
    await page.getByLabel('Työn kuvaus*').click();
    await page.getByLabel('Työn kuvaus*').fill(`Testiautomaatio täydennyspyyntö johtoselvitys ${testiData.runtime}`);
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
    await page.getByRole('button', { name: 'Lähetä täydennys' }).click();
    await page.getByTestId('dialog-button-test').click();
    await expect(page.getByTestId('application-status-tag')).toBeVisible({timeout:30000});

    // kaivuilmoitus täydennyspyyntö
    await page.goto(`${testiData.hankesalkku}${hanketunnus}`)
    await expect(page.getByText("Hakemukset", {exact:true})).toBeVisible({timeout:10000})
    await page.getByText("Hakemukset", {exact:true}).click();
    await page.getByTestId(`applicationViewLinkIdentifier-${kaivuilmoitus}`).click();
    await page.getByRole('button', { name: 'Täydennä' }).click();
    await page.getByLabel('Työn kuvaus*').click();
    await page.getByLabel('Työn kuvaus*').fill(`Testiautomaatio täydennyspyyntö kaivuilmoitus ${testiData.runtime}`);
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await expect(page.getByText('Hakemus tallennettu')).toBeVisible();
    await page.getByRole('button', { name: 'Lähetä täydennys' }).click();
    await page.getByTestId('dialog-button-test').click();
    await expect(page.getByLabel('Lähetetään')).toBeVisible();
    await expect(page.getByLabel('Lähetetään')).not.toBeVisible({timeout:30000});
    
    // täydennyspyynnöt suoritettu
    await expect(async () => {
      await page.goto(`${testiData.hankesalkku}${hanketunnus}`)
      await page.getByText('Hakemukset').click();
      await expect(page.getByTestId('application-status-tag').first()).toContainText('Täydennetty käsittelyyn', { timeout: 2000, });
      await expect(page.getByTestId('application-status-tag').nth(1)).toContainText('Täydennetty käsittelyyn', { timeout: 2000, });
    }).toPass({ intervals: [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000], timeout: 120000, });

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

    // tarkista haitattomasta
    await expect(async () => {
      await page.goto(`${testiData.hankesalkku}${hanketunnus}`)
      await page.getByText('Hakemukset').click();
      await expect(page.getByTestId('application-status-tag').first()).toContainText('Päätös', { timeout: 2000, });
      await expect(page.getByTestId('application-status-tag').nth(1)).toContainText('Päätös', { timeout: 2000, });
    }).toPass({ intervals: [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000], timeout: 120000, });

});
