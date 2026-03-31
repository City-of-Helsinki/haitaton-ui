import { Page } from '@playwright/test';
import { DRAWTOOLTYPE } from '../../src/common/components/map/modules/draw/types';
import { perustaja, rakennuttaja, suorittaja, testiOsoite, daysFromTodayDate } from './test-data';
import { nextAndCloseToast } from './auth';

export async function createAndFillHankeForm(
  page: Page,
  nimi: string,
  drawTool: DRAWTOOLTYPE = DRAWTOOLTYPE.SQUARE,
) {
  await page.getByLabel('Asiointi yleisellä alueella.', { exact: true }).click();
  await page.getByTestId('nimi').fill(nimi);
  await page.getByTestId('perustaja.sahkoposti').fill(perustaja.email);
  await page.getByTestId('perustaja.puhelinnumero').fill(perustaja.phonenumber);
  await page.getByRole('button', { name: 'Luo hanke' }).click();
  await page.getByTestId('kuvaus').click();
  await page.getByTestId('kuvaus').fill(`${nimi} Tämä on testiautomaatiota varten luotu`);
  await page.getByTestId('tyomaaKatuosoite').click();
  await page.getByTestId('tyomaaKatuosoite').fill(testiOsoite.address);
  await page.getByText('Ohjelmointi').click();
  await page.getByRole('button', { name: /Työn tyyppi/ }).click();
  await page.getByRole('option', { name: /Vesi/ }).click();
  await page.getByRole('button', { name: /Työn tyyppi/ }).click();
  await nextAndCloseToast(page, 'Seuraava', 'Hanke tallennettu');

  await page.getByTestId(`draw-control-${drawTool}`).click();
  if (drawTool === DRAWTOOLTYPE.SQUARE) {
    await page
      .locator('canvas')
      .first()
      .click({
        position: {
          x: 203,
          y: 441,
        },
      });
    await page
      .locator('canvas')
      .first()
      .click({
        position: {
          x: 577,
          y: 179,
        },
      });
  } else {
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
  }
  await page.getByLabel('Haittojen alkupäivä*').first().fill(daysFromTodayDate(-7));
  await page.getByLabel('Haittojen alkupäivä*').first().press('Enter');
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
  await page.keyboard.press('Escape');
  await nextAndCloseToast(page, 'Seuraava', 'Hanke tallennettu');

  let count = await page.getByText(/Lisää toimet haittojen hallintaan/).count();
  while (count > 0) {
    await page
      .getByText(/Lisää toimet haittojen hallintaan/)
      .first()
      .click();
    count -= 1;
  }

  await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.YLEINEN').focus();
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.YLEINEN')
    .fill('testiautomaatio toimet hankealue1');
  await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE').focus();
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE')
    .fill('testiautomaatiotoimet raitioliikenne');
  await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.PYORALIIKENNE').focus();
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.PYORALIIKENNE')
    .fill('testiautomaatiotoimet pyöräliikenne');
  await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.AUTOLIIKENNE').focus();
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.AUTOLIIKENNE')
    .fill('testiautomaatiotoimet autoliikenne');
  await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE').focus();
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE')
    .fill('testiautomaatiotoimet linjaautoliikenne');
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.MUUT')
    .fill('testiautomaatiotoimet bussiliikenne');
  await nextAndCloseToast(page, 'Seuraava', 'Hanke tallennettu');

  await page.getByRole('combobox', { name: 'Nimi *' }).click();
  await page.getByRole('combobox', { name: 'Nimi *' }).fill(perustaja.username);
  await page.getByTestId('omistajat.0.ytunnus').fill(perustaja.y_tunnus);
  await page.getByTestId('omistajat.0.email').fill(perustaja.email);
  await page.getByTestId('omistajat.0.puhelinnumero').fill(perustaja.phonenumber);
  await page.getByRole('button', { name: /Yhteyshenkilöt/ }).click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page.getByRole('button', { name: 'Lisää rakennuttaja' }).click();
  await page.locator('[id="rakennuttajat\\.0\\.nimi"]').fill(rakennuttaja.username);
  await page.getByTestId('rakennuttajat.0.ytunnus').fill(rakennuttaja.y_tunnus);
  await page.getByTestId('rakennuttajat.0.email').fill(rakennuttaja.email);
  await page.getByTestId('rakennuttajat.0.puhelinnumero').fill(rakennuttaja.phonenumber);
  await page
    .getByRole('region', { name: 'Rakennuttajan tiedot' })
    .getByRole('button', { name: /Yhteyshenkilöt/ })
    .click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page.getByRole('button', { name: 'Lisää toteuttaja' }).click();
  await page.locator('[id="toteuttajat\\.0\\.nimi"]').fill(suorittaja.username);
  await page.getByTestId('toteuttajat.0.ytunnus').fill(suorittaja.y_tunnus);
  await page.getByTestId('toteuttajat.0.email').fill(suorittaja.email);
  await page.getByTestId('toteuttajat.0.puhelinnumero').fill(suorittaja.phonenumber);
  await page
    .getByRole('region', { name: 'Toteuttajan tiedot' })
    .getByRole('button', { name: /Yhteyshenkilöt/ })
    .click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await nextAndCloseToast(page, 'Seuraava', 'Hanke tallennettu');
  await nextAndCloseToast(page, 'Seuraava', 'Hanke tallennettu');
}
