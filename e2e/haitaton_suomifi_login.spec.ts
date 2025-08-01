import { test, expect } from '@playwright/test';
import {
  perustaja,
  vastaava,
  testiOsoite,
  helsinkiLogin,
  hankeName,
  nextAndCloseToast,
  daysFromTodayDate,
  monthAndDayFromTodayDate,
} from './_setup';

test('Toiminnallisia testejä', async ({ page }) => {
  // Testataan:
  // Johtoselvityshakemus ei ole käytettävissä ennen kirjautumista
  // Ohjeet sivu
  // Lisätietolinkit aukeaa ohjeista hanketta luodessa
  // Käyttöoikeuksia pystyy muuttamaan

  test.setTimeout(300000);

  // Johtoselvityshakemus ei ole käytettävissä ennen kirjautumista
  await expect(
    page.getByLabel('Asiointi yksityisellä alueella.', { exact: true }),
  ).not.toBeVisible();
  await helsinkiLogin(page);

  // ohjeet ja lisätietokortit
  await expect(page.getByRole('link', { name: 'Työohjeet' })).toBeVisible();
  await page.getByRole('link', { name: 'Työohjeet' }).click();
  await expect(page.getByLabel('Haittojenhallinnan lisä')).toBeVisible();
  await expect(page.getByLabel('Työmaan luvat ja ohjeet.')).toBeVisible();
  await expect(page.getByLabel('Maksut. Avautuu uudessa vä')).toBeVisible();
  await expect(page.getByLabel('Tilapäisten liikennejä')).toBeVisible();
  await page.getByRole('button', { name: '1. Tiedotus eri osapuolille ja palaute' }).click();
  await expect(
    page.getByText(
      'Tiedotus eri osapuolille ja palauteVaadittava perustasoKerro alueen asukkaille',
    ),
  ).toBeVisible();
  await page
    .getByRole('button', { name: '2. Esteettömyys sekä kulkureittien pinnanlaatu' })
    .click();
  await expect(
    page.getByText(
      'Esteettömyys sekä kulkureittien pinnanlaatuVaadittava perustasoSulkupuomi tai –',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: '3. Jalankulun reitit sekä' }).click();
  await expect(
    page.getByText(
      'Jalankulun reitit sekä kadun ylitysVaadittava perustasoJalankulku tulee ohjata',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: '4. Pyöräliikenteen reitit, py' }).click();
  await expect(
    page.getByText(
      'Pyöräliikenteen reitit, pyöräpysäköinti sekä kadun ylitysVaadittava perustasoPy',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: '5. Jalankulun ja pyörä' }).click();
  await expect(
    page.getByText('Jalankulun ja pyöräliikenteen opastaminenVaadittava perustaso Siirrot:Jos'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Kaivannot ja sillat' }).click();
  await expect(
    page.getByText('Kaivannot ja sillatVaadittava perustasoJalkakäytävällä, pyörätiellä tai'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Työmaa-aidat ja valaistus' }).click();
  await expect(
    page.getByText('Työmaa-aidat ja valaistusVaadittava perustasoYhtenäiset työmaa-aidat rajaavat'),
  ).toBeVisible();
  await page.getByRole('button', { name: '8. Julkisen liikenteen ja pys' }).click();
  await expect(
    page.getByText('Julkisen liikenteen ja pysäkkien huomioon ottaminenVaadittava perustasoJos'),
  ).toBeVisible();
  await page.getByRole('button', { name: '9. Kiinteistöjen ja' }).click();
  await expect(
    page.getByText('Kiinteistöjen ja liikkeenharjoittajien tarpeetVaadittava perustasoKadun'),
  ).toBeVisible();
  await page.getByRole('button', { name: '10. Melu-, pöly- ja tärinä' }).click();
  await expect(page.locator('.StaticContent_main__CMrTP')).toBeVisible();
  await page.getByLabel('Haittojenhallinnan lisä').click();
  await expect(
    page.getByText(
      'Haittojenhallinnan lisätietokortitNämä lisätietokortit täydentävät Haitaton-jä',
    ),
  ).toBeVisible();

  // Helsinki logo palauttaa etusivulle
  await page.getByRole('banner').getByRole('link', { name: 'Helsingin kaupunki' }).click();

  // Lisätietokortit hankkeen luonnin yhteydessä
  await page.getByLabel('Asiointi yleisellä alueella.', { exact: true }).click();
  await page.getByTestId('nimi').click();
  const ajonNimi = hankeName(`toiminnallinen_testi`);
  await page.getByTestId('nimi').fill(ajonNimi);
  await page.getByTestId('perustaja.sahkoposti').click();
  await page.getByTestId('perustaja.sahkoposti').fill(perustaja.email);
  await page.getByTestId('perustaja.puhelinnumero').click();
  await page.getByTestId('perustaja.puhelinnumero').fill(perustaja.phonenumber);
  await page.getByRole('button', { name: 'Luo hanke' }).click();
  await page.getByTestId('kuvaus').click();
  await page.getByTestId('kuvaus').fill(`${ajonNimi} Testataan toiminnallisuuksia`);
  await page.getByTestId('tyomaaKatuosoite').click();
  await page.getByTestId('tyomaaKatuosoite').fill(testiOsoite.address);
  await page.getByText('Ohjelmointi').click();
  await page.getByRole('button', { name: /Työn tyyppi/ }).click();
  await page.getByRole('option', { name: /Vesi/ }).click();
  await page.getByRole('button', { name: /Työn tyyppi/ }).click();
  await nextAndCloseToast(page, 'Seuraava', 'Hanke tallennettu');

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
  await page.getByRole('button', { name: monthAndDayFromTodayDate(0), exact: true }).click();
  await page.getByLabel('Haittojen loppupäivä*').click();
  await page.getByLabel('Haittojen loppupäivä*').fill(daysFromTodayDate(7));
  await page.getByRole('combobox', { name: /Meluhaitta/ }).click();
  await page.getByRole('option', { name: 'Satunnainen meluhaitta' }).click();
  await page.getByRole('combobox', { name: /Pölyhaitta/ }).click();
  await page.getByRole('option', { name: 'Satunnainen pölyhaitta' }).click();
  await page.getByRole('combobox', { name: /Tärinähaitta/ }).click();
  await page.getByRole('option', { name: 'Satunnainen tärinähaitta' }).click();
  await page.getByRole('combobox', { name: /Autoliikenteen kaistahaitta/ }).click();
  await page.getByRole('option', { name: 'Yksi autokaista vähenee -' }).click();
  await page.getByRole('combobox', { name: /Kaistahaittojen pituus/ }).click();
  await page.getByRole('option', { name: 'Alle 10 m' }).click();
  await nextAndCloseToast(page, 'Seuraava', 'Hanke tallennettu');

  // testataan ohjeiden linkkien toimivuus

  await page
    .getByRole('button', { name: 'Kulkuyhteydet kiinteistöihin ja joukkoliikennepysäkeille' })
    .click();
  const page1Promise = page.waitForEvent('popup');
  await page
    .getByTestId('test-common-nuisances')
    .getByLabel('8. Julkisen liikenteen ja pysäkkien huomioon ottaminen')
    .click();
  const page1 = await page1Promise;
  await expect(
    page1.getByRole('heading', { name: '8. Julkisen liikenteen ja pysäkkien huomioon ottaminen' }),
  ).toBeVisible({ timeout: 30000 });
  await page1.close();
  const page2Promise = page.waitForEvent('popup');
  await page
    .getByTestId('test-common-nuisances')
    .getByLabel('9. Kiinteistöjen ja liikkeenharjoittajien tarpeet')
    .click();
  const page2 = await page2Promise;
  await expect(
    page2.getByRole('heading', { name: '9. Kiinteistöjen ja liikkeenharjoittajien tarpeet' }),
  ).toBeVisible({ timeout: 30000 });
  await page2.close();

  await page.getByRole('button', { name: 'Jalankulun turvalliset ja esteettömät reitit' }).click();
  const page3Promise = page.waitForEvent('popup');
  await page
    .getByTestId('test-common-nuisances')
    .getByLabel('2. Esteettömyys sekä kulkureittien pinnanlaatu')
    .click();
  const page3 = await page3Promise;
  await expect(
    page3.getByRole('heading', { name: '2. Esteettömyys sekä kulkureittien pinnanlaatu' }),
  ).toBeVisible({ timeout: 30000 });
  await page3.close();
  const page4Promise = page.waitForEvent('popup');
  await page
    .getByTestId('test-common-nuisances')
    .getByLabel('3. Jalankulun reitit sekä kadun ylitys')
    .click();
  const page4 = await page4Promise;
  await expect(
    page4.getByRole('heading', { name: '3. Jalankulun reitit sekä kadun ylitys' }),
  ).toBeVisible({ timeout: 30000 });
  await page4.close();
  const page5Promise = page.waitForEvent('popup');
  await page
    .getByTestId('test-common-nuisances')
    .getByRole('link', { name: '5. Jalankulun ja pyöräliikenteen opastaminen' })
    .click();
  const page5 = await page5Promise;
  await expect(
    page5.getByRole('heading', { name: '5. Jalankulun ja pyöräliikenteen opastaminen' }),
  ).toBeVisible({ timeout: 30000 });
  await page5.close();
  const page6Promise = page.waitForEvent('popup');
  await page.getByTestId('test-common-nuisances').getByLabel('6. Kaivannot ja sillat').click();
  const page6 = await page6Promise;
  await expect(page6.getByRole('heading', { name: '6. Kaivannot ja sillat' })).toBeVisible({
    timeout: 30000,
  });
  await page6.close();
  const page7Promise = page.waitForEvent('popup');
  await page
    .getByTestId('test-common-nuisances')
    .getByRole('link', { name: '7. Työmaa-aidat ja valaistus' })
    .click();
  const page7 = await page7Promise;
  await expect(page7.getByRole('heading', { name: '7. Työmaa-aidat ja valaistus' })).toBeVisible({
    timeout: 30000,
  });
  await page7.close();

  await page.getByRole('button', { name: 'Opastus, liikenteenohjaus ja valaistus' }).click();
  await page
    .getByRole('button', { name: 'Työalueen suunnittelu ja järjestelyiden ylläpito' })
    .click();
  const page8Promise = page.waitForEvent('popup');
  await page
    .getByTestId('test-common-nuisances')
    .getByLabel('10. Melu-, pöly- ja tärinä sekä työmaan siisteys ja järjestelyiden ylläpito')
    .click();
  const page8 = await page8Promise;
  await expect(
    page8.getByRole('heading', {
      name: '10. Melu-, pöly- ja tärinä sekä työmaan siisteys ja järjestelyiden ylläpito',
    }),
  ).toBeVisible({ timeout: 30000 });
  await page8.close();

  await page.getByRole('button', { name: 'Pelastustoimi' }).click();

  await page.getByRole('button', { name: 'Yhteensovitus muiden' }).click();

  await page.getByRole('button', { name: 'Yhteensovitus olevien' }).click();

  await page.getByRole('button', { name: 'Liikennevalo-ohjaus' }).click();

  await page.getByRole('button', { name: 'Hankeviestintä' }).click();
  const page9Promise = page.waitForEvent('popup');
  await page
    .getByTestId('test-common-nuisances')
    .getByLabel('1. Tiedotus eri osapuolille ja palaute')
    .click();
  const page9 = await page9Promise;
  await expect(
    page9.getByRole('heading', { name: '1. Tiedotus eri osapuolille ja palaute' }),
  ).toBeVisible({ timeout: 10000 });
  await page9.close();

  await page.getByRole('button', { name: 'Erikoiskuljetusten reitit' }).click();

  await page.getByRole('button', { name: 'Junaliikenne' }).click();

  await page.getByRole('button', { name: 'Metroliikenne' }).click();

  await page.getByRole('button', { name: 'Sähköautojen latauspisteet' }).click();

  await page.getByRole('button', { name: 'Sähköpotkulautojen pysäköintialueet' }).click();

  // Käyttöoikeudet

  await page
    .locator('div')
    .filter({ hasText: /^4Yhteystiedot$/ })
    .click();
  await page.getByRole('alert').getByLabel('Close toast', { exact: true }).click({ timeout: 5000 });

  await page.getByRole('button', { name: /Yhteyshenkilöt/ }).click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page.getByRole('button', { name: 'Lisää uusi yhteyshenkilö' }).click();
  await page.getByTestId('etunimi').fill('Testi');
  await page.getByTestId('sukunimi').fill('Automaatio');
  await page.getByTestId('sahkoposti').fill(`${vastaava.email}`);
  await page.getByTestId('puhelinnumero').fill(`${vastaava.phonenumber}`);
  await page.getByRole('button', { name: 'Tallenna ja lisää yhteyshenkilö' }).click();

  // Vaihtele käyttöoikeuksia
  await page.getByTestId('save-form-btn').click();
  await page.getByRole('button', { name: 'Käyttäjähallinta' }).click();
  const row = page.locator('tr', {
    has: page.locator('td', { hasText: 'Testi Automaatio' }),
  });
  await expect(row.locator('td', { hasText: 'Katseluoikeus' })).toBeVisible({ timeout: 10_000 });

  await row.getByRole('link', { name: 'Muokkaa tietoja' }).click();
  await page.getByLabel('Katseluoikeus').click();
  await page.getByRole('option', { name: 'Kaikki oikeudet' }).click();
  await page.getByRole('button', { name: 'Tallenna muutokset' }).click();
  await expect(page.getByText('Käyttäjätiedot päivitetty', { exact: true })).toBeVisible();
  await expect(row.locator('td', { hasText: 'Kaikki oikeudet' })).toBeVisible({ timeout: 10_000 });

  await row.getByRole('link', { name: 'Muokkaa tietoja' }).click();
  await page.getByLabel('Kaikki oikeudet').click();
  await page.getByRole('option', { name: 'Hankkeen ja hakemusten' }).click();
  await page.getByRole('button', { name: 'Tallenna muutokset' }).click();
  await expect(page.getByText('Käyttäjätiedot päivitetty', { exact: true })).toBeVisible();
  await expect(row.locator('td', { hasText: 'Hankkeen ja hakemusten' })).toBeVisible({
    timeout: 10_000,
  });

  await row.getByRole('link', { name: 'Muokkaa tietoja' }).click();
  await page.getByLabel('Hankkeen ja hakemusten').click();
  await page.getByRole('option', { name: 'Hankemuokkaus' }).click();
  await page.getByRole('button', { name: 'Tallenna muutokset' }).click();
  await expect(page.getByText('Käyttäjätiedot päivitetty', { exact: true })).toBeVisible();
  await expect(row.locator('td', { hasText: 'Hankemuokkaus' })).toBeVisible({ timeout: 10_000 });

  await row.getByRole('link', { name: 'Muokkaa tietoja' }).click();
  await page.getByLabel('Hankemuokkaus').click();
  await page.getByRole('option', { name: 'Hakemusasiointi' }).click();
  await page.getByRole('button', { name: 'Tallenna muutokset' }).click();
  await expect(page.getByText('Käyttäjätiedot päivitetty', { exact: true })).toBeVisible();
  await expect(row.locator('td', { hasText: 'Hakemusasiointi' })).toBeVisible({ timeout: 10_000 });

  await row.getByRole('link', { name: 'Muokkaa tietoja' }).click();
  await page.getByLabel('Hakemusasiointi').click();
  await page.getByRole('option', { name: 'Katseluoikeus' }).click();
  await page.getByRole('button', { name: 'Tallenna muutokset' }).click();
  await expect(page.getByText('Käyttäjätiedot päivitetty', { exact: true })).toBeVisible();
  await expect(row.locator('td', { hasText: 'Katseluoikeus' })).toBeVisible({ timeout: 10_000 });
});
